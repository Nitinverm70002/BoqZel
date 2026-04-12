'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from './NotificationContext';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  // NotificationProvider wraps AuthProvider in layout.tsx, so this is always safe
  const { notify } = useNotifications();

  useEffect(() => {
    // Check for login state on mount safely
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('boqzel_auth');
      const token = localStorage.getItem('boqzel_auth_token');
      if (storedAuth === 'true' || token) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const login = () => {
    localStorage.setItem('boqzel_auth', 'true');
    setIsLoggedIn(true);
    notify({
      type: 'success',
      icon: '👋',
      title: 'Welcome back!',
      message: 'Your trips and stays are ready to explore.',
      autoClose: 5000,
    });
    // Only redirect if we are not already on a page that handles it
    if (window.location.pathname.includes('/login') || window.location.pathname.includes('/auth/callback')) {
      router.push('/stays');
    }
  };

  const logout = () => {
    notify({
      type: 'info',
      icon: '✈️',
      title: 'See you around!',
      message: 'Your session has ended safely.',
      autoClose: 4000,
    });
    localStorage.removeItem('boqzel_auth');
    localStorage.removeItem('boqzel_auth_token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
