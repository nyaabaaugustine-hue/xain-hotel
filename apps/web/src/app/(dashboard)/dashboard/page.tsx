"use client";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import { BedDouble, CalendarCheck, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => api.get("/api/dashboard").then(r => r.data.data) });

  const stats = data?.stats || {};
  const recent = data?.recentReservations || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome back, {user?.fullname?.split(" ")[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening at your hotel today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Rooms" value={stats.totalRooms ?? "—"} icon={BedDouble} color="bg-brand-600" />
        <StatCard label="Occupied" value={stats.occupiedRooms ?? "—"} icon={CheckCircle} color="bg-green-500" />
        <StatCard label="Reservations" value={stats.totalReservations ?? "—"} icon={CalendarCheck} color="bg-purple-500" />
        <StatCard label="Customers" value={stats.totalCustomers ?? "—"} icon={Users} color="bg-gold-500" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Recent Reservations</h2>
          <a href="/reservations" className="text-brand-600 text-sm hover:underline">View all</a>
        </div>
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No reservations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Booking #</th>
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Check In</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs text-brand-600">{r.bookingNo}</td>
                    <td className="py-3">{r.customer?.name}</td>
                    <td className="py-3">{r.room?.roomNo}</td>
                    <td className="py-3 text-gray-500">{fmt.date(r.checkIn)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === "checked_in" ? "bg-green-100 text-green-800" :
                        r.status === "checked_out" ? "bg-blue-100 text-blue-800" :
                        r.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>{r.status.replace(/_/g, " ")}</span>
                    </td>
                    <td className="py-3 font-medium">{fmt.currency(r.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
