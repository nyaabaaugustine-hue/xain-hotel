"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import {
  CalendarCheck, Plus, X, Search, LogIn, LogOut, XCircle,
  ChevronLeft, ChevronRight,
} from "lucide-react";

interface Customer { id: number; name: string; email?: string; phone?: string; }
interface RoomType { id: number; name: string; price: number; capacity: number; }
interface Room { id: number; roomNo: string; status: string; roomType: RoomType; }
interface Reservation {
  id: number; bookingNo: string; checkIn: string; checkOut: string;
  adults: number; children: number; totalAmount: number;
  status: string; paymentStatus: string; paymentMethod?: string; notes?: string;
  customer: Customer; room: Room & { roomType: RoomType };
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending:     { label: "Pending",     cls: "badge-pending" },
  checked_in:  { label: "Checked In",  cls: "badge-checkedin" },
  checked_out: { label: "Checked Out", cls: "badge-checkout" },
  cancelled:   { label: "Cancelled",   cls: "badge-cancelled" },
};

// ── Contained Modal ────────────────────────────────────────────────────────
function Modal({ title, onClose, wide, children }: {
  title: string; onClose: () => void; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-full border border-gray-100 flex flex-col ${wide ? "max-w-2xl" : "max-w-lg"}`}
        style={{ maxHeight: "min(90vh, 800px)" }}>
        {/* Fixed header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ── Seed data shown when API has no data ───────────────────────────────────
const SEED_RESERVATIONS: Reservation[] = [
  { id: 1,  bookingNo: "XH-240901", checkIn: "2025-05-26", checkOut: "2025-05-29", adults: 2, children: 0, totalAmount: 9600, status: "checked_in",  paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 1,  name: "Amara Osei-Bonsu",    email: "amara@email.com",    phone: "+233 24 111 2233" }, room: { id: 1,  roomNo: "P-12", status: "occupied", roomType: { id: 5, name: "Sky Penthouse Suite",  price: 3200, capacity: 4 } } },
  { id: 2,  bookingNo: "XH-240897", checkIn: "2025-05-26", checkOut: "2025-05-28", adults: 2, children: 1, totalAmount: 3700, status: "pending",     paymentStatus: "unpaid",                           customer: { id: 2,  name: "Dr. Kwame Asante",     email: "kwame@asante.gh",    phone: "+233 20 900 1122" }, room: { id: 2,  roomNo: "D-07", status: "available", roomType: { id: 2, name: "Deluxe Garden Room",   price: 1850, capacity: 3 } } },
  { id: 3,  bookingNo: "XH-240889", checkIn: "2025-05-25", checkOut: "2025-05-27", adults: 1, children: 0, totalAmount: 1920, status: "checked_in",  paymentStatus: "paid",   paymentMethod: "mobile", customer: { id: 3,  name: "Serena Mensah",        email: "serena.m@corp.gh",   phone: "+233 55 223 4455" }, room: { id: 3,  roomNo: "S-21", status: "occupied", roomType: { id: 3, name: "Executive Room",       price: 960,  capacity: 2 } } },
  { id: 4,  bookingNo: "XH-240882", checkIn: "2025-05-24", checkOut: "2025-05-26", adults: 2, children: 0, totalAmount: 4800, status: "checked_out", paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 4,  name: "Nana Acheampong",      email: "nana@business.gh",   phone: "+233 26 334 5566" }, room: { id: 4,  roomNo: "D-03", status: "available", roomType: { id: 2, name: "Deluxe Garden Room",   price: 2400, capacity: 3 } } },
  { id: 5,  bookingNo: "XH-240878", checkIn: "2025-05-24", checkOut: "2025-05-28", adults: 3, children: 1, totalAmount: 16400,status: "checked_in",  paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 5,  name: "Isabella Torres",      email: "i.torres@intl.com",  phone: "+1 646 555 7788" },  room: { id: 5,  roomNo: "P-08", status: "occupied", roomType: { id: 6, name: "Presidential Suite",   price: 4100, capacity: 6 } } },
  { id: 6,  bookingNo: "XH-240871", checkIn: "2025-05-24", checkOut: "2025-05-25", adults: 1, children: 0, totalAmount: 720,  status: "cancelled",  paymentStatus: "refunded",                          customer: { id: 6,  name: "James Ofori",          email: "jofori@mail.com",    phone: "+233 24 445 6677" }, room: { id: 6,  roomNo: "S-15", status: "available", roomType: { id: 3, name: "Executive Room",       price: 720,  capacity: 2 } } },
  { id: 7,  bookingNo: "XH-240865", checkIn: "2025-05-23", checkOut: "2025-05-25", adults: 2, children: 0, totalAmount: 2400, status: "checked_out", paymentStatus: "paid",   paymentMethod: "cash",   customer: { id: 7,  name: "Fatima Al-Rashid",    email: "fatima@dubai.ae",    phone: "+971 50 123 4567" }, room: { id: 7,  roomNo: "K-04", status: "available", roomType: { id: 4, name: "Kente Suite",          price: 1200, capacity: 3 } } },
  { id: 8,  bookingNo: "XH-240860", checkIn: "2025-05-22", checkOut: "2025-05-24", adults: 2, children: 2, totalAmount: 1000, status: "checked_out", paymentStatus: "paid",   paymentMethod: "mobile", customer: { id: 8,  name: "Emmanuel Boateng",    email: "e.boateng@uni.edu",  phone: "+233 27 556 7788" }, room: { id: 8,  roomNo: "C-11", status: "available", roomType: { id: 1, name: "Classic Room",          price: 500,  capacity: 2 } } },
  { id: 9,  bookingNo: "XH-240855", checkIn: "2025-05-27", checkOut: "2025-05-30", adults: 2, children: 0, totalAmount: 5550, status: "pending",     paymentStatus: "unpaid",                           customer: { id: 9,  name: "Sophie Okonkwo",      email: "sokonkwo@lagos.ng",  phone: "+234 80 234 5678" }, room: { id: 9,  roomNo: "D-14", status: "available", roomType: { id: 2, name: "Deluxe Garden Room",   price: 1850, capacity: 3 } } },
  { id: 10, bookingNo: "XH-240849", checkIn: "2025-05-28", checkOut: "2025-06-01", adults: 1, children: 0, totalAmount: 3840, status: "pending",     paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 10, name: "Charles Mensah-Brown", email: "cmb@diplomacy.un",   phone: "+44 207 123 4567" }, room: { id: 10, roomNo: "K-09", status: "available", roomType: { id: 4, name: "Kente Suite",          price: 960,  capacity: 3 } } },
  { id: 11, bookingNo: "XH-240843", checkIn: "2025-05-21", checkOut: "2025-05-23", adults: 2, children: 0, totalAmount: 700,  status: "checked_out", paymentStatus: "paid",   paymentMethod: "cash",   customer: { id: 11, name: "Abena Frimpong",      email: "afrimpong@corp.gh",  phone: "+233 24 667 8899" }, room: { id: 11, roomNo: "C-05", status: "available", roomType: { id: 1, name: "Classic Room",          price: 350,  capacity: 2 } } },
  { id: 12, bookingNo: "XH-240837", checkIn: "2025-05-29", checkOut: "2025-06-02", adults: 4, children: 0, totalAmount: 19200,status: "pending",     paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 12, name: "Ravi Patel",           email: "ravi.p@tata.in",     phone: "+91 98765 43210" },  room: { id: 12, roomNo: "P-01", status: "available", roomType: { id: 6, name: "Presidential Suite",   price: 4800, capacity: 6 } } },
  { id: 13, bookingNo: "XH-240831", checkIn: "2025-05-20", checkOut: "2025-05-22", adults: 2, children: 1, totalAmount: 1920, status: "checked_out", paymentStatus: "paid",   paymentMethod: "mobile", customer: { id: 13, name: "Adwoa Asante",         email: "adwoa@school.gh",    phone: "+233 55 778 9900" }, room: { id: 13, roomNo: "S-08", status: "available", roomType: { id: 3, name: "Executive Room",       price: 960,  capacity: 2 } } },
  { id: 14, bookingNo: "XH-240825", checkIn: "2025-05-30", checkOut: "2025-06-03", adults: 2, children: 0, totalAmount: 7200, status: "pending",     paymentStatus: "unpaid",                           customer: { id: 14, name: "Yaw Darko",            email: "ydarko@finance.gh",  phone: "+233 26 889 0011" }, room: { id: 14, roomNo: "K-06", status: "available", roomType: { id: 4, name: "Kente Suite",          price: 1800, capacity: 3 } } },
  { id: 15, bookingNo: "XH-240819", checkIn: "2025-05-19", checkOut: "2025-05-21", adults: 1, children: 0, totalAmount: 700,  status: "checked_out", paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 15, name: "Ama Owusu",            email: "aowusu@media.gh",    phone: "+233 20 001 2233" }, room: { id: 15, roomNo: "C-18", status: "available", roomType: { id: 1, name: "Classic Room",          price: 350,  capacity: 2 } } },
  { id: 16, bookingNo: "XH-240813", checkIn: "2025-05-18", checkOut: "2025-05-19", adults: 2, children: 0, totalAmount: 2400, status: "cancelled",  paymentStatus: "refunded",                          customer: { id: 16, name: "Omar Hassan",          email: "ohassan@embassy.eg", phone: "+20 100 234 5678" }, room: { id: 16, roomNo: "D-17", status: "available", roomType: { id: 2, name: "Deluxe Garden Room",   price: 2400, capacity: 3 } } },
  { id: 17, bookingNo: "XH-240807", checkIn: "2025-06-01", checkOut: "2025-06-05", adults: 2, children: 2, totalAmount: 5600, status: "pending",     paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 17, name: "Gifty Tetteh",         email: "gifty@ngo.org",      phone: "+233 27 112 3344" }, room: { id: 17, roomNo: "S-22", status: "available", roomType: { id: 3, name: "Executive Room",       price: 1400, capacity: 4 } } },
  { id: 18, bookingNo: "XH-240801", checkIn: "2025-05-16", checkOut: "2025-05-18", adults: 2, children: 0, totalAmount: 6400, status: "checked_out", paymentStatus: "paid",   paymentMethod: "card",   customer: { id: 18, name: "Akwesi Bonsu",         email: "abonsu@law.gh",      phone: "+233 24 223 4455" }, room: { id: 18, roomNo: "P-05", status: "available", roomType: { id: 5, name: "Sky Penthouse Suite",  price: 3200, capacity: 4 } } },
  { id: 19, bookingNo: "XH-240795", checkIn: "2025-06-03", checkOut: "2025-06-07", adults: 3, children: 0, totalAmount: 10800,status: "pending",     paymentStatus: "paid",   paymentMethod: "mobile", customer: { id: 19, name: "Priscilla Agyei",      email: "pagyei@tech.gh",     phone: "+233 55 334 5566" }, room: { id: 19, roomNo: "K-11", status: "available", roomType: { id: 4, name: "Kente Suite",          price: 2700, capacity: 3 } } },
  { id: 20, bookingNo: "XH-240789", checkIn: "2025-05-15", checkOut: "2025-05-16", adults: 1, children: 0, totalAmount: 350,  status: "checked_out", paymentStatus: "paid",   paymentMethod: "cash",   customer: { id: 20, name: "Ben Appiah",           email: "bappiah@import.gh",  phone: "+233 26 445 6677" }, room: { id: 20, roomNo: "C-02", status: "available", roomType: { id: 1, name: "Classic Room",          price: 350,  capacity: 2 } } },
];

const today = () => new Date().toISOString().split("T")[0];
const addDays = (d: string, n: number) => {
  const dt = new Date(d); dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};

function BookingForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
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
    if (!form.checkIn || !form.checkOut) { setErr("Dates are required."); return; }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) { setErr("Check-out must be after check-in."); return; }
    setErr(""); mutation.mutate();
  };

  return (
    <div className="space-y-5">
      {err && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{err}</div>}

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
        {form.customerId && <p className="text-xs text-brand-600 mt-1">✓ Guest selected</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Check In *</label>
          <input type="date" className="input" value={form.checkIn} min={today()}
            onChange={e => { set("checkIn", e.target.value); if (form.checkOut <= e.target.value) set("checkOut", addDays(e.target.value, 1)); }} />
        </div>
        <div>
          <label className="label">Check Out *</label>
          <input type="date" className="input" value={form.checkOut} min={addDays(form.checkIn, 1)}
            onChange={e => set("checkOut", e.target.value)} />
        </div>
      </div>

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

      <div>
        <label className="label">Notes</label>
        <textarea className="input" rows={2} placeholder="Special requests…"
          value={form.notes} onChange={e => set("notes", e.target.value)} />
      </div>

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

  // Use seed data when API has no data
  const rawReservations: Reservation[] = data?.data || [];
  const reservations = rawReservations.length > 0 ? rawReservations : SEED_RESERVATIONS.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.bookingNo.toLowerCase().includes(q) || r.customer.name.toLowerCase().includes(q);
    const matchStatus = status === "all" || r.status === status;
    return matchSearch && matchStatus;
  });
  const total = data?.total || SEED_RESERVATIONS.length;
  const totalPages = data?.totalPages || Math.ceil(SEED_RESERVATIONS.length / 20);

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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total booking{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={16} /> New Booking
        </button>
      </div>

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
                          {paid ? "Paid" : r.paymentStatus === "refunded" ? "Refunded" : "Unpaid"}
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

      {showForm && (
        <Modal title="New Booking" onClose={() => setShowForm(false)} wide>
          <BookingForm
            onClose={() => setShowForm(false)}
            onSuccess={() => { qc.invalidateQueries({ queryKey: ["reservations"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); }}
          />
        </Modal>
      )}

      {actionId !== null && actionType && (
        <Modal
          title={actionType === "checkin" ? "Confirm Check In" : actionType === "checkout" ? "Confirm Check Out" : "Cancel Reservation"}
          onClose={() => { setActionId(null); setActionType(null); }}>
          <p className="text-gray-600 mb-6">
            {actionType === "checkin"  ? "Mark this reservation as checked in?" :
             actionType === "checkout" ? "Mark this reservation as checked out and release the room?" :
             "Are you sure you want to cancel this reservation? This cannot be undone."}
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setActionId(null); setActionType(null); }} className="btn-secondary px-4 py-2 text-sm">Go Back</button>
            <button
              onClick={() => actionMutation.mutate({ id: actionId, type: actionType })}
              disabled={actionMutation.isPending}
              className={actionType === "cancel" ? "btn-danger px-4 py-2 text-sm" : "btn-primary px-4 py-2 text-sm"}>
              {actionMutation.isPending ? "Processing…" :
               actionType === "checkin" ? "Confirm Check In" :
               actionType === "checkout" ? "Confirm Check Out" : "Yes, Cancel Reservation"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
