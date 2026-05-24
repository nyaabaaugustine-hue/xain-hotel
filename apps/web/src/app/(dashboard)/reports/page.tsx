"use client";
import Image from "next/image";
import { BarChart3 } from "lucide-react";
import { IMAGES } from "@/lib/images";
export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Reports</h1>
      <p className="text-gray-500 text-sm mb-6">Analytics and business insights</p>
      <div className="card text-center py-16 relative overflow-hidden">
        <Image src={IMAGES.shore} alt="" fill className="object-cover object-center opacity-5 pointer-events-none" sizes="400px" />
        <div className="relative">
          <BarChart3 className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">Reports coming soon.</p>
        </div>
      </div>
    </div>
  );
}
