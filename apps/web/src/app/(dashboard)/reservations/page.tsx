"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import {
  CalendarCheck, Plus, X, Search, LogIn, LogOut, XCircle,
  ChevronLeft, ChevronRight, Filter,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Customer { id: number; name: string; email?: string; phone?: string; }
interface RoomType { id: number; name: string; price: number; capacity: number; }
interface Room { id: number; roomNo: string; status: string; roomType: RoomType; }
interface Reservation {
  id: number; bookingNo: string; checkIn: string; checkOut: string;
  adults: number; children: number; totalAmount: number;
  status: string; paymentStatus: string; paymentMethod?: string; notes?: string;
  customer: Customer; room: Room & { roomType: RoomType };
}

// ── Status Config ──────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; cls: string }> = {
  pending:     { label: "Pending",     cls: "badge-pending" },
  checked_in:  { label: "Checked In",  cls: "badge-checkedin" },
  checked_out: { label: "Checked Out", cls: "badge-checkout" },
  cancelled:   { label: "Cancelled",   cls: "badge-cancelled" },
};

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, wide, children }: { title: string; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className={`bg-white rounded-2xl shadow-2xl w-full border border-gray-100 my-4 ${wide ? "max-w-2xl" : "max-w-lg"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── New Booking Form ───────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const addDays = (d: string, n: number) => {
  const dt = new Date(d); dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};

function BookingForm({
  onClose, onSuccess,
}: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    customerId: "", roomId: "", checkIn: today(), checkOut: addDays(today(), 1),
    adults: "1", children: "0", paymentMethod: "cash", notes: "",
  });
  const [custSearch, setCustSearch] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers-all"],
    queryFn: () => api.get("/api/customers?limit=200").then(r => r.data.data?.data || []),
  });
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["rooms-available", form.checkIn, form.checkOut],
    queryFn: () => api.get(`/api/rooms/available?checkIn=${form.checkIn}&checkOut=${form.checkOut}`).then(r => r.data.data),
    enabled: !!form.checkIn && !!form.checkOut,
  });

  const filteredCustomers = customers.filter(c =>
    !custSearch || c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.email?.includes(custSearch)
  );
  const filteredRooms = rooms.filter(r =>
    !roomSearch || r.roomNo.includes(roomSearch) || r.roomType?.name.toLowerCase().includes(roomSearch.toLowerCase())
  );

  const selectedRoom = rooms.find(r => String(r.id) === form.roomId);
  const nights = form.checkIn && form.checkOut
    ? Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 1;
  const totalAmount = selectedRoom ? Number(selectedRoom.roomType?.price) * nights : 0;

  const mutation = useMutation({
    mutationFn: () => api.post("/api/reservations", {
      customerId: +form.customerId, roomId: +form.roomId,
      checkIn: form.checkIn, checkOut: form.checkOut,
      adults: +form.adults, children: +form.children,
      totalAmount, paymentMethod: form.paymentMethod,
      notes: form.notes || undefined,
    }),
    onSuccess: () => { onSuccess(); onClose(); },
    onError: (e: any) => setErr(e?.response?.data?.message || "Failed to create reservation"),
  });

  const handle = () => {
    if (!form.customerId) { setErr("Please select a guest."); return; }
    if (!form.roomId)     { setErr("Please select a room."); return; }
    if (!form.checkIn || !form.checkOut) { setErr("Check-in and check-out dates are required."); return; }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) { setErr("Check-out must be after check-in."); return; }
    setErr(""); mutation.mutate();
  };

  return (
    <div className="space-y-5">
      {err && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{err}</div>}

      {/* Guest */}
      <div>
        <label className="label">Guest *</label>
        <input className="input mb-2" placeholder="Search guest…" value={custSearch}
          onChange={e => { setCustSearch(e.target.value); set("customerId", ""); }} />
        {custSearch && !form.customerId && (
          <div className="border border-gray-200 rounded-xl max-h-40 overflow-y-auto shadow-sm">
            {filteredCustomers.slice(0, 8).map(c => (
              <button key={c.id} onClick={() => { set("customerId", String(c.id)); setCustSearch(c.name); }}
                className="w-full text-left px-3 py-2 hover:bg-brand-50 text-sm transition-colors">
                <p className="font-medium text-gray-800">{c.name}</p>
                <p className="text-gray-400 text-xs">{c.email || c.phone || "—"}</p>
              </button>
            ))}
            {filteredCustomers.length === 0 && <p className="px-3 py-3 text-gray-400 text-sm">No guests found.</p>}
          </div>
        )}
        {form.customerId && (
          <p className="text-xs text-brand-600 mt-1">✓ Guest selected</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Check In *</label>
          <input type="date" className="input" value={form.checkIn}
            min={today()} onChange={e => { set("checkIn", e.target.value); if (form.checkOut <= e.target.value) set("checkOut", addDays(e.target.value, 1)); }} />
        </div>
        <div>
          <label className="label">Check Out *</label>
          <input type="date" className="input" value={form.checkOut}
            min={addDays(form.checkIn, 1)} onChange={e => set("checkOut", e.target.value)} />
        </div>
      </div>

      {/* Room */}
      <div>
        <label className="label">Room * {nights > 0 && <span className="text-gray-400 normal-case font-normal">({nights} night{nights !== 1 ? "s" : ""})</span>}</label>
        <input className="input mb-2" placeholder="Search available rooms…" value={roomSearch}
          onChange={e => { setRoomSearch(e.target.value); set("roomId", ""); }} />
        {(roomSearch || !form.roomId) && (
          <div className="border border-gray-200 rounded-xl max-h-44 overflow-y-auto shadow-sm">
            {filteredRooms.slice(0, 10).map(r => (
              <button key={r.id} onClick={() => { set("roomId", String(r.id)); setRoomSearch(`Room ${r.roomNo} — ${r.roomType?.name}`); }}
                className="w-full text-left px-3 py-2 hover:bg-brand-50 text-sm border-b border-gray-50 last:border-0 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">Room {r.roomNo} — {r.roomType?.name}</p>
                    <p className="text-gray-400 text-xs">{r.roomType?.capacity} guests</p>
                  </div>
                  <p className="font-semibold text-brand-600 text-sm">GH₵{Number(r.roomType?.price).toFixed(0)}/night</p>
                </div>
              </button>
            ))}
            {filteredRooms.length === 0 && <p className="px-3 py-3 text-gray-400 text-sm">No rooms available for these dates.</p>}
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Adults</label>
          <input type="number" min="1" max="10" className="input" value={form.adults} onChange={e => set("adults", e.target.value)} />
        </div>
        <div>
          <label className="label">Children</label>
          <input type="number" min="0" max="10" className="input" value={form.children} onChange={e => set("children", e.target.value)} />
        </div>
      </div>

      {/* Payment */}
      <div>
        <label className="label">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {["cash","card","mobile"].map(pm => (
            <button key={pm} onClick={() => set("paymentMethod", pm)}
              className={`payment-btn capitalize ${form.paymentMethod === pm ? "selected" : ""}`}>
              {pm === "mobile" ? "Mobile Money" : pm.charAt(0).toUpperCase() + pm.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea className="input" rows={2} placeholder="Special requests…"
          value={form.notes} onChange={e => set("notes", e.target.value)} />
      </div>

      {/* Summary */}
      {selectedRoom && (
        <div className="booking-confirm-box">
          <div className="booking-confirm-row"><span className="booking-confirm-label">Room</span><span className="booking-confirm-value">Room {selectedRoom.roomNo}</span></div>
          <div className="booking-confirm-row"><span className="booking-confirm-label">Nights</span><span className="booking-confirm-value">{nights}</span></div>
          <div className="booking-confirm-row"><span className="booking-confirm-label">Rate</span><span className="booking-confirm-value">GH₵{Number(selectedRoom.roomType?.price).toFixed(0)}/night</span></div>
          <div className="border-t border-amber-200 my-2" />
          <div className="booking-confirm-row font-bold"><span className="booking-confirm-label text-gray-900 font-bold">Total</span><span className="booking-confirm-value text-brand-700 text-lg">GH₵{totalAmount.toFixed(2)}</span></div>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-1">
        <button onClick={onClose} className="btn-secondary px-5 py-2 text-sm">Cancel</button>
        <button onClick={handle} disabled={mutation.isPending} className="btn-primary px-6 py-2 text-sm">
          {mutation.isPending ? "Creating…" : "Create Reservation"}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ReservationsPage() {
  const qc = useQueryClient();
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"checkin"|"checkout"|"cancel"|null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["reservations", page, search, status],
    queryFn: () => {
      const p = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) p.set("search", search);
      if (status !== "all") p.set("status", status);
      return api.get(`/api/reservations?${p}`).then(r => r.data.data);
    },
  });

  const reservations: Reservation[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const actionMutation = useMutation({
    mutationFn: ({ id, type }: { id: number; type: string }) => {
      if (type === "checkin")  return api.put(`/api/reservations/${id}/checkin`);
      if (type === "checkout") return api.put(`/api/reservations/${id}/checkout`);
      return api.put(`/api/reservations/${id}/cancel`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reservations"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["rooms"] });
      setActionId(null); setActionType(null);
    },
  });

  const STATUSES = ["all","pending","checked_in","checked_out","cancelled"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {total} total booking{total !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-3 items-center mb-5">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search booking # or guest…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap text-xs font-semibold">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${status === s ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20">
            <CalendarCheck className="mx-auto text-gray-200 mb-3" size={40} />
            <p className="text-gray-400 text-sm">No reservations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-gray-100 bg-gray-50/70">
                  {["Booking #","Guest","Room","Check In","Check Out","Status","Payment","Amount","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map(r => {
                  const st = STATUS[r.status] || { label: r.status, cls: "badge-pending" };
                  const paid = r.paymentStatus === "paid";
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-brand-600 font-semibold whitespace-nowrap">{r.bookingNo}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{r.customer?.name}</p>
                        <p className="text-gray-400 text-xs">{r.customer?.phone || r.customer?.email || ""}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-gray-700">Room {r.room?.roomNo}</p>
                        <p className="text-gray-400 text-xs">{r.room?.roomType?.name}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt.date(r.checkIn)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt.date(r.checkOut)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`${st.cls} text-xs font-semibold`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${paid ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                        GH₵{Number(r.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 whitespace-nowrap">
                          {r.status === "pending" && (
                            <button onClick={() => { setActionId(r.id); setActionType("checkin"); }}
                              className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors">
                              <LogIn size={11} /> Check In
                            </button>
                          )}
                          {r.status === "checked_in" && (
                            <button onClick={() => { setActionId(r.id); setActionType("checkout"); }}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors">
                              <LogOut size={11} /> Check Out
                            </button>
                          )}
                          {(r.status === "pending" || r.status === "checked_in") && (
                            <button onClick={() => { setActionId(r.id); setActionType("cancel"); }}
                              className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors">
                              <XCircle size={11} /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-gray-400">Showing {reservations.length} of {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-2 text-gray-600 font-medium">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showForm && (
        <Modal title="New Booking" onClose={() => setShowForm(false)} wide>
          <BookingForm
            onClose={() => setShowForm(false)}
            onSuccess={() => { qc.invalidateQueries({ queryKey: ["reservations"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); }}
          />
        </Modal>
      )}

      {/* Action Confirm */}
      {actionId !== null && actionType && (
        <Modal title={
          actionType === "checkin" ? "Confirm Check In" :
          actionType === "checkout" ? "Confirm Check Out" : "Cancel Reservation"
        } onClose={() => { setActionId(null); setActionType(null); }}>
          <p className="text-gray-600 mb-6">
            {actionType === "checkin"  ? "Mark this reservation as checked in?" :
             actionType === "checkout" ? "Mark this reservation as checked out and release the room?" :
             "Are you sure you want to cancel this reservation?"}
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setActionId(null); setActionType(null); }} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
            <button
              onClick={() => actionMutation.mutate({ id: actionId, type: actionType })}
              disabled={actionMutation.isPending}
              className={actionType === "cancel" ? "btn-danger px-4 py-2 text-sm" : "btn-primary px-4 py-2 text-sm"}>
              {actionMutation.isPending ? "Processing…" :
               actionType === "checkin" ? "Check In" :
               actionType === "checkout" ? "Check Out" : "Cancel Reservation"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
