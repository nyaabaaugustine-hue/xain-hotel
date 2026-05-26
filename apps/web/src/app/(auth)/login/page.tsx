"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { IMAGES } from "@/lib/images";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const loading = submitting || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <Image src={IMAGES.resort} alt="" fill className="object-cover object-center" sizes="100vw" priority />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand-900/85" />
      <div className="absolute inset-0 adinkra-pattern opacity-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-5 shadow-2xl overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png"
              alt="Xain Hotel"
              width={72} height={72}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-display text-white font-semibold tracking-wide drop-shadow-lg">
            Xain Hotel
          </h1>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-1">Staff Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">Welcome back</h2>
          <p className="text-gray-400 text-sm text-center mb-7">Sign in to access the management suite</p>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="admin@xainhotel.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="input pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold mt-1 tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Default credentials: <span className="font-mono text-gray-600">admin@xainhotel.com / admin123</span></p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <Link href="/" className="text-white/30 hover:text-white/60 text-xs transition-colors">← Back to hotel website</Link>
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} Xain Hotel</p>
        </div>
      </div>
    </div>
  );
}
