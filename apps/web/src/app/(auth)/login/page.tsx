"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { IMAGES } from "@/lib/images";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Full-bleed background image */}
      <Image src={IMAGES.resort} alt="" fill className="object-cover object-center" sizes="100vw" priority />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-brand-900/80" />
      {/* Subtle texture */}
      <div className="absolute inset-0 adinkra-pattern opacity-10" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display text-white font-semibold mb-1 drop-shadow-lg">Xain Hotel</h1>
          <p className="text-brand-200 text-sm tracking-widest uppercase font-medium">Management System</p>
        </div>
        <div className="bg-white/97 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Email address</label>
              <input type="email" className="input" placeholder="admin@xainhotel.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
              <input type="password" className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-white/60 text-xs mt-6">© {new Date().getFullYear()} Xain Hotel · Staff Portal</p>
      </div>
    </div>
  );
}
