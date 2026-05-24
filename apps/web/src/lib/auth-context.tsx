"use client";
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import api from "@/lib/api";

interface User { id: number; fullname: string; email: string; isAdmin: number; image?: string; }
interface AuthCtx { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; }

const AUTH_KEY = "xain_user";

function saveUser(u: User) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); } catch {}
}
function loadUser(): User | null {
  try { const s = localStorage.getItem(AUTH_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}
function clearUser() {
  try { localStorage.removeItem(AUTH_KEY); } catch {}
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hydrate from localStorage immediately so no flash-redirect on page refresh
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    return loadUser();
  });
  const [loading, setLoading] = useState(true);
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshFailRef = useRef(0);

  useEffect(() => {
    // Verify session with server; keep localStorage user while waiting
    api.get("/api/auth/me")
      .then(r => {
        const verified = r.data.data;
        setUser(verified);
        saveUser(verified);
      })
      .catch(err => {
        // Only clear session on an explicit 401 (not logged in).
        // Network errors / 5xx (cold-start API) keep the cached user.
        if (err?.response?.status === 401) {
          clearUser();
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    refreshFailRef.current = 0;
    refreshRef.current = setInterval(async () => {
      try {
        await api.post("/api/auth/refresh");
        refreshFailRef.current = 0; // reset on success
      } catch {
        refreshFailRef.current += 1;
        // Only force-logout after 3 consecutive refresh failures
        if (refreshFailRef.current >= 3) {
          clearUser();
          setUser(null);
          window.location.href = "/login";
        }
      }
    }, 10 * 60 * 1000);
    return () => { if (refreshRef.current) clearInterval(refreshRef.current); };
  }, [user]);

  const login = async (email: string, password: string) => {
    const r = await api.post("/api/auth/login", { email, password });
    const loggedIn = r.data.data.user;
    setUser(loggedIn);
    saveUser(loggedIn);
  };

  const logout = async () => {
    try { await api.post("/api/auth/logout"); } catch {}
    clearUser();
    setUser(null);
    window.location.href = "/login";
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
