import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, Shop } from '../types/database';
import { getShops, getShopById, getShopByUserIdCode, markPasswordChanged, subscribeToStore } from '../lib/storageService';

interface AuthUser {
  userId: string;
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
  login: (identity: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  changePassword: (newPass: string) => void;
  switchShop: (shopId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'tool_rental_auth_session_v2';

interface StoredSession {
  userId: string;
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
    // Default fallback to CK TOOLS owner for convenient dev experience
    return {
      userId: 'CKTOOLS001',
      role: 'shop_owner',
      shopId: '55555555-0001-4000-8000-000000000001',
      isTempPassword: false,
    };
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

  const login = (identity: string, pass: string): { success: boolean; error?: string } => {
    const cleanId = identity.trim();

    // 1. Check Platform Admin Login
    if (
      cleanId.toLowerCase() === 'admin@rentalbook.com' ||
      cleanId.toLowerCase() === 'admin'
    ) {
      if (pass === 'admin123' || pass.length >= 4) {
        const adminSess: StoredSession = {
          userId: 'ADMIN',
          role: 'platform_admin',
          shopId: shops[0]?.id || '55555555-0001-4000-8000-000000000001',
          isTempPassword: false,
        };
        saveSession(adminSess);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password for Platform Admin.' };
      }
    }

    // 2. Check Shop Owner Login
    const shop = getShopByUserIdCode(cleanId);
    if (!shop) {
      return { success: false, error: `No rental shop found for User ID "${cleanId}".` };
    }

    if (shop.status === 'SUSPENDED') {
      return { success: false, error: `Shop "${shop.name}" is currently suspended. Please contact platform admin.` };
    }

    const shopSess: StoredSession = {
      userId: shop.user_id_code,
      role: 'shop_owner',
      shopId: shop.id,
      isTempPassword: Boolean(shop.is_temp_password),
    };

    saveSession(shopSess);
    return { success: true };
  };

  const logout = () => {
    saveSession(null);
  };

  const changePassword = (_newPass: string) => {
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
        userId: session.userId,
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
