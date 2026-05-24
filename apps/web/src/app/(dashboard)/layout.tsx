"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import { IMAGES } from "@/lib/images";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen overflow-auto relative">
        <Image src={IMAGES.g2} alt="" fill className="object-cover object-center opacity-5 pointer-events-none" sizes="100vw" />
        <div className="absolute inset-0 bg-white/60 pointer-events-none" />
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
