"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users, ShoppingCart,
  UserSquare2, BarChart3, Settings, LogOut, Hotel
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manage-rooms", label: "Rooms", icon: BedDouble },
  { href: "/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/hrm", label: "HRM", icon: UserSquare2 },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 min-h-screen bg-brand-900 flex flex-col fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-brand-800">
        <div className="flex items-center gap-2">
          <Hotel className="text-gold-400" size={24} />
          <span className="text-white font-display text-lg font-semibold">SMIC360 Softwares</span>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              active ? "bg-brand-600 text-white" : "text-brand-200 hover:bg-brand-800 hover:text-white"
            )}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-brand-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.fullname?.[0] ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.fullname}</p>
            <p className="text-brand-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-brand-300 hover:text-white text-xs px-2 py-1.5 w-full rounded-lg hover:bg-brand-800 transition-colors">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
