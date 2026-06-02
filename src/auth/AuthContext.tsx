import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi, type AdminUser } from "@/api/auth";
import { ApiError } from "@/api/client";

const TOKEN_KEY = "nti-admin-token";
const EXP_KEY = "nti-admin-token-exp";

type AuthState = {
  token: string | null;
  user: AdminUser | null;
  isReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthState | null>(null);

function isExpired(): boolean {
  const exp = localStorage.getItem(EXP_KEY);
  if (!exp) return true;
  return new Date(exp).getTime() <= Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t || isExpired()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXP_KEY);
      return null;
    }
    return t;
  });
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    authApi
      .me(token)
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(EXP_KEY);
          setToken(null);
        }
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    const r = await authApi.login(username, password);
    localStorage.setItem(TOKEN_KEY, r.access_token);
    localStorage.setItem(EXP_KEY, r.expires_at);
    setToken(r.access_token);
    setUser(r.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isReady, login, logout }),
    [token, user, isReady, login, logout],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

export function useAuthToken(): string {
  const { token } = useAuth();
  if (!token) throw new Error("not authenticated");
  return token;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, isReady } = useAuth();
  const loc = useLocation();
  if (!isReady) return null;
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
  }
  return <>{children}</>;
}
