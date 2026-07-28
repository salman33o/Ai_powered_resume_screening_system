'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: number;
  username: string;
  role: string;
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  sessionToken: string | null;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = 'resume_ai_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const { user: storedUser, token } = JSON.parse(stored);
        setUser(storedUser);
        setSessionToken(token);
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setSession = (newUser: AuthUser, token: string) => {
    setUser(newUser);
    setSessionToken(token);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: newUser, token }));
    } catch (e) {
      console.error('Failed to persist session:', e);
    }
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, setSession, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
