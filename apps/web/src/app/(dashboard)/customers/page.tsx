"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import { Users, Plus } from "lucide-react";

export default function CustomersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["customers"], queryFn: () => api.get("/api/customers").then(r => r.data.data) });
  const customers = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage guest profiles</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Customer</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No customers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Nationality</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3 text-gray-500">{c.email || "—"}</td>
                    <td className="py-3 text-gray-500">{c.phone || "—"}</td>
                    <td className="py-3 text-gray-500">{c.nationality || "—"}</td>
                    <td className="py-3 text-gray-500">{fmt.date(c.createdAt)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {c.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
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
