"use client";
import Image from "next/image";
import { UserSquare2 } from "lucide-react";
import { IMAGES } from "@/lib/images";
export default function HRMPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Human Resources</h1>
      <p className="text-gray-500 text-sm mb-6">Manage staff, departments and payroll</p>
      <div className="card text-center py-16 relative overflow-hidden">
        <Image src={IMAGES.g1} alt="" fill className="object-cover object-center opacity-5 pointer-events-none" sizes="400px" />
        <div className="relative">
          <UserSquare2 className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">No employees added yet.</p>
        </div>
      </div>
    </div>
  );
}
