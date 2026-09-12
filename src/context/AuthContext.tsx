import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, Shop } from '../types/database';
import { getShops, getShopById, getShopByEmail, markPasswordChanged, subscribeToStore } from '../lib/storageService';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  shopId?: string;
  name: string;
  shopName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  currentShopId: string;
  currentShop: Shop | null;
  isAuthenticated: boolean;
  isTempPassword: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  changePassword: (newPass: string) => Promise<void>;
  switchShop: (shopId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'tool_rental_auth_session_v3';

interface StoredSession {
  userId: string;
  email: string;
  role: UserRole;
  shopId?: string;
  isTempPassword?: boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<StoredSession | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse auth session:', e);
    }
    return null;
  });

  const [shops, setShops] = useState<Shop[]>(() => getShops());

  useEffect(() => {
    return subscribeToStore(() => {
      setShops(getShops());
    });
  }, []);

  const saveSession = (sess: StoredSession | null) => {
    setSession(sess);
    if (sess) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sess));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // Sync session with Supabase Auth state if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session: supaSession } }) => {
        if (supaSession?.user) {
          syncSupabaseUser(supaSession.user.id, supaSession.user.email || '');
        }
      }).catch(console.error);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supaSession) => {
        if (supaSession?.user) {
          syncSupabaseUser(supaSession.user.id, supaSession.user.email || '');
        } else {
          saveSession(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const syncSupabaseUser = async (userId: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if platform admin
    if (cleanEmail === 'admin@rentalbook.com') {
      saveSession({
        userId,
        email: cleanEmail,
        role: 'platform_admin',
        shopId: shops[0]?.id || '55555555-0001-4000-8000-000000000001',
        isTempPassword: false,
      });
      return;
    }

    // Lookup in database shop_users table or shops table
    if (isSupabaseConfigured) {
      const { data: userLink } = await supabase
        .from('shop_users')
        .select('shop_id, role')
        .eq('user_id', userId)
        .maybeSingle();

      if (userLink) {
        const shop = getShopById(userLink.shop_id);
        saveSession({
          userId,
          email: cleanEmail,
          role: (userLink.role as UserRole) || 'shop_owner',
          shopId: userLink.shop_id,
          isTempPassword: Boolean(shop?.is_temp_password),
        });
        return;
      }
    }

    // Fallback email match
    const shop = getShopByEmail(cleanEmail);
    if (shop) {
      saveSession({
        userId,
        email: cleanEmail,
        role: 'shop_owner',
        shopId: shop.id,
        isTempPassword: Boolean(shop.is_temp_password),
      });
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Try Supabase Auth first if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (error) {
          // Fall through to database email lookup for local accounts if needed
          console.warn('Supabase Auth error:', error.message);
        } else if (data.user) {
          await syncSupabaseUser(data.user.id, cleanEmail);
          return { success: true };
        }
      } catch (err) {
        console.error('Login error:', err);
      }
    }

    // Local / Dev Fallback Email Authentication
    if (cleanEmail === 'admin@rentalbook.com') {
      if (pass.length >= 6) {
        saveSession({
          userId: 'admin-user-id',
          email: cleanEmail,
          role: 'platform_admin',
          shopId: shops[0]?.id || '55555555-0001-4000-8000-000000000001',
          isTempPassword: false,
        });
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password for Platform Admin.' };
      }
    }

    const shop = getShopByEmail(cleanEmail);
    if (!shop) {
      return { success: false, error: 'Invalid email address or password.' };
    }

    if (shop.status === 'SUSPENDED') {
      return { success: false, error: `Shop "${shop.name}" is currently suspended. Please contact platform admin.` };
    }

    saveSession({
      userId: `user-${shop.id}`,
      email: cleanEmail,
      role: 'shop_owner',
      shopId: shop.id,
      isTempPassword: Boolean(shop.is_temp_password),
    });

    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(console.error);
    }
    saveSession(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          return { success: false, error: error.message };
        }
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }
    return {
      success: true,
      message: 'If an account exists for this email address, password reset instructions have been sent.',
    };
  };

  const changePassword = async (newPass: string) => {
    if (isSupabaseConfigured) {
      await supabase.auth.updateUser({ password: newPass }).catch(console.error);
    }

    if (session?.shopId) {
      markPasswordChanged(session.shopId);
      saveSession({
        ...session,
        isTempPassword: false,
      });
    }
  };

  const switchShop = (shopId: string) => {
    if (session && session.role === 'platform_admin') {
      saveSession({
        ...session,
        shopId,
      });
    }
  };

  const currentShopId = session?.shopId || '55555555-0001-4000-8000-000000000001';
  const currentShop = getShopById(currentShopId) || shops[0] || null;

  const isAuthenticated = Boolean(session);
  const role: UserRole | null = session?.role || null;
  const isTempPassword = Boolean(session?.isTempPassword && role === 'shop_owner');

  const user: AuthUser | null = session
    ? {
        id: session.userId,
        email: session.email,
        role: session.role,
        shopId: session.shopId,
        name: session.role === 'platform_admin' ? 'Platform Administrator' : currentShop?.owner_name || 'Shop Owner',
        shopName: session.role === 'platform_admin' ? 'Platform Admin' : currentShop?.name || 'Rental Shop',
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        currentShopId,
        currentShop,
        isAuthenticated,
        isTempPassword,
        login,
        logout,
        resetPassword,
        changePassword,
        switchShop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
