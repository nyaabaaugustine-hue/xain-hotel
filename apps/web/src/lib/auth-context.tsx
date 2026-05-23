"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";

interface User { id: number; fullname: string; email: string; isAdmin: number; image?: string; }
interface AuthCtx { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; }

const AuthContext = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/auth/me").then(r => setUser(r.data.data)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post("/api/auth/login", { email, password });
    setUser(r.data.data.user);
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    window.location.href = "/login";
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
