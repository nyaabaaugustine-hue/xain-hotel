"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users, ShoppingCart,
  UserSquare2, BarChart3, Settings, LogOut, ChevronRight,
} from "lucide-react";

const nav = [
  { href: "/dashboard",    label: "Dashboard",   icon: LayoutDashboard, accent: "brand" },
  { href: "/manage-rooms", label: "Rooms",        icon: BedDouble,       accent: "sky" },
  { href: "/reservations", label: "Reservations", icon: CalendarCheck,   accent: "violet" },
  { href: "/customers",    label: "Guests",       icon: Users,           accent: "emerald" },
  { href: "/orders",       label: "Orders",       icon: ShoppingCart,    accent: "amber" },
  { href: "/hrm",          label: "HRM",          icon: UserSquare2,     accent: "rose" },
  { href: "/reports",      label: "Reports",      icon: BarChart3,       accent: "indigo" },
  { href: "/settings",     label: "Settings",     icon: Settings,        accent: "gray" },
];

const ACCENT_MAP: Record<string, { active: string; icon: string; bg: string }> = {
  brand:   { active: "bg-brand-50 text-brand-700 border-brand-100",   icon: "text-brand-600",  bg: "bg-brand-50" },
  sky:     { active: "bg-sky-50 text-sky-700 border-sky-100",         icon: "text-sky-600",    bg: "bg-sky-50" },
  violet:  { active: "bg-violet-50 text-violet-700 border-violet-100",icon: "text-violet-600", bg: "bg-violet-50" },
  emerald: { active: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: "text-emerald-600", bg: "bg-emerald-50" },
  amber:   { active: "bg-amber-50 text-amber-700 border-amber-100",   icon: "text-amber-600",  bg: "bg-amber-50" },
  rose:    { active: "bg-rose-50 text-rose-700 border-rose-100",      icon: "text-rose-600",   bg: "bg-rose-50" },
  indigo:  { active: "bg-indigo-50 text-indigo-700 border-indigo-100",icon: "text-indigo-600", bg: "bg-indigo-50" },
  gray:    { active: "bg-gray-100 text-gray-700 border-gray-200",     icon: "text-gray-500",   bg: "bg-gray-50" },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 min-h-screen bg-white flex flex-col fixed left-0 top-0 z-30 border-r border-gray-100/80">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm">
            <Image
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png"
              alt="Xain Hotel"
              width={36} height={36}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-sm leading-tight tracking-tight">Xain Hotel</p>
            <p className="text-gray-400 text-[10px] tracking-widest font-semibold uppercase">PMS Suite</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-0.5">
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em] px-3 mb-2 mt-1">Main</p>
        {nav.slice(0, 4).map(({ href, label, icon: Icon, accent }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const { active: activeCls, icon: iconCls } = ACCENT_MAP[accent];
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group border",
              active
                ? `${activeCls} border shadow-sm`
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border-transparent"
            )}>
              <Icon size={16} className={cn(active ? iconCls : "text-gray-400 group-hover:text-gray-600")} />
              <span className="flex-1 text-[13px]">{label}</span>
              {active && <ChevronRight size={12} className="opacity-40" />}
            </Link>
          );
        })}

        <div className="my-3 mx-3 border-t border-gray-100" />
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em] px-3 mb-2">Management</p>
        {nav.slice(4).map(({ href, label, icon: Icon, accent }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const { active: activeCls, icon: iconCls } = ACCENT_MAP[accent];
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group border",
              active
                ? `${activeCls} border shadow-sm`
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border-transparent"
            )}>
              <Icon size={16} className={cn(active ? iconCls : "text-gray-400 group-hover:text-gray-600")} />
              <span className="flex-1 text-[13px]">{label}</span>
              {active && <ChevronRight size={12} className="opacity-40" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade nudge */}
      <div className="mx-3 mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100/60">
        <p className="text-[11px] font-bold text-brand-700 mb-0.5">Xain Hotel · Premium</p>
        <p className="text-[10px] text-gray-500 leading-relaxed">All features active. Data syncing with Neon.</p>
      </div>

      {/* User area */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {user?.fullname?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-xs font-bold truncate">{user?.fullname}</p>
            <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-xs px-2 py-1.5 w-full rounded-lg hover:bg-red-50/80 transition-all font-medium">
          <LogOut size={12} /> Sign out
        </button>
      </div>
    </aside>
  );
}
