"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import { CalendarCheck, Plus } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function ReservationsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["reservations"], queryFn: () => api.get("/api/reservations").then(r => r.data.data) });
  const reservations = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Reservations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage bookings and check-ins</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={16} /> New Booking</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16 relative overflow-hidden">
            <Image src={IMAGES.resort} alt="" fill className="object-cover object-center opacity-5 pointer-events-none" sizes="400px" />
            <div className="relative">
              <CalendarCheck className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500">No reservations yet.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Booking #</th>
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Check In</th>
                  <th className="pb-3 font-medium">Check Out</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs text-brand-600">{r.bookingNo}</td>
                    <td className="py-3">{r.customer?.name}</td>
                    <td className="py-3">{r.room?.roomNo}</td>
                    <td className="py-3 text-gray-500">{fmt.date(r.checkIn)}</td>
                    <td className="py-3 text-gray-500">{fmt.date(r.checkOut)}</td>
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
