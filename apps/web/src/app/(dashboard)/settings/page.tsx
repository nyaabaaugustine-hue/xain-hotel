"use client";
import Image from "next/image";
import { Settings } from "lucide-react";
import { IMAGES } from "@/lib/images";
export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Hotel configuration and preferences</p>
      <div className="card text-center py-16 relative overflow-hidden">
        <Image src={IMAGES.g2} alt="" fill className="object-cover object-center opacity-5 pointer-events-none" sizes="400px" />
        <div className="relative">
          <Settings className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">Settings coming soon.</p>
        </div>
      </div>
    </div>
  );
}
