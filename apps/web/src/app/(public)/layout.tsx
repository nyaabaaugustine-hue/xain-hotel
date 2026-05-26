"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links: [string, string][] = [
    ["Home", "/"],
    ["Rooms", "/rooms"],
    ["Dining", "/#restaurant"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-brand-900/98 backdrop-blur-xl shadow-xl shadow-black/30 border-b border-white/5"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-gold-400/20 group-hover:shadow-gold-400/40 transition-shadow border border-white/10 flex-shrink-0">
            <Image src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png" alt="Xain Hotel" width={40} height={40} className="object-contain w-full h-full" />
          </div>
          <div>
            <span className="text-white font-display text-lg font-semibold tracking-[0.3em]">Xain Hotel</span>
            <span className="text-gold-400/60 text-[9px] font-light tracking-[0.4em] block -mt-1 uppercase">Cantonments · Accra</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          {links.map(([l, h]) => (
            <Link key={l} href={h}
              className={`transition-colors tracking-widest uppercase text-[11px] font-medium relative group ${
                pathname === h ? "text-gold-400" : "text-white/70 hover:text-gold-400"
              }`}>
              {l}
              <span className={`absolute -bottom-1 left-0 h-px bg-gold-400 transition-all duration-300 ${
                pathname === h ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-white/40 hover:text-white/70 text-[11px] tracking-widest uppercase transition-colors">
            Staff
          </Link>
          <Link href="/booking" className="btn-gold text-[11px] px-6 py-2.5 tracking-widest">
            Book Now
          </Link>
        </div>

        <button className="md:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-900/98 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {links.map(([l, h]) => (
            <Link key={l} href={h} onClick={() => setMobileOpen(false)}
              className="text-white/70 text-sm py-3 border-b border-white/5 hover:text-gold-400 transition-colors tracking-widest uppercase">
              {l}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setMobileOpen(false)}
            className="btn-gold text-[11px] px-5 py-3.5 text-center mt-3 tracking-widest">
            Book Your Stay
          </Link>
        </div>
      )}
    </nav>
  );
}

function PublicFooter() {
  return (
    <footer className="text-white/30 py-20 px-6 border-t border-white/5" style={{ background: "#010C05" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <Image src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png" alt="Xain Hotel" width={40} height={40} className="object-contain w-full h-full" />
            </div>
            <div>
              <span className="text-white font-display tracking-[0.3em] text-base font-semibold">Xain Hotel</span>
              <span className="text-gold-400/50 text-[9px] tracking-[0.35em] block -mt-1 uppercase">Cantonments · Accra</span>
            </div>
          </div>
          <p className="text-white/25 text-xs leading-relaxed mb-5">
            Redefining luxury hospitality on Ghana&apos;s Gold Coast since 2010.
          </p>
          <div className="flex flex-col gap-2.5 text-[11px] text-white/25">
            <div className="flex items-center gap-2"><Phone size={11} /><span>+233 30 100 0000</span></div>
            <div className="flex items-center gap-2"><Mail size={11} /><span>info@xainhotel.com</span></div>
            <div className="flex items-center gap-2"><MapPin size={11} /><span>Cantonments, Accra, Ghana</span></div>
          </div>
        </div>

        {[
          { title: "Explore",      links: [["Rooms & Suites","/rooms"],["About Us","/about"],["Dining","/"],["Gallery","/"]] },
          { title: "Reservations", links: [["Book a Room","/booking"],["Check Availability","/booking"],["Group Bookings","/contact"],["Contact Us","/contact"]] },
          { title: "Hours",        links: [["Front Desk: 24/7","#"],["Restaurant: 7am–10pm","#"],["Pool: 6am–9pm","#"],["Spa: 8am–8pm","#"]] },
        ].map(({ title, links }) => (
          <div key={title}>
            <p className="text-white/70 text-[10px] font-semibold tracking-[0.25em] uppercase mb-6">{title}</p>
            <div className="flex flex-col gap-3.5">
              {links.map(([label, href]) => (
                <Link key={label} href={href}
                  className="text-white/25 hover:text-gold-400 text-xs transition-colors tracking-wide">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <p>© {new Date().getFullYear()} SMIC360 Softwares. All rights reserved.</p>
        <div className="flex items-center gap-3 text-white/20">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
