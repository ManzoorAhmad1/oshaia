'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, setUser, clearAuth, setLoading, AuthUser } from '@/store/authSlice';
import { store } from '@/store/store';

// Re-export for api.ts backwards compatibility
export const ACCESS_TOKEN_KEY = 'oshaia_access_token';
export const REFRESH_TOKEN_KEY = 'oshaia_refresh_token';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook', token: string) => Promise<AuthUser>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  countryCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((s) => s.auth);
  const router = useRouter();

  // ── Fetch current user from /auth/me ──────────────────────────────────
  const refreshUser = useCallback(async () => {
    const token = store.getState().auth.accessToken;
    if (!token) { dispatch(clearAuth()); return; }
    try {
      const { data } = await api.get('/auth/me');
      dispatch(setUser(data.user));
    } catch {
      dispatch(clearAuth());
    }
  }, [dispatch]);

  // ── Login ─────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<AuthUser> => {
    const { data } = await api.post('/auth/login', { email, password });
    dispatch(setCredentials({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));
    return data.user;
  };

  // ── Register ──────────────────────────────────────────────────────────
  const register = async (registerData: RegisterData) => {
    const { data } = await api.post('/auth/register', registerData);
    dispatch(setCredentials({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));
  };

  // ── Social Login (Google / Facebook) ─────────────────────────────────────────
  const socialLogin = async (provider: 'google' | 'facebook', token: string): Promise<AuthUser> => {
    const { data } = await api.post('/auth/social-login', { provider, token });
    dispatch(setCredentials({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));
    return data.user;
  };

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      const refreshToken = store.getState().auth.refreshToken;
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore logout API errors
    } finally {
      dispatch(clearAuth());
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
