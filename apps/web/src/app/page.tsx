"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble, Wifi, Car, Utensils, Phone, Mail, MapPin,
  Star, ChevronRight, Coffee, Shield, Waves, Menu, X, ArrowRight,
  ChevronLeft, MapPin as MapIcon, Clock, X as XIcon, Flame, Leaf, Wine, UtensilsCrossed,
} from "lucide-react";
import { IMAGES } from "@/lib/images";

// ── Cloudinary image URLs ──────────────────────────────────────────────────
const CL = {
  hero:          "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/serenity-shore-green-getaway-ai-generated_994744-13491_tdi7os.jpg",
  roomClassic:   "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/one-king-size-bed-hotel-room_114579-12159_aadqgg.avif",
  roomKente:     "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/modern-studio-apartment-design-with-bedroom-living-space_1262-12375_faldtb.avif",
  roomPresiden:  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/pillow-bed_74190-6244_sueu3d.avif",
  amenityPool:   "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/sunset-pool_1203-3191_wg2dwy.jpg",
  amenityBeach:  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/white-hammocks-with-umbrellas_1203-2073_ir3bys.avif",
  amenityDining: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/tropical-hotel-holiday-background-resort_1203-4943_raibay.avif",
  amenityDesk:   "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588184/front-desk-staff-managing-guest-checkin_482257-85379_wbx41s.avif",
  lobby:         "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588184/happy-relaxed-african-american-woman-relaxing-hotel-lobby-using-smartphone-watching-online-video-browsing-internet-female-tourist-resting-with-phone-lounge-area-luxury-resort_482257-72500_mgkpqm.avif",
  aerial:        "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/beautiful-aerial-shot-coastal-city-sea_181624-599_fjrnqi.avif",
  accraCity:     "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/memorial-el-polvorin-tragedy-plaza-5-de-mayo-panama-city_261932-5029_glo94s.jpg",
  gallery1:      "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588186/g_mzqus0.avif",
  gallery2:      "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588186/e_rc4ztd.avif",
  umbrella:      "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588184/umbrella-chair_74190-3726_fvynl9.avif",
};

// ── Hero slider slides ─────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image:    CL.hero,
    eyebrow:  "Cantonments · Accra · Ghana",
    headline: "SMIC360",
    sub:      "Softwares",
    body:     "Where Ghanaian heritage meets world-class luxury.\nEvery detail a testament to the Gold Coast.",
  },
  {
    image:    CL.amenityPool,
    eyebrow:  "Rooftop Infinity Pool",
    headline: "ESCAPE",
    sub:      "Above the City",
    body:     "Drift above the Accra skyline in our heated rooftop\ninfinity pool — open from sunrise to sunset.",
  },
  {
    image:    IMAGES.g1,
    eyebrow:  "Signature Accommodation",
    headline: "KENTE",
    sub:      "Suite Experience",
    body:     "Kente-woven headboards, premium linens and\npanoramic city views await inside every suite.",
  },
  {
    image:    IMAGES.resort,
    eyebrow:  "Ghana · West Africa",
    headline: "GOLD",
    sub:      "Coast Living",
    body:     "Nestled in the heart of the Diplomatic Enclave,\nSMIC360 is where Accra's finest come to rest.",
  },
  {
    image:    CL.amenityBeach,
    eyebrow:  "The SMIC360 Experience",
    headline: "UNWIND",
    sub:      "In Pure Luxury",
    body:     "From poolside hammocks to the lobby lounge,\nevery corner is crafted for your comfort.",
  },
];

// ── 6 Rooms & Suites ──────────────────────────────────────────────────────
const ROOMS = [
  {
    name: "Classic Room",
    price: 250, guests: 2,
    badge: "Comfort",
    badgeColor: "bg-emerald-500 text-white",
    desc: "Refined comfort with rich Ghanaian textile accents and all modern amenities.",
    accent: "from-emerald-600 via-teal-500 to-cyan-400",
    pattern: "kente-pattern",
    image: CL.roomClassic,
  },
  {
    name: "Deluxe Garden Room",
    price: 350, guests: 2,
    badge: "Garden View",
    badgeColor: "bg-lime-500 text-white",
    desc: "A serene garden-facing retreat — king bed, private balcony and lush tropical views.",
    accent: "from-lime-600 via-green-500 to-emerald-400",
    pattern: "kente-pattern",
    image: CL.amenityPool,
  },
  {
    name: "Executive Room",
    price: 420, guests: 3,
    badge: "Business Ready",
    badgeColor: "bg-sky-500 text-white",
    desc: "Spacious executive comfort — dedicated work area, express check-in and club lounge access.",
    accent: "from-sky-600 via-blue-500 to-cyan-400",
    pattern: "adinkra-pattern",
    image: CL.umbrella,
  },
  {
    name: "Kente Suite",
    price: 480, guests: 3,
    badge: "Most Popular",
    badgeColor: "bg-amber-400 text-amber-900",
    desc: "Our signature suite — kente-woven headboards, premium linens, panoramic city views.",
    accent: "from-amber-500 via-orange-400 to-yellow-300",
    pattern: "adinkra-pattern",
    image: CL.roomKente,
  },
  {
    name: "Sky Penthouse Suite",
    price: 750, guests: 4,
    badge: "Sky Level",
    badgeColor: "bg-violet-500 text-white",
    desc: "Floor-to-ceiling views, private rooftop terrace and bespoke in-suite dining above the Accra skyline.",
    accent: "from-violet-600 via-purple-500 to-indigo-400",
    pattern: "kente-weave",
    image: CL.aerial,
  },
  {
    name: "Presidential Suite",
    price: 950, guests: 6,
    badge: "Pinnacle",
    badgeColor: "bg-rose-500 text-white",
    desc: "An entire floor of opulence — private terrace, personal butler, bespoke dining.",
    accent: "from-rose-600 via-red-500 to-orange-400",
    pattern: "kente-weave",
    image: CL.roomPresiden,
  },
];

const AMENITIES = [
  { icon: Wifi,     title: "1 Gbps Fibre WiFi",      desc: "Seamless high-speed connectivity throughout every corner of the hotel.",                image: null },
  { icon: Utensils, title: "Gold Coast Fine Dining",  desc: "Award-winning restaurant fusing Ghanaian heritage with contemporary global cuisine.",    image: CL.amenityDining },
  { icon: Car,      title: "Valet & Secure Parking",  desc: "24-hour valet service and climate-controlled underground parking.",                      image: null },
  { icon: Waves,    title: "Rooftop Infinity Pool",   desc: "Heated pool with sweeping views across the Accra skyline and beyond.",                   image: CL.amenityPool },
  { icon: Coffee,   title: "Lobby Lounge & Bar",      desc: "Artisanal cocktails, specialty coffee, and Ghanaian bites from dawn to midnight.",       image: CL.lobby },
  { icon: Shield,   title: "24/7 Personal Concierge", desc: "A dedicated team ready to curate your perfect Accra experience around the clock.",       image: CL.amenityDesk },
];

const TESTIMONIALS = [
  { name: "Ama Asante",       flag: "🇬🇭", city: "Accra",  text: "Xain is in a class of its own. The Kente Suite is breathtaking — every detail speaks of heritage and luxury.", rating: 5 },
  { name: "James Holloway",   flag: "🇬🇧", city: "London", text: "I have stayed at five-star hotels across four continents. Xain rivals them all — the service is extraordinary.", rating: 5 },
  { name: "Fatima Al-Rashid", flag: "🇦🇪", city: "Dubai",  text: "An oasis of calm and elegance. The Presidential Suite is the finest I have experienced on the entire continent.", rating: 5 },
];

const EVENTS = [
  { date: "JUN 15", title: "Gold Coast Jazz Night",  desc: "An evening of live jazz under the stars with Ghana's finest musicians.",          time: "7:00 PM",  location: "Rooftop Lounge" },
  { date: "JUN 22", title: "Farm-to-Table Dinner",   desc: "Exclusive six-course tasting menu curated by Executive Chef Claire Fontaine.",   time: "6:30 PM",  location: "Gold Coast Restaurant" },
  { date: "JUL 04", title: "Sunset Yoga Session",    desc: "Morning vinyasa flow overlooking the Accra skyline.",                            time: "6:00 AM",  location: "Infinity Pool Deck" },
  { date: "JUL 12", title: "Kente Weaving Workshop", desc: "Learn the art of kente weaving from master artisans in an intimate session.",    time: "10:00 AM", location: "Cultural Hall" },
  { date: "JUL 20", title: "Cocktail Masterclass",   desc: "Mix and shake signature cocktails with our head mixologist.",                   time: "4:00 PM",  location: "Lobby Lounge" },
  { date: "AUG 01", title: "Wine & Cheese Pairing",  desc: "A curated journey through West African wines paired with artisanal cheeses.",   time: "7:30 PM",  location: "Private Dining Room" },
];

const GALLERY_IMAGES = [
  { src: IMAGES.pool,   alt: "Rooftop infinity pool at sunset" },
  { src: IMAGES.resort, alt: "Tropical resort aerial view" },
  { src: CL.roomKente,  alt: "Kente Suite interior" },
  { src: IMAGES.beach,  alt: "Beachside hammocks and umbrellas" },
  { src: CL.lobby,      alt: "Hotel lobby lounge" },
  { src: IMAGES.desk,   alt: "Front desk concierge team" },
  { src: CL.aerial,     alt: "Accra coastline aerial" },
  { src: IMAGES.g1,     alt: "Hotel gallery" },
  { src: IMAGES.g2,     alt: "Hotel ambiance" },
];

const WEEKLY_SPECIALS = [
  { day: "Monday",    special: "Jollof Rice & Grilled Chicken", color: "from-rose-500 to-pink-600",    emoji: "🍛" },
  { day: "Tuesday",   special: "Fufu & Goat Light Soup",        color: "from-amber-500 to-orange-600", emoji: "🥣" },
  { day: "Wednesday", special: "Grilled Tilapia & Banku",       color: "from-emerald-500 to-teal-600", emoji: "🐟" },
  { day: "Thursday",  special: "Waakye & Shito Sauce",          color: "from-violet-500 to-purple-600",emoji: "🍚" },
  { day: "Friday",    special: "Gold Coast Jollof Night",       color: "from-red-500 to-rose-600",     emoji: "🎉" },
  { day: "Saturday",  special: "Seafood Paella Special",        color: "from-sky-500 to-blue-600",     emoji: "🦐" },
  { day: "Sunday",    special: "Brunch & Bottomless Mimosas",   color: "from-yellow-400 to-amber-500", emoji: "🥂" },
];

// ── Hero Slider ────────────────────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent]   = useState(0);
  const [prev, setPrev]         = useState<number | null>(null);
  const [animDir, setAnimDir]   = useState<"next" | "prev">("next");
  const [isAnimating, setAnim]  = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total                   = HERO_SLIDES.length;

  const goTo = useCallback((idx: number, dir: "next" | "prev") => {
    if (isAnimating) return;
    setAnimDir(dir); setPrev(current); setCurrent(idx); setAnim(true);
    setTimeout(() => { setPrev(null); setAnim(false); }, 1000);
  }, [current, isAnimating]);

  const next = useCallback(() => goTo((current + 1) % total, "next"), [current, goTo, total]);
  const back = useCallback(() => goTo((current - 1 + total) % total, "prev"), [current, goTo, total]);

  useEffect(() => {
    timerRef.current = setTimeout(next, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, next]);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-brand-900 overflow-hidden">
      {HERO_SLIDES.map((slide, i) => {
        const isActive = i === current; const isPrev = i === prev;
        const px = mousePos.x * (isActive ? 8 : isPrev ? 4 : 0);
        const py = mousePos.y * (isActive ? 8 : isPrev ? 4 : 0);
        return (
          <div key={i} className="absolute inset-0" style={{ opacity: isActive ? 1 : 0, zIndex: isActive ? 2 : isPrev ? 1 : 0, transform: `translate(${px}px,${py}px)`, transition: isActive ? "opacity 1.1s cubic-bezier(0.4,0,0.2,1),transform 0.1s ease-out" : "opacity 1s cubic-bezier(0.4,0,0.2,1),transform 0.1s ease-out" }}>
            <Image src={slide.image} alt={slide.eyebrow} fill priority={i === 0} className="object-cover object-center" style={{ transform: isActive ? "scale(1.07)" : "scale(1)", filter: isActive ? "blur(0px)" : "blur(2px) brightness(0.85)", transition: isActive ? "transform 7s cubic-bezier(0.25,0.46,0.45,0.94),filter 1.1s ease" : "transform 1s ease,filter 1s ease" }} sizes="100vw" />
            <div className="absolute inset-0" style={{ background: isActive ? "linear-gradient(to bottom,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.18) 40%,rgba(10,35,20,0.88) 100%)" : "transparent", transition: "background 1.1s ease" }} />
          </div>
        );
      })}
      <div className="absolute inset-0 z-10 adinkra-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-400/5 rounded-full blur-[160px] pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-brand-900/70 to-transparent pointer-events-none z-10" />
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto w-full">
        {HERO_SLIDES.map((slide, i) => {
          const isActive = i === current;
          return (
            <div key={i} aria-hidden={!isActive} className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0) scale(1)" : animDir === "next" ? "translateY(32px) scale(0.98)" : "translateY(-32px) scale(0.98)", transition: isActive ? "opacity 0.8s ease 0.2s,transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s" : "opacity 0.4s ease,transform 0.4s ease", pointerEvents: isActive ? "auto" : "none" }}>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400/50" />
                <p className="text-gold-400/90 text-[10px] font-medium tracking-[0.5em] uppercase">{slide.eyebrow}</p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400/50" />
              </div>
              <h1 className="leading-[0.82] font-display font-light text-white mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(5rem,13vw,10rem)", letterSpacing: "-0.02em" }}>{slide.headline}</h1>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400/40" />
                <span className="font-display font-light text-gold-400/75 tracking-[0.75em] uppercase text-sm">{slide.sub}</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400/40" />
              </div>
              <p className="text-white/55 text-base md:text-lg max-w-lg mx-auto mb-14 leading-relaxed font-light whitespace-pre-line">{slide.body}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking" className="btn-gold text-[11px] px-12 py-4 tracking-widest">Reserve Your Stay</Link>
                <Link href="/rooms" className="btn-outline-gold text-[11px] px-12 py-4 tracking-widest">Explore Rooms</Link>
              </div>
            </div>
          );
        })}
        <div className="opacity-0 pointer-events-none">
          <div className="mb-8 h-5" /><div className="mb-4" style={{ fontSize: "clamp(5rem,13vw,10rem)" }}>SMIC360</div>
          <div className="mb-8 h-5" /><div className="mb-14 h-16" /><div className="h-12" />
        </div>
      </div>
      <button onClick={back} aria-label="Previous slide" className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-white/15 hover:text-white hover:border-white/40 hover:scale-110 active:scale-95 transition-all duration-300"><ChevronLeft size={22} /></button>
      <button onClick={next} aria-label="Next slide" className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-white/15 hover:text-white hover:border-white/40 hover:scale-110 active:scale-95 transition-all duration-300"><ArrowRight size={22} /></button>
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? "next" : "prev")} aria-label={`Go to slide ${i + 1}`} className="group relative flex items-center justify-center">
            <span className="block rounded-full transition-all duration-500" style={{ width: i === current ? "32px" : "6px", height: "6px", background: i === current ? "linear-gradient(90deg,#B8860B,#E8B433)" : "rgba(255,255,255,0.28)", boxShadow: i === current ? "0 0 10px rgba(232,180,51,0.5)" : "none" }} />
          </button>
        ))}
      </div>
      <div className="absolute bottom-24 right-8 md:right-14 z-30 hidden md:flex items-center gap-2 text-white/30 text-[11px] tracking-widest font-light">
        <span className="text-gold-400/70 font-medium">{String(current + 1).padStart(2, "0")}</span><span>/</span><span>{String(total).padStart(2, "0")}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/5">
        <div key={current} className="h-full bg-gradient-to-r from-gold-400/60 to-gold-500/90" style={{ animation: "heroProgress 6s linear forwards" }} />
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/25">
        <div className="w-5 h-9 border border-white/15 rounded-full flex justify-center pt-2"><div className="w-0.5 h-2 bg-gold-400/40 rounded-full animate-bounce" /></div>
        <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
      </div>
    </section>
  );
}

// ── Lightbox ───────────────────────────────────────────────────────────────
function LightboxModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"><XIcon size={28} /></button>
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <Image src={src} alt={alt} width={1920} height={1080} className="w-full h-full object-contain" sizes="100vw" />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightbox, setLightbox]     = useState<string | null>(null);

  useEffect(() => { if (!loading && user) router.replace("/dashboard"); }, [user, loading, router]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-brand-900">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-brand-900/98 backdrop-blur-xl shadow-xl shadow-black/30 border-b border-white/5" : "bg-transparent"}`}>
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
            {[["Home","/"],["Rooms","/rooms"],["Dining","/#restaurant"],["About","/about"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={l} href={h} className="text-white/70 hover:text-gold-400 transition-colors tracking-widest uppercase text-[11px] font-medium relative group">
                {l}<span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-white/40 hover:text-white/70 text-[11px] tracking-widest uppercase transition-colors">Staff</Link>
            <Link href="/booking" className="btn-gold text-[11px] px-6 py-2.5 tracking-widest">Book Now</Link>
          </div>
          <button className="md:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-brand-900/98 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-1">
            {[["Home","/"],["Rooms","/rooms"],["About","/about"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={l} href={h} onClick={() => setMobileOpen(false)} className="text-white/70 text-sm py-3 border-b border-white/5 hover:text-gold-400 transition-colors tracking-widest uppercase">{l}</Link>
            ))}
            <Link href="/booking" onClick={() => setMobileOpen(false)} className="btn-gold text-[11px] px-5 py-3.5 text-center mt-3 tracking-widest">Book Your Stay</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <HeroSlider />

      {/* ── QUICK BOOKING BAR ── */}
      <section className="bg-white border-b border-black/5 shadow-xl shadow-black/8">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div><label className="label">Check In</label><input type="date" className="input text-sm" defaultValue={new Date().toISOString().split("T")[0]} /></div>
          <div><label className="label">Check Out</label><input type="date" className="input text-sm" /></div>
          <div><label className="label">Guests</label>
            <select className="input text-sm">{["1 Guest","2 Guests","3 Guests","4 Guests","5+ Guests"].map(o => <option key={o}>{o}</option>)}</select>
          </div>
          <div><label className="label">Room Type</label>
            <select className="input text-sm">{["Any Room","Classic Room","Deluxe Garden Room","Executive Room","Kente Suite","Sky Penthouse Suite","Presidential Suite"].map(o => <option key={o}>{o}</option>)}</select>
          </div>
          <Link href="/booking" className="btn-gold text-[11px] px-6 py-3.5 font-semibold text-center tracking-widest">Check Availability</Link>
        </div>
      </section>

      {/* ── STAT STRIP ── */}
      <section className="bg-cream-dark/30 border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["15+","Years of Legacy"],["80","Luxury Rooms"],["150+","Team Members"],["4.9★","Guest Rating"]].map(([num, label]) => (
            <div key={label}>
              <p className="font-display text-3xl font-semibold text-brand-800" style={{ fontFamily: "var(--font-display)" }}>{num}</p>
              <p className="text-[10px] text-gray-400 tracking-[0.25em] uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="gold-line mx-auto mb-6" />
            <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">The Xain Experience</p>
            <h2 className="font-display font-light text-brand-900 leading-tight" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Crafted for the Discerning Few
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AMENITIES.map(({ icon: Icon, title, desc, image }) => (
              <div key={title} className="luxury-card group overflow-hidden">
                {image && (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                <div className="p-8">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-gold-100 group-hover:to-gold-50 transition-all duration-400 border border-brand-100/50 group-hover:border-gold-200">
                    <Icon className="text-brand-600 group-hover:text-gold-600 transition-colors duration-300" size={22} />
                  </div>
                  <h3 className="font-semibold text-brand-900 mb-2.5 tracking-tight">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
