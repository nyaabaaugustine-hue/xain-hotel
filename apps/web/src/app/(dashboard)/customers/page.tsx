"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import {
  Users, Plus, X, Search, Pencil, Trash2,
  ChevronLeft, ChevronRight, Phone, Mail, Globe,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Customer {
  id: number; name: string; email?: string; phone?: string;
  address?: string; idType?: string; idNumber?: string; nationality?: string;
  status: number; createdAt: string;
}

const EMPTY_FORM = {
  name: "", email: "", phone: "", address: "",
  idType: "", idNumber: "", nationality: "",
};

const SEED_CUSTOMERS: Customer[] = [
  { id: 1,  name: "Amara Osei-Bonsu",     email: "amara@osei.gh",      phone: "+233 24 111 2233", nationality: "Ghanaian",  idType: "National ID",      idNumber: "GHA-1122334", address: "Cantonments, Accra",      status: 1, createdAt: "2025-01-15T10:00:00Z" },
  { id: 2,  name: "Dr. Kwame Asante",     email: "kwame@asante.gh",    phone: "+233 20 900 1122", nationality: "Ghanaian",  idType: "Passport",         idNumber: "G12345678",   address: "Airport Res., Accra",     status: 1, createdAt: "2025-01-20T09:00:00Z" },
  { id: 3,  name: "Serena Mensah",        email: "serena.m@corp.gh",   phone: "+233 55 223 4455", nationality: "Ghanaian",  idType: "Voter ID",         idNumber: "VID-8876654", address: "East Legon, Accra",       status: 1, createdAt: "2025-02-01T12:00:00Z" },
  { id: 4,  name: "Nana Acheampong",      email: "nana@business.gh",   phone: "+233 26 334 5566", nationality: "Ghanaian",  idType: "National ID",      idNumber: "GHA-5544332", address: "Labone, Accra",           status: 1, createdAt: "2025-02-08T14:30:00Z" },
  { id: 5,  name: "Isabella Torres",      email: "i.torres@intl.com",  phone: "+1 646 555 7788",  nationality: "American",  idType: "Passport",         idNumber: "US9876543",   address: "New York, USA",           status: 1, createdAt: "2025-02-14T08:00:00Z" },
  { id: 6,  name: "James Ofori",          email: "jofori@mail.com",    phone: "+233 24 445 6677", nationality: "Ghanaian",  idType: "Driver's Licence", idNumber: "DL-2233441",  address: "Madina, Accra",           status: 1, createdAt: "2025-02-20T10:00:00Z" },
  { id: 7,  name: "Fatima Al-Rashid",     email: "fatima@dubai.ae",    phone: "+971 50 123 4567", nationality: "Emirati",   idType: "Passport",         idNumber: "AE1234567",   address: "Dubai, UAE",              status: 1, createdAt: "2025-03-01T15:00:00Z" },
  { id: 8,  name: "Emmanuel Boateng",     email: "e.boateng@uni.edu",  phone: "+233 27 556 7788", nationality: "Ghanaian",  idType: "National ID",      idNumber: "GHA-7766554", address: "Legon, Accra",            status: 1, createdAt: "2025-03-10T09:00:00Z" },
  { id: 9,  name: "Sophie Okonkwo",       email: "sokonkwo@lagos.ng",  phone: "+234 80 234 5678", nationality: "Nigerian",  idType: "Passport",         idNumber: "NG8765432",   address: "Lagos, Nigeria",          status: 1, createdAt: "2025-03-18T11:00:00Z" },
  { id: 10, name: "Charles Mensah-Brown", email: "cmb@diplomacy.un",   phone: "+44 207 123 4567", nationality: "British",   idType: "Passport",         idNumber: "GB7654321",   address: "London, UK",              status: 1, createdAt: "2025-03-25T08:30:00Z" },
  { id: 11, name: "Abena Frimpong",       email: "afrimpong@corp.gh",  phone: "+233 24 667 8899", nationality: "Ghanaian",  idType: "Voter ID",         idNumber: "VID-6655443", address: "Tema, Ghana",             status: 1, createdAt: "2025-04-02T14:00:00Z" },
  { id: 12, name: "Ravi Patel",           email: "ravi.p@tata.in",     phone: "+91 98765 43210",  nationality: "Indian",    idType: "Passport",         idNumber: "IN6543210",   address: "Mumbai, India",           status: 1, createdAt: "2025-04-08T10:00:00Z" },
  { id: 13, name: "Adwoa Asante",         email: "adwoa@school.gh",    phone: "+233 55 778 9900", nationality: "Ghanaian",  idType: "National ID",      idNumber: "GHA-3322110", address: "Kumasi, Ghana",           status: 1, createdAt: "2025-04-15T09:00:00Z" },
  { id: 14, name: "Yaw Darko",            email: "ydarko@finance.gh",  phone: "+233 26 889 0011", nationality: "Ghanaian",  idType: "Passport",         idNumber: "G87654321",   address: "Ridge, Accra",            status: 1, createdAt: "2025-04-22T13:00:00Z" },
  { id: 15, name: "Ama Owusu",            email: "aowusu@media.gh",    phone: "+233 20 001 2233", nationality: "Ghanaian",  idType: "Voter ID",         idNumber: "VID-9988776", address: "Dansoman, Accra",         status: 1, createdAt: "2025-05-01T10:00:00Z" },
  { id: 16, name: "Omar Hassan",          email: "ohassan@embassy.eg", phone: "+20 100 234 5678", nationality: "Egyptian",  idType: "Passport",         idNumber: "EG5432109",   address: "Cairo, Egypt",            status: 0, createdAt: "2025-05-05T11:00:00Z" },
  { id: 17, name: "Gifty Tetteh",         email: "gifty@ngo.org",      phone: "+233 27 112 3344", nationality: "Ghanaian",  idType: "National ID",      idNumber: "GHA-1100998", address: "Adenta, Accra",           status: 1, createdAt: "2025-05-10T09:30:00Z" },
  { id: 18, name: "Akwesi Bonsu",         email: "abonsu@law.gh",      phone: "+233 24 223 4455", nationality: "Ghanaian",  idType: "Passport",         idNumber: "G54321098",   address: "Osu, Accra",              status: 1, createdAt: "2025-05-13T14:00:00Z" },
  { id: 19, name: "Priscilla Agyei",      email: "pagyei@tech.gh",     phone: "+233 55 334 5566", nationality: "Ghanaian",  idType: "National ID",      idNumber: "GHA-4433221", address: "Spintex, Accra",          status: 1, createdAt: "2025-05-18T10:00:00Z" },
  { id: 20, name: "Ben Appiah",           email: "bappiah@import.gh",  phone: "+233 26 445 6677", nationality: "Ghanaian",  idType: "Driver's Licence", idNumber: "DL-5544332",  address: "Darkuman, Accra",         status: 1, createdAt: "2025-05-22T09:00:00Z" },
];

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 flex flex-col my-4" style={{ maxHeight: "calc(100dvh - 2rem)" }}>
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

// ── Customer Form ──────────────────────────────────────────────────────────
function CustomerForm({
  initial, onSubmit, onClose, isEdit, loading,
}: {
  initial: typeof EMPTY_FORM; onSubmit: (d: typeof EMPTY_FORM) => void;
  onClose: () => void; isEdit: boolean; loading: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handle = () => {
    if (!form.name.trim()) { setErr("Full name is required."); return; }
    setErr(""); onSubmit(form);
  };

  return (
    <div className="space-y-5">
      {err && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          {err}
        </div>
      )}

      {/* Section: Personal */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Personal Details</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
              placeholder="e.g. Kofi Asante Mensah"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                placeholder="guest@email.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                placeholder="+233 20 000 0000"
                value={form.phone}
                onChange={e => set("phone", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Home Address</label>
            <input
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
              placeholder="Street, City, Country"
              value={form.address}
              onChange={e => set("address", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section: Identity */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Identity & Travel</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nationality</label>
              <input
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                placeholder="e.g. Ghanaian"
                value={form.nationality}
                onChange={e => set("nationality", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">ID Type</label>
              <select
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white cursor-pointer"
                value={form.idType}
                onChange={e => set("idType", e.target.value)}
              >
                <option value="">— Select type —</option>
                <option value="Passport">Passport</option>
                <option value="National ID">National ID</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Driver's Licence">Driver's Licence</option>
              </select>
            </div>
          </div>
          {form.idType && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">ID Number</label>
              <input
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                placeholder={form.idType === "Passport" ? "e.g. G12345678" : "Document number"}
                value={form.idNumber}
                onChange={e => set("idNumber", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handle}
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Guest"}
        </button>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({ customer, onConfirm, onClose, loading }: {
  customer: Customer; onConfirm: () => void; onClose: () => void; loading: boolean;
}) {
  return (
    <Modal title="Remove Guest" onClose={onClose}>
      <p className="text-gray-600 mb-6">
        Remove <strong>{customer.name}</strong> from the guest registry? This will also remove their reservation history.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger px-4 py-2 text-sm">
          {loading ? "Removing…" : "Remove Guest"}
        </button>
      </div>
    </Modal>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [editCustomer, setEdit]     = useState<Customer | null>(null);
  const [deleteCustomer, setDelete] = useState<Customer | null>(null);
  const [formErr, setFormErr]       = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, search],
    queryFn: () => {
      const p = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) p.set("search", search);
      return api.get(`/api/customers?${p}`).then(r => r.data.data);
    },
  });

  const rawCustomers: Customer[] = data?.data || [];
  const customers: Customer[] = rawCustomers.length > 0 ? rawCustomers : SEED_CUSTOMERS;
  const total     = data?.total || customers.length;
  const totalPages = data?.totalPages || 1;

  const createMutation = useMutation({
    mutationFn: (d: typeof EMPTY_FORM) => api.post("/api/customers", d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); setShowForm(false); },
    onError: (e: any) => setFormErr(e?.response?.data?.message || "Failed to add customer"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: number; d: typeof EMPTY_FORM }) => api.put(`/api/customers/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); setEdit(null); },
    onError: (e: any) => setFormErr(e?.response?.data?.message || "Failed to update customer"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/customers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); setDelete(null); },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} registered guest{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setFormErr(""); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={16} /> Add Guest
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex gap-3 items-center mb-5">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input type="text" placeholder="Search by name, email or phone…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400" />
        {search && <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500"><X size={14} /></button>}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="mx-auto text-gray-200 mb-3" size={40} />
            <p className="text-gray-400 text-sm">No guests found.</p>
            {!search && <p className="text-gray-300 text-xs mt-1">Click "Add Guest" to register your first guest.</p>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs border-b border-gray-100 bg-gray-50/70">
                    {["Guest","Contact","Nationality / ID","Joined","Status","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                            {c.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{c.name}</p>
                            <p className="text-gray-400 text-xs">#{c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {c.email && <div className="flex items-center gap-1 text-gray-500 text-xs mb-0.5"><Mail size={10} />{c.email}</div>}
                        {c.phone && <div className="flex items-center gap-1 text-gray-500 text-xs"><Phone size={10} />{c.phone}</div>}
                        {!c.email && !c.phone && <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        {c.nationality && <div className="flex items-center gap-1 text-gray-600 text-xs mb-0.5"><Globe size={10} />{c.nationality}</div>}
                        {c.idType && <p className="text-gray-400 text-xs">{c.idType}: {c.idNumber || "—"}</p>}
                        {!c.nationality && !c.idType && <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">{fmt.date(c.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.status === 1 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                          {c.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => { setFormErr(""); setEdit(c); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDelete(c)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50 text-sm">
                <p className="text-gray-400">Showing {customers.length} of {total}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                    <ChevronLeft size={15} />
                  </button>
                  <span className="px-3 py-2 text-gray-600 font-medium">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Modal */}
      {showForm && (
        <Modal title="Add Guest" onClose={() => setShowForm(false)}>
          {formErr && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{formErr}</div>}
          <CustomerForm initial={EMPTY_FORM} isEdit={false} loading={createMutation.isPending}
            onClose={() => setShowForm(false)}
            onSubmit={d => createMutation.mutate(d)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editCustomer && (
        <Modal title={`Edit — ${editCustomer.name}`} onClose={() => setEdit(null)}>
          {formErr && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{formErr}</div>}
          <CustomerForm
            initial={{
              name: editCustomer.name,
              email: editCustomer.email || "",
              phone: editCustomer.phone || "",
              address: editCustomer.address || "",
              idType: editCustomer.idType || "",
              idNumber: editCustomer.idNumber || "",
              nationality: editCustomer.nationality || "",
            }}
            isEdit={true}
            loading={updateMutation.isPending}
            onClose={() => setEdit(null)}
            onSubmit={d => updateMutation.mutate({ id: editCustomer.id, d })}
          />
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteCustomer && (
        <DeleteConfirm customer={deleteCustomer} loading={deleteMutation.isPending}
          onClose={() => setDelete(null)}
          onConfirm={() => deleteMutation.mutate(deleteCustomer.id)} />
      )}
    </div>
  );
}
