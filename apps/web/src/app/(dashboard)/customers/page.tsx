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

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 my-4">
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
    if (!form.name.trim()) { setErr("Guest name is required."); return; }
    setErr(""); onSubmit(form);
  };

  return (
    <>
      {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{err}</div>}
      <div className="space-y-4">
        <div>
          <label className="label">Full Name *</label>
          <input className="input" placeholder="e.g. Kofi Mensah" value={form.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="guest@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input" placeholder="+233 20 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" placeholder="Guest's address" value={form.address} onChange={e => set("address", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Nationality</label>
            <input className="input" placeholder="e.g. Ghanaian" value={form.nationality} onChange={e => set("nationality", e.target.value)} />
          </div>
          <div>
            <label className="label">ID Type</label>
            <select className="input" value={form.idType} onChange={e => set("idType", e.target.value)}>
              <option value="">— Select —</option>
              <option>Passport</option>
              <option>National ID</option>
              <option>Voter ID</option>
              <option>Driver's Licence</option>
            </select>
          </div>
        </div>
        {form.idType && (
          <div>
            <label className="label">ID Number</label>
            <input className="input" placeholder="ID document number" value={form.idNumber} onChange={e => set("idNumber", e.target.value)} />
          </div>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="btn-secondary px-5 py-2 text-sm">Cancel</button>
          <button onClick={handle} disabled={loading} className="btn-primary px-5 py-2 text-sm">
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Guest"}
          </button>
        </div>
      </div>
    </>
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

  const customers: Customer[] = data?.data || [];
  const total     = data?.total || 0;
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
