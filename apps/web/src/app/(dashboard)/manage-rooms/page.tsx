"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  BedDouble, Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, Clock,
  Search, ChevronDown,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface RoomType { id: number; name: string; price: number; capacity: number; description?: string; }
interface Room {
  id: number; roomNo: string; floorId?: number; status: string; description?: string;
  roomType: RoomType;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS: Record<string, { label: string; icon: any; cls: string; dot: string }> = {
  available:   { label: "Available",   icon: CheckCircle,  cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" },
  occupied:    { label: "Occupied",    icon: AlertCircle,  cls: "bg-red-100 text-red-700",         dot: "bg-red-400" },
  maintenance: { label: "Maintenance", icon: Clock,        cls: "bg-amber-100 text-amber-700",     dot: "bg-amber-400" },
};

const ROOM_IMAGES: Record<string, string> = {
  "Classic Room":        "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/one-king-size-bed-hotel-room_114579-12159_aadqgg.avif",
  "Deluxe Garden Room":  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/sunset-pool_1203-3191_wg2dwy.jpg",
  "Executive Room":      "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/tropical-hotel-holiday-background-resort_1203-4943_raibay.avif",
  "Kente Suite":         "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/modern-studio-apartment-design-with-bedroom-living-space_1262-12375_faldtb.avif",
  "Sky Penthouse Suite": "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/beautiful-aerial-shot-coastal-city-sea_181624-599_fjrnqi.avif",
  "Presidential Suite":  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/pillow-bed_74190-6244_sueu3d.avif",
};
const DEFAULT_IMG = "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588186/e_rc4ztd.avif";

const EMPTY_FORM = { roomNo: "", roomTypeId: "", floorId: "", status: "available", description: "" };

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 flex flex-col my-4" style={{ maxHeight: "calc(100dvh - 2rem)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({ room, onConfirm, onClose, loading }: {
  room: Room; onConfirm: () => void; onClose: () => void; loading: boolean;
}) {
  return (
    <Modal title="Delete Room" onClose={onClose}>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete <strong>Room {room.roomNo}</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger px-4 py-2 text-sm">
          {loading ? "Deleting…" : "Delete Room"}
        </button>
      </div>
    </Modal>
  );
}

// ── Room Form ──────────────────────────────────────────────────────────────
function RoomForm({
  initial, roomTypes, onSubmit, onClose, isEdit, loading,
}: {
  initial: typeof EMPTY_FORM; roomTypes: RoomType[]; onSubmit: (d: typeof EMPTY_FORM) => void;
  onClose: () => void; isEdit: boolean; loading: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handle = () => {
    if (!form.roomNo.trim()) { setErr("Room number is required."); return; }
    if (!form.roomTypeId)    { setErr("Please select a room type."); return; }
    setErr("");
    onSubmit(form);
  };

  return (
    <>
      {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{err}</div>}
      <div className="space-y-4">
        <div>
          <label className="label">Room Number *</label>
          <input className="input" placeholder="e.g. 101" value={form.roomNo}
            onChange={e => set("roomNo", e.target.value)} />
        </div>
        <div>
          <label className="label">Room Type *</label>
          <select className="input" value={form.roomTypeId} onChange={e => set("roomTypeId", e.target.value)}>
            <option value="">— Select type —</option>
            {roomTypes.map(rt => (
              <option key={rt.id} value={rt.id}>
                {rt.name} — GH₵{Number(rt.price).toFixed(0)}/night · {rt.capacity} guests
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Floor</label>
            <input className="input" type="number" min="1" placeholder="e.g. 2"
              value={form.floorId} onChange={e => set("floorId", e.target.value)} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={2} placeholder="Optional room notes…"
            value={form.description} onChange={e => set("description", e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="btn-secondary px-5 py-2 text-sm">Cancel</button>
          <button onClick={handle} disabled={loading} className="btn-primary px-5 py-2 text-sm">
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Room"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function RoomsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm]       = useState(false);
  const [editRoom, setEditRoom]       = useState<Room | null>(null);
  const [deleteRoom, setDeleteRoom]   = useState<Room | null>(null);
  const [formError, setFormError]     = useState("");

  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => api.get("/api/rooms").then(r => r.data.data),
  });

  const { data: roomTypes = [] } = useQuery<RoomType[]>({
    queryKey: ["room-types"],
    queryFn: () => api.get("/api/rooms/types/all").then(r => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (d: typeof EMPTY_FORM) => api.post("/api/rooms", {
      roomNo: d.roomNo, roomTypeId: +d.roomTypeId,
      floorId: d.floorId ? +d.floorId : undefined,
      status: d.status, description: d.description || undefined,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["rooms"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); setShowForm(false); },
    onError: (e: any) => setFormError(e?.response?.data?.message || "Failed to create room"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: number; d: typeof EMPTY_FORM }) => api.put(`/api/rooms/${id}`, {
      roomNo: d.roomNo, roomTypeId: +d.roomTypeId,
      floorId: d.floorId ? +d.floorId : undefined,
      status: d.status, description: d.description || undefined,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["rooms"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); setEditRoom(null); },
    onError: (e: any) => setFormError(e?.response?.data?.message || "Failed to update room"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/rooms/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["rooms"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); setDeleteRoom(null); },
  });

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.roomNo.toLowerCase().includes(q) || r.roomType?.name.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const total     = rooms.length;
  const available = rooms.filter(r => r.status === "available").length;
  const occupied  = rooms.filter(r => r.status === "occupied").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage hotel rooms and availability</p>
        </div>
        <button onClick={() => { setFormError(""); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Rooms", value: total,     color: "text-gray-800",    bg: "bg-gray-50" },
          { label: "Available",   value: available, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Occupied",    value: occupied,  color: "text-red-600",     bg: "bg-red-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 text-center border border-gray-100`}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-3 items-center mb-5">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search room or type…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all" />
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          {["all", "available", "occupied", "maintenance"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${filterStatus === s ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-52 animate-pulse border border-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-20">
          <BedDouble className="mx-auto text-gray-200 mb-3" size={40} />
          <p className="text-gray-400 text-sm">No rooms found.</p>
          {rooms.length === 0 && (
            <p className="text-gray-300 text-xs mt-1">Click "Add Room" to get started.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(room => {
            const st = STATUS[room.status] || STATUS.available;
            const img = ROOM_IMAGES[room.roomType?.name] || DEFAULT_IMG;
            return (
              <div key={room.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img src={img} alt={room.roomType?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${st.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <button onClick={() => { setFormError(""); setEditRoom(room); }}
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-600 shadow transition-all hover:scale-110">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => setDeleteRoom(room)}
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-red-50 flex items-center justify-center text-red-500 shadow transition-all hover:scale-110">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold text-lg drop-shadow">Room {room.roomNo}</p>
                    <p className="text-white/80 text-xs">Floor {room.floorId || 1}</p>
                  </div>
                </div>
                {/* Info */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{room.roomType?.name}</p>
                      <p className="text-gray-400 text-xs">{room.roomType?.capacity} guests max</p>
                    </div>
                    <p className="font-bold text-brand-700 text-sm">GH₵{Number(room.roomType?.price).toFixed(0)}<span className="text-gray-400 font-normal">/night</span></p>
                  </div>
                  {room.description && (
                    <p className="text-gray-400 text-xs mt-2 line-clamp-1">{room.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      {showForm && (
        <Modal title="Add New Room" onClose={() => setShowForm(false)}>
          {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{formError}</div>}
          <RoomForm
            initial={EMPTY_FORM}
            roomTypes={roomTypes}
            isEdit={false}
            loading={createMutation.isPending}
            onClose={() => setShowForm(false)}
            onSubmit={d => createMutation.mutate(d)}
          />
        </Modal>
      )}

      {/* Edit Room Modal */}
      {editRoom && (
        <Modal title={`Edit Room ${editRoom.roomNo}`} onClose={() => setEditRoom(null)}>
          {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{formError}</div>}
          <RoomForm
            initial={{
              roomNo: editRoom.roomNo,
              roomTypeId: String(editRoom.roomType?.id || ""),
              floorId: String(editRoom.floorId || ""),
              status: editRoom.status,
              description: editRoom.description || "",
            }}
            roomTypes={roomTypes}
            isEdit={true}
            loading={updateMutation.isPending}
            onClose={() => setEditRoom(null)}
            onSubmit={d => updateMutation.mutate({ id: editRoom.id, d })}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteRoom && (
        <DeleteConfirm
          room={deleteRoom}
          loading={deleteMutation.isPending}
          onClose={() => setDeleteRoom(null)}
          onConfirm={() => deleteMutation.mutate(deleteRoom.id)}
        />
      )}
    </div>
  );
}
