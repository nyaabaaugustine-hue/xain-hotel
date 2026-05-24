"use client";
import Image from "next/image";
import { Users } from "lucide-react";
import { IMAGES } from "@/lib/images";
export default function AccountsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Accounts</h1>
      <p className="text-gray-500 text-sm mb-6">User accounts and permissions</p>
      <div className="card text-center py-16 relative overflow-hidden">
        <Image src={IMAGES.g2} alt="" fill className="object-cover object-center opacity-5 pointer-events-none" sizes="400px" />
        <div className="relative">
          <Users className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">No accounts yet.</p>
        </div>
      </div>
    </div>
  );
}
