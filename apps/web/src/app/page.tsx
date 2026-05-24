"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble, Wifi, Car, Utensils, Phone, Mail, MapPin,
  Star, ChevronRight, Coffee, Shield, Waves, Menu, X, ArrowRight,
  ChevronLeft, Calendar, MapPin as MapIcon, Clock, X as XIcon,
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

const ROOMS = [
  {
    name: "Classic Room",       price: 250, guests: 2,
    badge: "Comfort",           badgeColor: "bg-brand-600 text-white",
    desc: "Refined comfort with rich Ghanaian textile accents and all modern amenities.",
    accent: "from-[#0A3520] via-[#0F5530] to-[#1A6040]",
    pattern: "kente-pattern",   image: CL.roomClassic,
  },
  {
    name: "Kente Suite",        price: 480, guests: 3,
    badge: "Most Popular",      badgeColor: "bg-gold-400 text-brand-900",
    desc: "Our signature suite — kente-woven headboards, premium linens, panoramic city views.",
    accent: "from-[#1A0C05] via-[#2E1508] to-[#3D1C0A]",
    pattern: "adinkra-pattern", image: CL.roomKente,
  },
  {
    name: "Presidential Suite", price: 950, guests: 6,
    badge: "Pinnacle",          badgeColor: "bg-earth text-white",
    desc: "An entire floor of opulence — private terrace, personal butler, bespoke dining.",
    accent: "from-[#0D1A0A] via-[#142810] to-[#1E3A14]",
    pattern: "kente-weave",     image: CL.roomPresiden,
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
  { date: "JUN 15", title: "Gold Coast Jazz Night",     desc: "An evening of live jazz under the stars with Ghana's finest musicians.",               time: "7:00 PM", location: "Rooftop Lounge" },
  { date: "JUN 22", title: "Farm-to-Table Dinner",       desc: "Exclusive six-course tasting menu curated by Executive Chef Claire Fontaine.",          time: "6:30 PM", location: "Gold Coast Restaurant" },
  { date: "JUL 04", title: "Sunset Yoga Session",        desc: "Morning vinyasa flow overlooking the Accra skyline.",                                   time: "6:00 AM", location: "Infinity Pool Deck" },
  { date: "JUL 12", title: "Kente Weaving Workshop",     desc: "Learn the art of kente weaving from master artisans in an intimate session.",           time: "10:00 AM", location: "Cultural Hall" },
  { date: "JUL 20", title: "Cocktail Masterclass",       desc: "Mix and shake signature cocktails with our head mixologist.",                          time: "4:00 PM",  location: "Lobby Lounge" },
  { date: "AUG 01", title: "Wine & Cheese Pairing",      desc: "A curated journey through West African wines paired with artisanal cheeses.",          time: "7:30 PM",  location: "Private Dining Room" },
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

// ── Hero Slider component ──────────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent]   = useState(0);
  const [prev, setPrev]         = useState<number | null>(null);
  const [animDir, setAnimDir]   = useState<"next" | "prev">("next");
  const [isAnimating, setAnim]  = useState(false);
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total                   = HERO_SLIDES.length;

  const goTo = useCallback((idx: number, dir: "next" | "prev") => {
    if (isAnimating) return;
    setAnimDir(dir);
    setPrev(current);
    setCurrent(idx);
    setAnim(true);
    setTimeout(() => { setPrev(null); setAnim(false); }, 1000);
  }, [current, isAnimating]);

  const next = useCallback(() => goTo((current + 1) % total, "next"), [current, goTo, total]);
  const back = useCallback(() => goTo((current - 1 + total) % total, "prev"), [current, goTo, total]);

  // Auto-advance every 6 s
  useEffect(() => {
    timerRef.current = setTimeout(next, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, next]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-brand-900 overflow-hidden">

      {/* ── Background image layers ── */}
      {HERO_SLIDES.map((slide, i) => {
        const isActive = i === current;
        const isPrev   = i === prev;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity:    isActive ? 1 : isPrev ? 0 : 0,
              zIndex:     isActive ? 2 : isPrev ? 1 : 0,
              transition: isActive
                ? "opacity 1.1s cubic-bezier(0.4,0,0.2,1)"
                : isPrev
                ? "opacity 1s cubic-bezier(0.4,0,0.2,1)"
                : "none",
            }}
          >
            <Image
              src={slide.image}
              alt={slide.eyebrow}
              fill
              priority={i === 0}
              className="object-cover object-center"
              style={{
                transform: isActive ? "scale(1.07)" : isPrev ? "scale(1.02)" : "scale(1)",
                filter: isActive ? "blur(0px) brightness(1)" : isPrev ? "blur(2px) brightness(0.85)" : "blur(0px)",
                transition: isActive
                  ? "transform 7s cubic-bezier(0.25,0.46,0.45,0.94), filter 1.1s ease"
                  : isPrev
                  ? "transform 1s ease, filter 1s ease"
                  : "none",
              }}
              sizes="100vw"
            />
            {/* Per-slide gradient overlay — slightly different warmth per slide */}
            <div
              className="absolute inset-0"
              style={{
                background: isActive
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 40%, rgba(10,35,20,0.88) 100%)"
                  : "transparent",
                transition: "background 1.1s ease",
              }}
            />
          </div>
        );
      })}

      {/* Adinkra texture */}
      <div className="absolute inset-0 z-10 adinkra-pattern opacity-15 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-400/5 rounded-full blur-[160px] pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-brand-900/70 to-transparent pointer-events-none z-10" />

      {/* ── Slide text ── */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto w-full">
        {HERO_SLIDES.map((slide, i) => {
          const isActive = i === current;
          return (
            <div
              key={i}
              aria-hidden={!isActive}
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              style={{
                opacity:    isActive ? 1 : 0,
                transform:  isActive
                  ? "translateY(0) scale(1)"
                  : animDir === "next"
                  ? "translateY(32px) scale(0.98)"
                  : "translateY(-32px) scale(0.98)",
                transition: isActive
                  ? "opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s"
                  : "opacity 0.4s ease, transform 0.4s ease",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400/50" />
                <p className="text-gold-400/90 text-[10px] font-medium tracking-[0.5em] uppercase">
                  {slide.eyebrow}
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400/50" />
              </div>

              {/* Main headline */}
              <h1
                className="leading-[0.82] font-display font-light text-white mb-4"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(5rem,13vw,10rem)", letterSpacing: "-0.02em" }}>
                {slide.headline}
              </h1>

              {/* Sub-headline */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400/40" />
                <span className="font-display font-light text-gold-400/75 tracking-[0.75em] uppercase text-sm">
                  {slide.sub}
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400/40" />
              </div>

              {/* Body */}
              <p className="text-white/55 text-base md:text-lg max-w-lg mx-auto mb-14 leading-relaxed font-light whitespace-pre-line">
                {slide.body}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking" className="btn-gold text-[11px] px-12 py-4 tracking-widest">
                  Reserve Your Stay
                </Link>
                <Link href="/rooms" className="btn-outline-gold text-[11px] px-12 py-4 tracking-widest">
                  Explore Rooms
                </Link>
              </div>
            </div>
          );
        })}

        {/* Reserve space so section has height */}
        <div className="opacity-0 pointer-events-none">
          <div className="mb-8 h-5" />
          <div className="mb-4" style={{ fontSize: "clamp(5rem,13vw,10rem)" }}>SMIC360</div>
          <div className="mb-8 h-5" />
          <div className="mb-14 h-16" />
          <div className="h-12" />
        </div>
      </div>

      {/* ── Arrow controls ── */}
      <button
        onClick={back}
        aria-label="Previous slide"
        className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-30
                   w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm
                   flex items-center justify-center text-white/60
                   hover:bg-white/15 hover:text-white hover:border-white/40 hover:scale-110
                   active:scale-95
                   transition-all duration-300">
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30
                   w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm
                   flex items-center justify-center text-white/60
                   hover:bg-white/15 hover:text-white hover:border-white/40 hover:scale-110
                   active:scale-95
                   transition-all duration-300">
        <ArrowRight size={22} />
      </button>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative flex items-center justify-center"
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width:      i === current ? "32px" : "6px",
                height:     "6px",
                background: i === current
                  ? "linear-gradient(90deg, #B8860B, #E8B433)"
                  : "rgba(255,255,255,0.28)",
                boxShadow:  i === current
                  ? "0 0 10px rgba(232,180,51,0.5)"
                  : "none",
              }}
            />
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-24 right-8 md:right-14 z-30 hidden md:flex items-center gap-2 text-white/30 text-[11px] tracking-widest font-light">
        <span className="text-gold-400/70 font-medium">{String(current + 1).padStart(2, "0")}</span>
        <span>/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/5">
        <div
          key={current}
          className="h-full bg-gradient-to-r from-gold-400/60 to-gold-500/90"
          style={{
            animation: "heroProgress 6s linear forwards",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/25">
        <div className="w-5 h-9 border border-white/15 rounded-full flex justify-center pt-2">
          <div className="w-0.5 h-2 bg-gold-400/40 rounded-full animate-bounce" />
        </div>
        <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
      </div>
    </section>
  );
}

// ── Lightbox Modal ──────────────────────────────────────────────────────────
function LightboxModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10">
        <XIcon size={28} />
      </button>
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <Image src={src} alt={alt} width={1920} height={1080} className="w-full h-full object-contain" sizes="100vw" />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-900/98 backdrop-blur-xl shadow-xl shadow-black/30 border-b border-white/5"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-500 rounded flex items-center justify-center shadow-lg shadow-gold-400/20 group-hover:shadow-gold-400/40 transition-shadow">
              <span className="text-brand-900 font-bold text-sm tracking-widest">S</span>
            </div>
            <div>
              <span className="text-white font-display text-lg font-semibold tracking-[0.3em]">SMIC360</span>
              <span className="text-gold-400/60 text-[9px] font-light tracking-[0.4em] block -mt-1 uppercase">Softwares</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {[["Home","/"],["Rooms","/rooms"],["About","/about"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={l} href={h}
                className="text-white/70 hover:text-gold-400 transition-colors tracking-widest uppercase text-[11px] font-medium relative group">
                {l}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
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
            {[["Home","/"],["Rooms","/rooms"],["About","/about"],["Contact","/contact"]].map(([l,h]) => (
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

      {/* ── HERO SLIDER ── */}
      <HeroSlider />

      {/* ── QUICK BOOKING BAR ── */}
      <section className="bg-white border-b border-black/5 shadow-xl shadow-black/8">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="label">Check In</label>
            <input type="date" className="input text-sm" defaultValue={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label className="label">Check Out</label>
            <input type="date" className="input text-sm" />
          </div>
          <div>
            <label className="label">Guests</label>
            <select className="input text-sm">
              {["1 Guest","2 Guests","3 Guests","4 Guests","5+ Guests"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Room Type</label>
            <select className="input text-sm">
              {["Any Room","Classic Room","Kente Suite","Presidential Suite"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <Link href="/booking" className="btn-gold text-[11px] px-6 py-3.5 font-semibold text-center tracking-widest">
            Check Availability
          </Link>
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
            <h2 className="font-display font-light text-brand-900 leading-tight"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Crafted for the Discerning Few
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AMENITIES.map(({ icon: Icon, title, desc, image }) => (
              <div key={title} className="luxury-card group overflow-hidden">
                {image && (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image src={image} alt={title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                <div className="p-8">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6
                                  group-hover:bg-gradient-to-br group-hover:from-gold-100 group-hover:to-gold-50
                                  transition-all duration-400 border border-brand-100/50 group-hover:border-gold-200">
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

      {/* ── ROOMS PREVIEW ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <div className="gold-line mb-6" />
              <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">Accommodations</p>
              <h2 className="font-display font-light text-brand-900"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
                Rooms & Suites
              </h2>
            </div>
            <Link href="/rooms"
              className="flex items-center gap-2 text-brand-600 hover:text-gold-500 text-sm font-medium transition-colors group tracking-wide">
              View All Rooms
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {ROOMS.map((room) => (
              <div key={room.name} className="luxury-card group">
                <div className={`h-60 bg-gradient-to-br ${room.accent} relative overflow-hidden`}>
                  <Image src={room.image} alt={room.name} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className={`absolute inset-0 ${room.pattern} opacity-20`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <BedDouble className="absolute bottom-5 right-5 text-white/8 group-hover:text-white/15 transition-colors duration-500" size={90} />
                  <span className={`absolute top-5 left-5 text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-widest uppercase ${room.badgeColor}`}>
                    {room.badge}
                  </span>
                  <div className="absolute bottom-5 left-5">
                    <p className="text-2xl font-display text-white font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                      GH₵{room.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase">per night</p>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-display font-semibold text-brand-900 text-xl mb-2.5"
                      style={{ fontFamily: "var(--font-display)" }}>{room.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">{room.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 tracking-wide">👥 Up to {room.guests} guests</span>
                    <Link href="/booking" className="btn-gold text-[10px] px-5 py-2 tracking-widest">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="py-28 px-6 bg-brand-900 relative overflow-hidden">
        <Image src={IMAGES.shore} alt="Serenity shore" fill
          className="object-cover object-center opacity-20" sizes="100vw" />
        <div className="absolute inset-0 adinkra-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/95 to-brand-900/70" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="gold-line mb-6" />
            <p className="text-gold-400/70 text-[11px] font-medium tracking-[0.5em] uppercase mb-5">Since 2010</p>
            <h2 className="font-display font-light text-white mb-7 leading-tight"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Born on the<br />
              <em className="text-gold-400 not-italic font-normal">Gold Coast</em>
            </h2>
            <p className="text-white/45 leading-relaxed mb-3 font-light text-[15px]">
              SMIC360 Softwares was built with one conviction: Ghana deserves world-class luxury on its own terms. We honour our heritage in every choice — from kente-woven interiors to farm-to-table Ghanaian cuisine.
            </p>
            <p className="text-white/35 leading-relaxed mb-10 font-light text-[15px]">
              Every room tells a story of the Gold Coast's resilience, creativity, and undeniable elegance.
            </p>
            <Link href="/about"
              className="btn-outline-gold text-[11px] px-8 py-3.5 inline-flex items-center gap-2 tracking-widest">
              Our Story <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative h-44 rounded-2xl overflow-hidden">
              <Image src={CL.amenityBeach} alt="Xain Hotel poolside relaxation" fill
                className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
            </div>
            {[["15+","Years of Legacy"],["80","Luxury Rooms"],["150+","Team Members"],["4.9★","Guest Rating"]].map(([num, label]) => (
              <div key={label} className="glass-card p-7 text-center">
                <p className="text-3xl font-display font-semibold text-gold-400 mb-2"
                   style={{ fontFamily: "var(--font-display)" }}>{num}</p>
                <p className="text-white/35 text-[10px] tracking-[0.3em] uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="py-28 px-6 bg-white overflow-hidden">
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .event-card { animation: float-slow 6s ease-in-out infinite; }
          .event-card:nth-child(2) { animation-delay: 0.5s; }
          .event-card:nth-child(3) { animation-delay: 1s; }
          .event-card:nth-child(4) { animation-delay: 1.5s; }
          .event-card:nth-child(5) { animation-delay: 2s; }
          .event-card:nth-child(6) { animation-delay: 2.5s; }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="gold-line mx-auto mb-6" />
            <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">What's On</p>
            <h2 className="font-display font-light text-brand-900"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Upcoming Events
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTS.map((ev) => (
              <div key={ev.title} className="event-card bg-white border border-gray-200 rounded-2xl p-7 hover:border-gold-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-brand-900 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                    <span className="text-[10px] font-semibold tracking-wider leading-none">{ev.date.split(" ")[0]}</span>
                    <span className="text-lg font-display font-bold leading-none mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{ev.date.split(" ")[1]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-900 text-base">{ev.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} />{ev.time}</span>
                      <span className="flex items-center gap-1"><MapIcon size={11} />{ev.location}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6" />
            <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">Moments Captured</p>
            <h2 className="font-display font-light text-brand-900"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Hotel Gallery
            </h2>
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.alt}
                onClick={() => setLightbox(img.src)}
                className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer group"
              >
                <Image src={img.src} alt={img.alt} width={800} height={img.alt.includes("Rooftop") || img.alt.includes("lobby") ? 600 : 500}
                  className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="gold-line mx-auto mb-6" />
            <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">Guest Stories</p>
            <h2 className="font-display font-light text-brand-900"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Words From Our Guests
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="luxury-card p-8">
                <div className="flex gap-0.5 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-7 font-light italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-sm font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-brand-900 font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.flag} {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100/80">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: Phone,  label: "Call Us",  value: "+233 30 100 0000",   sub: "Available 24 / 7" },
            { icon: Mail,   label: "Email",    value: "info@xainhotel.com", sub: "Reply within 2 hours" },
            { icon: MapPin, label: "Location", value: "Cantonments, Accra", sub: "Greater Accra, Ghana" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100/50">
                <Icon className="text-brand-600" size={20} />
              </div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.25em]">{label}</p>
              <p className="text-gray-800 font-medium text-sm">{value}</p>
              <p className="text-gray-400 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-32 px-6 bg-brand-900 overflow-hidden text-center">
        <Image src={CL.gallery2} alt="Xain Hotel ambiance" fill
          className="object-cover object-center opacity-25" sizes="100vw" />
        <div className="absolute inset-0 adinkra-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-900/85 to-brand-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[120px]" />
        <div className="relative max-w-2xl mx-auto">
          <div className="gold-line mx-auto mb-8" />
          <p className="text-gold-400/70 text-[11px] tracking-[0.5em] uppercase mb-5">Limited Availability</p>
          <h2 className="font-display font-light text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem,5vw,3.8rem)" }}>
            Begin Your<br />
            <em className="text-gold-400 not-italic">Golden Stay</em>
          </h2>
          <p className="text-white/35 mb-12 font-light text-[15px]">Reserve your suite today and experience Ghana at its finest.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-gold text-[11px] px-12 py-4 tracking-widest">
              Reserve a Suite
            </Link>
            <Link href="/contact" className="btn-outline-gold text-[11px] px-12 py-4 tracking-widest">
              Speak to Concierge
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <LightboxModal src={lightbox} alt="Gallery image" onClose={() => setLightbox(null)} />
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-brand-900 text-white/30 py-20 px-6 border-t border-white/5" style={{ background: "#010C05" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded flex items-center justify-center">
                <span className="text-brand-900 font-bold text-xs">S</span>
              </div>
              <div>
                <span className="text-white font-display tracking-[0.3em] text-base font-semibold">SMIC360</span>
                <span className="text-gold-400/50 text-[9px] tracking-[0.35em] block -mt-1 uppercase">Softwares</span>
              </div>
            </div>
            <p className="text-white/25 text-xs leading-relaxed mb-5">
              Redefining luxury hospitality on Ghana's Gold Coast since 2010.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-white/20">All systems operational</span>
            </div>
          </div>
          {[
            { title: "Explore",      links: [["Rooms & Suites","/rooms"],["About Us","/about"],["Dining","/"],["Gallery","/"]] },
            { title: "Reservations", links: [["Book a Room","/booking"],["Check Availability","/booking"],["Group Bookings","/contact"],["Contact Us","/contact"]] },
            { title: "Contact",      links: [["Cantonments, Accra","#"],["info@xainhotel.com","#"],["+233 30 100 0000","#"],["24/7 Front Desk","#"]] },
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
          <div className="flex items-center gap-4 text-white/20">
            <Link href="/login" className="hover:text-white/40 transition-colors">Staff Portal</Link>
            <span>·</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
