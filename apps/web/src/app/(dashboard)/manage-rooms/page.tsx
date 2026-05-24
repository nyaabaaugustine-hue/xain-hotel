"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { BedDouble, Plus } from "lucide-react";

export default function RoomsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["rooms"], queryFn: () => api.get("/api/rooms").then(r => r.data.data) });
  const rooms = Array.isArray(data) ? data : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Rooms</h1>
          <p className="text-gray-500 text-sm mt-1">Manage hotel rooms and availability</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Room</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : rooms.length === 0 ? (
        <div className="card text-center py-16">
          <BedDouble className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">No rooms added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rooms.map((room: any) => (
            <div key={room.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Room {room.roomNo}</h3>
                  <p className="text-sm text-gray-500">{room.roomType?.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  room.status === "available" ? "bg-green-100 text-green-800" :
                  room.status === "occupied" ? "bg-red-100 text-red-800" :
                  "bg-amber-100 text-amber-800"
                }`}>{room.status}</span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Capacity: {room.roomType?.capacity} guests</p>
                <p className="font-semibold text-brand-600">${room.roomType?.price}/night</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
