'use client';

/**
 * Client-side view of the server session.
 *
 * The browser no longer decides who is signed in: it asks `/api/auth/me` and
 * the server answers from an HttpOnly cookie. The public shape of this hook is
 * unchanged so existing components keep working.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { basePath } from './api-url';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  points: number;
};

type AuthState = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  dialogOpen: boolean;
  openDialog: (reason?: string) => void;
  closeDialog: () => void;
  dialogReason: string;
  logoutError: string;
  clearLogoutError: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

type ApiPayload = { user?: User | null; error?: string };

async function postAuth(path: string, body?: unknown): Promise<User> {
  let res: Response;
  try {
    res = await fetch(basePath(path), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Không kết nối được máy chủ. Kiểm tra kết nối mạng rồi thử lại.');
  }

  const data = (await res.json().catch(() => null)) as ApiPayload | null;
  if (!res.ok || !data?.user) {
    throw new Error(data?.error || 'Không đăng nhập được.');
  }
  return data.user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogReason, setDialogReason] = useState('');
  const [logoutError, setLogoutError] = useState('');
  const authVersion = useRef(0);
  const notify = () => { try { localStorage.setItem('sdt.auth.changed', crypto.randomUUID()); } catch { /* storage may be disabled */ } };

  useEffect(() => {
    let cancelled = false;
    const version = ++authVersion.current;
    (async () => {
      try {
        const res = await fetch(basePath('/api/auth/me'), { cache: 'no-store' });
        const data = (await res.json()) as ApiPayload;
        if (!cancelled && version === authVersion.current) setUser(data?.user ?? null);
      } catch {
        if (!cancelled && version === authVersion.current) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sync = async () => {
      const version = ++authVersion.current;
      try {
        const response = await fetch(basePath('/api/auth/me'), { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && version === authVersion.current) setUser(data.user ?? null);
      } catch { /* retain current identity during network outages */ }
    };
    const changed = (event: StorageEvent) => { if (event.key === 'sdt.auth.changed') void sync(); };
    window.addEventListener('storage', changed);
    window.addEventListener('focus', sync);
    return () => { window.removeEventListener('storage', changed); window.removeEventListener('focus', sync); };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const version = ++authVersion.current;
    const next = await postAuth('/api/auth/login', { email, password });
    if (version !== authVersion.current) return;
    setUser(next);
    notify();
    setDialogOpen(false);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const version = ++authVersion.current;
    const next = await postAuth('/api/auth/register', { email, password, name });
    if (version !== authVersion.current) return;
    setUser(next);
    notify();
    setDialogOpen(false);
  }, []);

  const logout = useCallback(async () => {
    const version = ++authVersion.current;
    try {
      const response = await fetch(basePath('/api/auth/logout'), { method: 'POST' });
      if (!response.ok) throw new Error('Chưa đăng xuất được. Vui lòng thử lại.');
      if (version === authVersion.current) setUser(null);
      setLogoutError('');
      notify();
    } catch {
      setLogoutError('Chưa đăng xuất được. Kiểm tra kết nối và thử lại.');
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      ready,
      login,
      register,
      logout,
      dialogOpen,
      openDialog: (reason = '') => {
        setDialogReason(reason);
        setDialogOpen(true);
      },
      closeDialog: () => setDialogOpen(false),
      dialogReason,
      logoutError,
      clearLogoutError: () => setLogoutError(''),
    }),
    [user, ready, login, register, logout, dialogOpen, dialogReason, logoutError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
