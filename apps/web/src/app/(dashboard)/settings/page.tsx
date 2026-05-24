"use client";
import { Settings } from "lucide-react";
export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Hotel configuration and preferences</p>
      <div className="card text-center py-16">
        <Settings className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-500">Settings coming soon.</p>
      </div>
    </div>
  );
}
