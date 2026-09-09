import React, { createContext, useContext, useState } from 'react';

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
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        email: 'owner@toolrental.com',
        name: 'Moosa Ikka',
        shopName: 'Wayanaad Tool Rentals',
      };
    } catch {
      return {
        email: 'owner@toolrental.com',
        name: 'Moosa Ikka',
        shopName: 'Wayanaad Tool Rentals',
      };
    }
  });

  const login = (email: string, _pass: string) => {
    const newUser: AuthUser = {
      email,
      name: 'Moosa Ikka',
      shopName: 'Wayanaad Tool Rentals',
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
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
