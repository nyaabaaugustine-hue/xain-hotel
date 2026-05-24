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
      {/* Full-bleed background */}
      <Image src={IMAGES.resort} alt="" fill className="object-cover object-center" sizes="100vw" priority />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-brand-900/85" />
      <div className="absolute inset-0 adinkra-pattern opacity-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo + Hotel name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4 shadow-2xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png"
              alt="Xain Hotel Logo"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-display text-white font-semibold mb-1 drop-shadow-lg tracking-wide">Xain Hotel</h1>
          <p className="text-brand-200 text-xs tracking-[0.25em] uppercase font-medium">Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Sign in to your account</h2>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="admin@xainhotel.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3 text-base font-semibold mt-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">© {new Date().getFullYear()} Xain Hotel · Staff Portal</p>
      </div>
    </div>
  );
}
