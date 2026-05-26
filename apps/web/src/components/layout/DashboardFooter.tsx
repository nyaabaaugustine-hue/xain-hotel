import Link from "next/link";
import { Heart, Globe, Phone, Mail, MapPin, Shield } from "lucide-react";

export default function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white mt-auto flex-shrink-0">
      <div className="max-w-[1440px] mx-auto px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Left — brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold tracking-widest">X</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-none">Xain Hotel PMS</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Property Management Suite</p>
            </div>
            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              All systems operational
            </span>
          </div>

          {/* Centre — quick links */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] text-gray-400">
            <Link href="/dashboard"    className="hover:text-brand-600 transition-colors font-medium">Dashboard</Link>
            <Link href="/reservations" className="hover:text-brand-600 transition-colors font-medium">Reservations</Link>
            <Link href="/customers"    className="hover:text-brand-600 transition-colors font-medium">Guests</Link>
            <Link href="/reports"      className="hover:text-brand-600 transition-colors font-medium">Reports</Link>
            <Link href="/settings"     className="hover:text-brand-600 transition-colors font-medium">Settings</Link>
          </div>

          {/* Right — contact + legal */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-[10px] text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone size={10} /> +233 30 100 0000</span>
              <span className="flex items-center gap-1"><MapPin size={10} /> Cantonments, Accra</span>
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <Shield size={10} />
              <span>© {year} Xain Hotel. All rights reserved.</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
