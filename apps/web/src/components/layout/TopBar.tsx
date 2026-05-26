"use client";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Globe, ChevronRight } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard":    "Operations Dashboard",
  "/manage-rooms": "Room Management",
  "/reservations": "Reservations",
  "/customers":    "Guests",
  "/orders":       "Orders",
  "/hrm":          "Human Resources",
  "/reports":      "Reports & Analytics",
  "/settings":     "Settings",
};

export default function TopBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const pageLabel = ROUTE_LABELS[pathname] ?? "Dashboard";
  const firstName = user?.fullname?.split(" ")[0] ?? "Manager";
  const initial   = user?.fullname?.[0]?.toUpperCase() ?? "A";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-20">

      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 font-medium">Xain PMS</span>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="font-semibold text-gray-800">{pageLabel}</span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-3">

        {/* View website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-600 border border-gray-200 hover:border-brand-200 rounded-xl px-3 py-2 transition-all"
        >
          <Globe size={13} />
          Website
        </a>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
          <Bell size={15} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* User chip */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
            {initial}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-gray-800 leading-none">{firstName}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none capitalize">{user?.isAdmin ? "Administrator" : "Staff"}</p>
          </div>
        </div>

        {/* Logout button — always visible, top right */}
        <button
          onClick={async () => { await logout(); }}
          title="Sign out and return to website"
          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>

      </div>
    </header>
  );
}
