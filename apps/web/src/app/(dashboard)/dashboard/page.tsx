"use client";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import {
  BedDouble, CalendarCheck, Users, TrendingUp,
  CheckCircle, Clock, AlertCircle, DollarSign,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";

function StatCard({
  label, value, sub, icon: Icon, color, trend, trendDir,
}: {
  label: string; value: string | number; sub?: string; icon: any;
  color: string; trend?: string; trendDir?: "up" | "down";
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trendDir === "up" ? "text-emerald-500" : "text-red-400"}`}>
            {trendDir === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800 leading-none mb-1">{value}</p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function OccupancyBar({ occupied, total }: { occupied: number; total: number }) {
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Occupancy Rate</span>
        <span className="text-sm font-bold text-gray-800">{pct}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#0F7048",
          }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-gray-400 mt-1">
        <span>{occupied} occupied</span>
        <span>{total - occupied} available</span>
      </div>
    </div>
  );
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:     { label: "Pending",     cls: "bg-amber-100 text-amber-800" },
  checked_in:  { label: "Checked In",  cls: "bg-emerald-100 text-emerald-800" },
  checked_out: { label: "Checked Out", cls: "bg-blue-100 text-blue-800" },
  cancelled:   { label: "Cancelled",   cls: "bg-red-100 text-red-800" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/api/dashboard").then(r => r.data.data),
    refetchInterval: 60_000,
  });

  const s = data?.stats || {};
  const recent = data?.recentReservations || [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {user?.fullname?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString("en-GH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          All systems live
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Rooms"        value={s.totalRooms ?? 0}          icon={BedDouble}    color="bg-brand-600"   trend="+6" trendDir="up" />
          <StatCard label="Occupied"           value={s.occupiedRooms ?? 0}       icon={CheckCircle}  color="bg-emerald-500" sub={`${s.availableRooms ?? 0} available`} />
          <StatCard label="Reservations"       value={s.totalReservations ?? 0}   icon={CalendarCheck} color="bg-violet-500" />
          <StatCard label="Guests Today"       value={s.checkedIn ?? 0}           icon={Users}        color="bg-sky-500"     sub="checked in" />
          <StatCard label="Arrivals Today"     value={s.todayArrivals ?? 0}       icon={ArrowUpRight} color="bg-amber-500"  />
          <StatCard label="Departures Today"   value={s.todayDepartures ?? 0}     icon={ArrowDownRight} color="bg-rose-500" />
          <StatCard label="Pending Bookings"   value={s.pendingReservations ?? 0} icon={Clock}        color="bg-orange-500" />
          <StatCard
            label="Monthly Revenue"
            value={fmt.currency(s.monthlyRevenue ?? 0, "GH₵")}
            icon={DollarSign}
            color="bg-gold-500"
            trend="This month"
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Occupancy card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-6 text-sm">Room Occupancy</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ) : (
            <OccupancyBar occupied={s.occupiedRooms ?? 0} total={s.totalRooms ?? 6} />
          )}
          <div className="mt-6 space-y-3">
            {[
              { label: "Available", value: s.availableRooms ?? 0, dot: "bg-brand-500" },
              { label: "Occupied",  value: s.occupiedRooms ?? 0,  dot: "bg-amber-400" },
              { label: "Pending",   value: s.pendingReservations ?? 0, dot: "bg-violet-400" },
            ].map(({ label, value, dot }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                  <span className="text-gray-500">{label}</span>
                </div>
                <span className="font-semibold text-gray-800">{isLoading ? "—" : value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm xl:col-span-2">
          <h2 className="font-semibold text-gray-800 mb-5 text-sm">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: "/reservations", label: "New Booking",    icon: CalendarCheck, color: "bg-violet-50 text-violet-600 border-violet-100" },
              { href: "/customers",    label: "Add Customer",   icon: Users,         color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
              { href: "/manage-rooms", label: "Manage Rooms",   icon: BedDouble,     color: "bg-sky-50 text-sky-600 border-sky-100" },
              { href: "/orders",       label: "New Order",      icon: TrendingUp,    color: "bg-amber-50 text-amber-600 border-amber-100" },
              { href: "/reports",      label: "View Reports",   icon: AlertCircle,   color: "bg-rose-50 text-rose-600 border-rose-100" },
              { href: "/settings",     label: "Settings",       icon: TrendingUp,    color: "bg-gray-50 text-gray-600 border-gray-100" },
            ].map(({ href, label, icon: Icon, color }) => (
              <a key={href} href={href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center hover:scale-[1.03] transition-transform cursor-pointer ${color}`}>
                <Icon size={20} />
                <span className="text-xs font-semibold">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Recent Reservations</h2>
          <a href="/reservations" className="text-brand-600 text-xs font-semibold hover:underline">View all →</a>
        </div>
        {isLoading ? (
          <div className="p-6 animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-50 rounded-lg" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-16">
            <CalendarCheck className="mx-auto text-gray-200 mb-3" size={36} />
            <p className="text-gray-400 text-sm">No reservations yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider">Booking #</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Guest</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Room</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Check In</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((r: any) => {
                  const st = STATUS_MAP[r.status] || { label: r.status, cls: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-brand-600 font-semibold">{r.bookingNo}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-800">{r.customer?.name}</td>
                      <td className="px-4 py-3.5 text-gray-500">{r.room?.roomNo}</td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs">{fmt.date(r.checkIn)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-gray-800 text-right">{fmt.currency(r.totalAmount, "GH₵")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
