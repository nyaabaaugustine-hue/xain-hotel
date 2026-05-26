"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import DashboardFooter from "@/components/layout/DashboardFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-medium">Loading Xain PMS…</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-[1440px]">
            {children}
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
