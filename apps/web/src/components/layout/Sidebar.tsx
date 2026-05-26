"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users, ShoppingCart,
  UserSquare2, BarChart3, Settings, LogOut, Hotel, ChevronRight,
} from "lucide-react";

const nav = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard, color: "text-brand-600" },
  { href: "/manage-rooms", label: "Rooms",         icon: BedDouble,        color: "text-sky-600" },
  { href: "/reservations", label: "Reservations",  icon: CalendarCheck,    color: "text-violet-600" },
  { href: "/customers",    label: "Customers",     icon: Users,            color: "text-emerald-600" },
  { href: "/orders",       label: "Orders",        icon: ShoppingCart,     color: "text-amber-600" },
  { href: "/hrm",          label: "HRM",           icon: UserSquare2,      color: "text-rose-600" },
  { href: "/reports",      label: "Reports",       icon: BarChart3,        color: "text-indigo-600" },
  { href: "/settings",     label: "Settings",      icon: Settings,         color: "text-gray-600" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 min-h-screen bg-white flex flex-col fixed left-0 top-0 z-30 border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow border border-gray-100 flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png"
              alt="Xain Hotel"
              width={40} height={40}
              className="object-contain w-full h-full"
            />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm leading-tight">Xain Hotel</p>
            <p className="text-gray-400 text-[10px] tracking-wide">Management Suite</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest px-3 mb-2">Main Menu</p>
        {nav.slice(0, 4).map(({ href, label, icon: Icon, color }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
              active
                ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100/60"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            )}>
              <Icon size={17} className={cn(active ? "text-brand-600" : color, "opacity-80 group-hover:opacity-100")} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="text-brand-400" />}
            </Link>
          );
        })}

        <div className="my-3 border-t border-gray-100" />
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest px-3 mb-2">Management</p>
        {nav.slice(4).map(({ href, label, icon: Icon, color }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
              active
                ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100/60"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            )}>
              <Icon size={17} className={cn(active ? "text-brand-600" : color, "opacity-80 group-hover:opacity-100")} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="text-brand-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {user?.fullname?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-xs font-semibold truncate">{user?.fullname}</p>
            <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-xs px-2 py-1.5 w-full rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}
