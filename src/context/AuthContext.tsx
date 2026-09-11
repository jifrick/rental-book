import React, { createContext, useContext, useState } from 'react';
import { useShopSettings } from '../hooks/useShopSettings';

interface AuthUser {
  email: string;
  name: string;
  shopName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'tool_rental_auth_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useShopSettings();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
  });

  const login = (email: string, _pass: string) => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email }));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const user: AuthUser | null = isAuthenticated
    ? {
        email: 'owner@toolrental.com',
        name: settings.owner_name,
        shopName: settings.shop_name,
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
