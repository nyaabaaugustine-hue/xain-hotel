"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, Phone, Mail, MapPin, ArrowRight,
  Instagram, Facebook, Twitter, Linkedin,
  Star, Clock, ChevronRight,
} from "lucide-react";

const NAV_LINKS: [string, string][] = [
  ["Rooms & Suites", "/rooms"],
  ["Dining", "/#restaurant"],
  ["Experiences", "/#amenities"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Top announce bar */}
      <div className="xh-topbar">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase">
          <div className="hidden sm:flex items-center gap-6 text-white/40">
            <span className="flex items-center gap-1.5"><Phone size={9} /> +233 30 100 0000</span>
            <span className="flex items-center gap-1.5"><Mail size={9} /> info@xainhotel.com</span>
          </div>
          <div className="flex items-center gap-1 text-gold-400/60 mx-auto sm:mx-0">
            {[1,2,3,4,5].map(i => <Star key={i} size={9} className="fill-gold-400/60 text-gold-400/60" />)}
            <span className="ml-2 text-white/30">Rated West Africa's #1 Luxury Hotel 2024</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white/30">
            <Instagram size={11} className="hover:text-gold-400/80 cursor-pointer transition-colors" />
            <Facebook size={11} className="hover:text-gold-400/80 cursor-pointer transition-colors" />
            <Twitter size={11} className="hover:text-gold-400/80 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "top-0 bg-[#030F07]/97 backdrop-blur-2xl shadow-2xl shadow-black/40 border-b border-white/5" : "top-8 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-gold-400/20 group-hover:border-gold-400/50 transition-all shadow-lg shadow-gold-400/10">
              <Image src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png" alt="Xain Hotel" fill className="object-contain p-1" />
            </div>
            <div>
              <p className="text-white font-display font-semibold tracking-[0.25em] text-base leading-none" style={{fontFamily:"var(--font-display)"}}>XAIN</p>
              <p className="text-gold-400/50 text-[8px] tracking-[0.45em] uppercase font-light mt-0.5">Hotel & Residences</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map(([label, href]) => {
              const active = pathname === href;
              return (
                <Link key={label} href={href} className={`relative text-[10.5px] tracking-[0.2em] uppercase font-medium transition-all duration-300 group ${active ? "text-gold-400" : "text-white/60 hover:text-white"}`}>
                  {label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-gold-400 to-gold-300/50 transition-all duration-400 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-white/30 hover:text-white/60 text-[10px] tracking-[0.2em] uppercase transition-colors">
              Staff Portal
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <Link href="/booking" className="xh-btn-gold text-[10px] px-7 py-2.5 tracking-[0.2em]">
              Reserve Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white/70 hover:text-white p-1 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#030F07]/98 backdrop-blur-2xl border-t border-white/5 px-6 pt-4 pb-8">
            <div className="flex flex-col gap-1 mb-6">
              {NAV_LINKS.map(([label, href]) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-3.5 border-b border-white/5 text-white/60 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors group">
                  {label}
                  <ChevronRight size={14} className="opacity-30 group-hover:opacity-70" />
                </Link>
              ))}
            </div>
            <Link href="/booking" onClick={() => setMobileOpen(false)} className="xh-btn-gold text-[10px] px-6 py-3.5 text-center w-full block tracking-[0.2em]">
              Reserve Your Stay
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-[#020C05] text-white/30 border-t border-white/5">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand column */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
              <Image src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779626649/ht_q5mae2.png" alt="Xain Hotel" width={48} height={48} className="object-contain p-1" />
            </div>
            <div>
              <p className="text-white font-display font-semibold tracking-[0.3em] text-lg" style={{fontFamily:"var(--font-display)"}}>XAIN</p>
              <p className="text-gold-400/40 text-[9px] tracking-[0.4em] uppercase">Hotel & Residences</p>
            </div>
          </div>
          <p className="text-white/25 text-xs leading-relaxed mb-7 max-w-xs">
            West Africa's most celebrated luxury retreat — where Ghanaian heritage meets world-class elegance in the heart of Cantonments, Accra.
          </p>
          {/* Awards */}
          <div className="flex flex-wrap gap-3 mb-7">
            {["Forbes Five Stars","Condé Nast Traveler","World's Best 2024"].map(a => (
              <span key={a} className="text-[9px] text-gold-400/50 border border-gold-400/15 rounded-full px-3 py-1 tracking-wide">{a}</span>
            ))}
          </div>
          {/* Social */}
          <div className="flex items-center gap-4">
            {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 border border-white/10 rounded-lg flex items-center justify-center text-white/25 hover:border-gold-400/40 hover:text-gold-400/70 transition-all">
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        <div className="md:col-span-2">
          <p className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">The Hotel</p>
          {[["Rooms & Suites","/rooms"],["About Us","/about"],["Gallery","/#gallery"],["Awards","/#"]].map(([l,h]) => (
            <Link key={l} href={h} className="block text-white/25 hover:text-gold-400/80 text-xs mb-4 tracking-wide transition-colors">{l}</Link>
          ))}
        </div>
        <div className="md:col-span-2">
          <p className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">Experiences</p>
          {[["Fine Dining","/#restaurant"],["Rooftop Pool","/#amenities"],["Spa & Wellness","/#"],["Concierge","/#"]].map(([l,h]) => (
            <Link key={l} href={h} className="block text-white/25 hover:text-gold-400/80 text-xs mb-4 tracking-wide transition-colors">{l}</Link>
          ))}
        </div>
        <div className="md:col-span-2">
          <p className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">Reservations</p>
          {[["Book a Room","/booking"],["Group Bookings","/contact"],["Events & Weddings","/contact"],["Corporate","/contact"]].map(([l,h]) => (
            <Link key={l} href={h} className="block text-white/25 hover:text-gold-400/80 text-xs mb-4 tracking-wide transition-colors">{l}</Link>
          ))}
        </div>

        {/* Contact column */}
        <div className="md:col-span-2">
          <p className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase mb-6">Contact</p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={12} className="text-gold-400/40 mt-0.5 flex-shrink-0" />
              <span className="text-white/25 text-xs leading-relaxed">Cantonments, Accra<br />Greater Accra, Ghana</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={12} className="text-gold-400/40 flex-shrink-0" />
              <span className="text-white/25 text-xs">+233 30 100 0000</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={12} className="text-gold-400/40 flex-shrink-0" />
              <span className="text-white/25 text-xs">info@xainhotel.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={12} className="text-gold-400/40 flex-shrink-0" />
              <span className="text-white/25 text-xs">Concierge 24 / 7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-sm font-semibold tracking-wide mb-1">Join the Inner Circle</p>
            <p className="text-white/20 text-xs">Exclusive offers, event invitations, and curated Accra experiences.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input type="email" placeholder="your@email.com"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white/60 placeholder-white/20 outline-none focus:border-gold-400/40 transition-colors w-full md:w-64" />
            <button className="xh-btn-gold text-[10px] px-5 py-2.5 tracking-widest flex-shrink-0">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/20">
          <p>© {new Date().getFullYear()} Xain Hotel & Residences. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/40 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/40 transition-colors">Cookie Policy</a>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen xh-public" style={{ fontFamily: "var(--font-body)" }}>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
