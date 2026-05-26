"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble, Wifi, Car, Utensils, Phone, Mail, MapPin,
  Star, ChevronRight, Coffee, Shield, Waves, ArrowRight,
  ChevronLeft, Clock, Flame, Leaf, Wine, UtensilsCrossed,
  Sparkles, Award, Globe, Play, Quote, Check,
} from "lucide-react";
import { IMAGES } from "@/lib/images";

const CL = {
  hero:         "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/serenity-shore-green-getaway-ai-generated_994744-13491_tdi7os.jpg",
  roomClassic:  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/one-king-size-bed-hotel-room_114579-12159_aadqgg.avif",
  roomKente:    "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/modern-studio-apartment-design-with-bedroom-living-space_1262-12375_faldtb.avif",
  roomPresiden: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/pillow-bed_74190-6244_sueu3d.avif",
  amenityPool:  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/sunset-pool_1203-3191_wg2dwy.jpg",
  amenityBeach: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/white-hammocks-with-umbrellas_1203-2073_ir3bys.avif",
  amenityDining:"https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/tropical-hotel-holiday-background-resort_1203-4943_raibay.avif",
  amenityDesk:  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588184/front-desk-staff-managing-guest-checkin_482257-85379_wbx41s.avif",
  lobby:        "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588184/happy-relaxed-african-american-woman-relaxing-hotel-lobby-using-smartphone-watching-online-video-browsing-internet-female-tourist-resting-with-phone-lounge-area-luxury-resort_482257-72500_mgkpqm.avif",
  aerial:       "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/beautiful-aerial-shot-coastal-city-sea_181624-599_fjrnqi.avif",
  umbrella:     "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588184/umbrella-chair_74190-3726_fvynl9.avif",
};

const HERO_SLIDES = [
  { image: CL.hero,         eyebrow: "Cantonments · Accra, Ghana", headline: "XAIN",   sub: "Hotel & Residences",   body: "Where Ghanaian heritage meets world-class luxury.\nEvery detail a testament to the Gold Coast." },
  { image: CL.amenityPool,  eyebrow: "Rooftop Infinity Experience", headline: "ASCEND", sub: "Above the Skyline",    body: "Drift above the Accra skyline in our heated rooftop\ninfinity pool — open from sunrise to sunset." },
  { image: IMAGES.g1,       eyebrow: "Signature Accommodation",     headline: "KENTE",  sub: "Suite Collection",     body: "Kente-woven headboards, premium linens and\npanoramic city views await inside every suite." },
  { image: CL.amenityBeach, eyebrow: "The Xain Experience",         headline: "UNWIND", sub: "In Pure Luxury",       body: "From poolside hammocks to the skybar lounge,\nevery corner is crafted for your comfort." },
  { image: CL.aerial,       eyebrow: "Ghana · West Africa",         headline: "GOLD",   sub: "Coast Living",         body: "Nestled in the heart of the Diplomatic Enclave,\nXain is where Accra's finest come to rest." },
];

const ROOMS = [
  { name: "Classic Room",       price: 250, guests: 2, badge: "Comfort",      image: CL.roomClassic,  desc: "Refined comfort with rich Ghanaian textile accents and all modern amenities." },
  { name: "Deluxe Garden Room", price: 350, guests: 2, badge: "Garden View",  image: CL.amenityPool,  desc: "A serene garden-facing retreat — king bed, private balcony and tropical views." },
  { name: "Executive Room",     price: 420, guests: 3, badge: "Business",     image: CL.umbrella,     desc: "Spacious executive comfort — dedicated workspace and club lounge access." },
  { name: "Kente Suite",        price: 480, guests: 3, badge: "★ Most Loved", image: CL.roomKente,    desc: "Signature suite — kente-woven headboards, premium linens, panoramic views." },
  { name: "Sky Penthouse",      price: 750, guests: 4, badge: "Sky Level",    image: CL.aerial,       desc: "Floor-to-ceiling views, private rooftop terrace and bespoke in-suite dining." },
  { name: "Presidential Suite", price: 950, guests: 6, badge: "Pinnacle",     image: CL.roomPresiden, desc: "An entire floor of opulence — private terrace, personal butler, bespoke dining." },
];

const AMENITIES = [
  { icon: Waves,    title: "Rooftop Infinity Pool",   desc: "Heated with sweeping views across the Accra skyline.",   image: CL.amenityPool },
  { icon: Utensils, title: "Gold Coast Fine Dining",  desc: "Award-winning restaurant fusing Ghanaian heritage with contemporary global cuisine.", image: CL.amenityDining },
  { icon: Coffee,   title: "Skybar & Lobby Lounge",   desc: "Artisanal cocktails, specialty coffee, Ghanaian bites — dawn to midnight.", image: CL.lobby },
  { icon: Shield,   title: "24/7 Personal Concierge", desc: "A dedicated team ready to curate your perfect Accra experience.", image: CL.amenityDesk },
  { icon: Wifi,     title: "1 Gbps Fibre WiFi",       desc: "Seamless high-speed connectivity throughout every corner.", image: null },
  { icon: Car,      title: "Valet & Secure Parking",  desc: "24-hour valet service and climate-controlled underground parking.", image: null },
];

const TESTIMONIALS = [
  { name: "Ama Asante",       flag: "🇬🇭", city: "Accra, Ghana",  rating: 5, text: "Xain is in a class of its own. The Kente Suite is breathtaking — every detail speaks of heritage and luxury. I have stayed at luxury hotels across the world, and this rivals them all." },
  { name: "James Holloway",   flag: "🇬🇧", city: "London, UK",    rating: 5, text: "I have stayed at five-star hotels across four continents. Xain rivals them all — the service is extraordinary, the rooms immaculate. West Africa's finest without question." },
  { name: "Fatima Al-Rashid", flag: "🇦🇪", city: "Dubai, UAE",    rating: 5, text: "An oasis of calm and elegance. The Presidential Suite is the finest I have experienced on the entire African continent. The concierge team went above and beyond." },
];

const RESTAURANT_MENU = [
  { category: "Starters",  items: [
    { name: "Kelewele with Groundnut Dip", price: "GH₵ 85", note: "Ghanaian spiced plantain, house-made peanut sauce" },
    { name: "Grilled King Prawns",          price: "GH₵ 120", note: "Coconut-lime marinade, fresh herb salad" },
    { name: "Avocado & Tilapia Tartare",    price: "GH₵ 95",  note: "Cured tilapia, avocado, citrus dressing" },
  ]},
  { category: "Mains", items: [
    { name: "Gold Coast Jollof",           price: "GH₵ 180", note: "Smoked tomato, free-range chicken, fried plantain" },
    { name: "Surf & Turf Platter",         price: "GH₵ 320", note: "Wagyu beef fillet, whole lobster tail, truffle butter" },
    { name: "Fufu & Goat Soup",            price: "GH₵ 160", note: "Slow-braised kid goat, palm nut broth, fresh herbs" },
  ]},
  { category: "Desserts", items: [
    { name: "Dark Chocolate Fondant",      price: "GH₵ 90",  note: "72% Ghanaian cocoa, vanilla ice cream" },
    { name: "Coconut Panna Cotta",         price: "GH₵ 75",  note: "Passion fruit coulis, toasted coconut" },
    { name: "Plantain Tarte Tatin",        price: "GH₵ 80",  note: "Caramelised plantain, crème fraîche" },
  ]},
];

const EVENTS = [
  { date: "JUN 15", title: "Gold Coast Jazz Night",  time: "7:00 PM", location: "Rooftop Lounge", tag: "Music" },
  { date: "JUN 22", title: "Farm-to-Table Dinner",   time: "6:30 PM", location: "Gold Coast Restaurant", tag: "Dining" },
  { date: "JUL 04", title: "Sunrise Yoga",           time: "6:00 AM", location: "Infinity Pool Deck", tag: "Wellness" },
  { date: "JUL 12", title: "Kente Weaving Workshop", time: "10:00 AM",location: "Cultural Hall", tag: "Culture" },
];

const GALLERY_IMAGES = [
  { src: IMAGES.pool,   alt: "Rooftop pool at sunset",          span: "col-span-2 row-span-2" },
  { src: CL.roomKente,  alt: "Kente Suite interior",            span: "" },
  { src: IMAGES.beach,  alt: "Beachside hammocks",              span: "" },
  { src: CL.lobby,      alt: "Hotel lobby lounge",              span: "" },
  { src: CL.aerial,     alt: "Accra coastline aerial",          span: "" },
  { src: IMAGES.g1,     alt: "Hotel gallery",                   span: "col-span-2" },
];

// ── Hero Slider ──────────────────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setAnim] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const total = HERO_SLIDES.length;

  const goTo = useCallback((idx: number) => {
    if (isAnimating) return;
    setCurrent(idx); setAnim(true);
    setTimeout(() => setAnim(false), 900);
  }, [isAnimating]);

  const next = useCallback(() => goTo((current + 1) % total), [current, goTo, total]);
  const back = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total]);

  useEffect(() => { const t = setTimeout(next, 6500); return () => clearTimeout(t); }, [current, next]);
  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col overflow-hidden bg-[#020C05]">
      {/* Slides */}
      {HERO_SLIDES.map((slide, i) => {
        const active = i === current;
        return (
          <div key={i} className="absolute inset-0" style={{ opacity: active ? 1 : 0, zIndex: active ? 2 : 1, transition: "opacity 1.1s cubic-bezier(0.4,0,0.2,1)" }}>
            <Image src={slide.image} alt={slide.eyebrow} fill priority={i === 0} className="object-cover" sizes="100vw"
              style={{ transform: `translate(${mousePos.x * (active ? 6 : 0)}px,${mousePos.y * (active ? 6 : 0)}px) scale(${active ? 1.06 : 1})`, filter: active ? "brightness(0.75)" : "brightness(0.6)", transition: active ? "transform 8s cubic-bezier(0.25,0.46,0.45,0.94),filter 1.2s ease" : "transform 1s ease,filter 1s ease" }} />
          </div>
        );
      })}

      {/* Overlays */}
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom,rgba(2,12,5,0.4) 0%,rgba(2,12,5,0.1) 30%,rgba(2,12,5,0.15) 60%,rgba(2,12,5,0.85) 100%)" }} />
      <div className="absolute inset-0 z-10 adinkra-pattern opacity-[0.06]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[900px] h-[600px] bg-gold-400/4 rounded-full blur-[200px] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto w-full">
        {HERO_SLIDES.map((slide, i) => {
          const active = i === current;
          return (
            <div key={i} className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none"
              style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: active ? "opacity 0.9s ease 0.25s,transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s" : "opacity 0.4s ease,transform 0.4s ease", pointerEvents: active ? "auto" : "none" }}>
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px w-14 bg-gradient-to-r from-transparent to-gold-400/50" />
                <p className="text-gold-400/80 text-[9px] font-medium tracking-[0.6em] uppercase">{slide.eyebrow}</p>
                <div className="h-px w-14 bg-gradient-to-l from-transparent to-gold-400/50" />
              </div>
              {/* Headline */}
              <h1 className="font-display font-light text-white leading-none mb-5 tracking-tight" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(5.5rem,14vw,11rem)", letterSpacing: "-0.01em" }}>{slide.headline}</h1>
              {/* Sub */}
              <div className="flex items-center gap-5 mb-8">
                <div className="h-px w-20 bg-gold-400/25" />
                <span className="text-gold-400/65 tracking-[0.65em] uppercase text-sm font-light font-display" style={{ fontFamily: "var(--font-display)" }}>{slide.sub}</span>
                <div className="h-px w-20 bg-gold-400/25" />
              </div>
              <p className="text-white/50 text-base max-w-lg mx-auto mb-14 leading-relaxed font-light whitespace-pre-line">{slide.body}</p>
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking" className="xh-btn-gold text-[10px] px-14 py-4 tracking-[0.25em]">Reserve Your Stay</Link>
                <Link href="/rooms" className="xh-btn-outline text-[10px] px-14 py-4 tracking-[0.25em]">Explore Rooms</Link>
              </div>
            </div>
          );
        })}
        {/* Spacer */}
        <div className="invisible pointer-events-none">
          <div className="mb-10 h-5" /><div style={{ fontSize: "clamp(5.5rem,14vw,11rem)" }}>X</div>
          <div className="mb-8 h-5" /><div className="mb-14 h-16" /><div className="h-12" />
        </div>
      </div>

      {/* Arrows */}
      <button onClick={back} aria-label="Previous" className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/50 hover:border-gold-400/40 hover:text-gold-400 transition-all duration-300 hover:scale-110">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} aria-label="Next" className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/50 hover:border-gold-400/40 hover:text-gold-400 transition-all duration-300 hover:scale-110">
        <ArrowRight size={20} />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}>
            <span className="block rounded-full transition-all duration-500" style={{ width: i === current ? "28px" : "5px", height: "5px", background: i === current ? "linear-gradient(90deg,#B8860B,#E8B433)" : "rgba(255,255,255,0.22)", boxShadow: i === current ? "0 0 8px rgba(232,180,51,0.5)" : "none" }} />
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-28 right-10 md:right-16 z-30 hidden md:flex items-center gap-2 text-[11px] font-light">
        <span className="text-gold-400/70 font-medium">{String(current + 1).padStart(2, "0")}</span>
        <span className="text-white/20">/</span>
        <span className="text-white/25">{String(total).padStart(2, "0")}</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[1.5px] bg-white/5">
        <div key={current} className="h-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ animation: "heroProgress 6.5s linear forwards" }} />
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/20">
        <div className="w-4.5 h-8 border border-white/12 rounded-full flex justify-center pt-1.5">
          <div className="w-0.5 h-1.5 bg-gold-400/35 rounded-full animate-bounce" />
        </div>
        <span className="text-[8px] tracking-[0.5em] uppercase">Scroll</span>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { if (!loading && user) router.replace("/dashboard"); }, [user, loading, router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#020C05]">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <HeroSlider />

      {/* ── BOOKING BAR ── */}
      <section className="relative z-20 -mt-1">
        <div className="bg-white shadow-2xl shadow-black/15 border-b border-black/5">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 py-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="label text-[9px] mb-2">Arrival</label>
                <input type="date" className="input text-sm" defaultValue={today} />
              </div>
              <div>
                <label className="label text-[9px] mb-2">Departure</label>
                <input type="date" className="input text-sm" />
              </div>
              <div>
                <label className="label text-[9px] mb-2">Guests</label>
                <select className="input text-sm">
                  {["1 Guest","2 Guests","3 Guests","4 Guests","5+ Guests"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="label text-[9px] mb-2">Room Category</label>
                <select className="input text-sm">
                  {["Any Category","Classic Room","Deluxe Garden","Executive Room","Kente Suite","Sky Penthouse","Presidential Suite"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <Link href="/booking" className="xh-btn-gold text-[10px] py-3.5 text-center tracking-[0.2em] w-full block">
                Check Availability
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AWARD STRIP ── */}
      <section className="bg-[#020C05] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              "Forbes Five Stars 2024",
              "Condé Nast Traveler · Top 10 Africa",
              "TripAdvisor Traveler's Choice",
              "World Luxury Hotel Awards",
              "Rated 4.9 / 5 · 2,400+ Reviews",
            ].map(a => (
              <div key={a} className="flex items-center gap-2 text-white/25 text-[10px] tracking-widest">
                <Star size={9} className="text-gold-400/50 fill-gold-400/50" />
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-28 lg:py-36 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="xh-goldline mb-7" />
            <p className="text-gold-500 text-[10px] font-semibold tracking-[0.45em] uppercase mb-6">The Xain Difference</p>
            <h2 className="font-display font-light text-brand-900 leading-[1.05] mb-8"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem,5vw,3.8rem)" }}>
              West Africa's Most<br />
              <em className="not-italic text-gold-500">Storied Hotel</em>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 font-light text-[15px]">
              Since 2010, Xain Hotel & Residences has reimagined what luxury means on the Gold Coast. Set in the exclusive Cantonments enclave, every room, every plate, every interaction is a celebration of Ghanaian artistry and global excellence.
            </p>
            <p className="text-gray-400 leading-relaxed mb-10 font-light text-[15px]">
              Our 150 dedicated professionals and our guests share one conviction — that the world's finest hospitality has always called Africa home.
            </p>
            <div className="flex flex-wrap gap-8 mb-10">
              {[["15+","Years"], ["80","Rooms"], ["150+","Team"], ["4.9★","Rating"]].map(([n,l]) => (
                <div key={l}>
                  <p className="font-display font-semibold text-brand-800 text-2xl" style={{ fontFamily: "var(--font-display)" }}>{n}</p>
                  <p className="text-[10px] text-gray-400 tracking-[0.25em] uppercase mt-1">{l}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 text-brand-700 text-[11px] font-semibold tracking-widest uppercase hover:text-gold-600 transition-colors group">
              Our Story <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {/* Image mosaic */}
          <div className="grid grid-cols-2 gap-4 h-[520px]">
            <div className="relative rounded-2xl overflow-hidden row-span-2">
              <Image src={CL.lobby} alt="Lobby lounge" fill className="object-cover" sizes="(max-width:1024px) 50vw,400px" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white text-xs font-light tracking-widest">Lobby Lounge</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <Image src={CL.amenityPool} alt="Rooftop pool" fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-3 left-4"><p className="text-white text-[10px] tracking-widest">Rooftop Pool</p></div>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <Image src={CL.amenityDining} alt="Fine dining" fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-3 left-4"><p className="text-white text-[10px] tracking-widest">Gold Coast Dining</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROOMS ── */}
      <section className="py-28 px-6 bg-[#FAFAF8]" id="rooms">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="xh-goldline mx-auto mb-7" />
            <p className="text-gold-500 text-[10px] font-semibold tracking-[0.45em] uppercase mb-5">Accommodation</p>
            <h2 className="font-display font-light text-brand-900" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Rooms & Suites
            </h2>
            <p className="text-gray-400 mt-5 max-w-xl mx-auto text-sm font-light leading-relaxed">
              Six distinct accommodations — from refined comfort to full-floor presidential opulence. Every room a sanctuary.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ROOMS.map((room) => (
              <Link key={room.name} href="/rooms"
                className="group relative bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="relative h-60 overflow-hidden">
                  <Image src={room.image} alt={room.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:768px) 100vw,(max-width:1280px) 50vw,33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 text-[9px] font-bold tracking-[0.15em] uppercase bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full">{room.badge}</span>
                  <div className="absolute bottom-4 left-5">
                    <p className="text-white font-display font-semibold text-xl tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{room.name}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 text-sm leading-relaxed font-light mb-5">{room.desc}</p>
                  <div className="flex items-center gap-4 mb-5 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><BedDouble size={13} className="text-brand-600" /> King Bed</span>
                    <span className="flex items-center gap-1.5"><svg className="w-3 h-3 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Up to {room.guests}</span>
                    <span className="flex items-center gap-1.5"><Wifi size={13} className="text-brand-600" /> 1 Gbps WiFi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 tracking-widest uppercase">From</span>
                      <p className="text-brand-800 font-display font-semibold text-xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>GH₵ {room.price}<span className="text-xs text-gray-400 font-sans font-light">/night</span></p>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-700 group-hover:text-gold-600 transition-colors tracking-widest uppercase">
                      Book <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/rooms" className="xh-btn-outline-dark inline-flex items-center gap-2 text-[10px] px-12 py-4 tracking-[0.2em]">
              View All Rooms & Rates <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FULL WIDTH PHOTO BREAK ── */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image src={CL.amenityBeach} alt="Xain Hotel beachside" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-brand-900/55" />
        <div className="absolute inset-0 adinkra-pattern opacity-[0.08]" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <div className="xh-goldline mx-auto mb-7" />
          <p className="font-display font-light text-white text-3xl md:text-5xl tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
            Where Every Moment is Luxury
          </p>
          <p className="text-white/40 mt-5 text-sm max-w-lg font-light tracking-wide">
            Cantonments, Accra — at the heart of Ghana's Diplomatic Enclave
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/booking" className="xh-btn-gold text-[10px] px-10 py-3.5 tracking-[0.2em]">Reserve Now</Link>
            <Link href="/about" className="xh-btn-outline text-[10px] px-10 py-3.5 tracking-[0.2em]">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section className="py-28 px-6 bg-white" id="amenities">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="xh-goldline mx-auto mb-7" />
            <p className="text-gold-500 text-[10px] font-semibold tracking-[0.45em] uppercase mb-5">Hotel Facilities</p>
            <h2 className="font-display font-light text-brand-900" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Crafted for the Discerning Few
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AMENITIES.map(({ icon: Icon, title, desc, image }) => (
              <div key={title} className="group relative bg-white border border-black/6 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500">
                {image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-600" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                <div className="p-8">
                  <div className="w-12 h-12 bg-brand-50 border border-brand-100/60 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-gold-50 group-hover:to-gold-100 group-hover:border-gold-200 transition-all duration-400">
                    <Icon size={20} className="text-brand-600 group-hover:text-gold-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-brand-900 mb-3 tracking-tight text-base">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESTAURANT ── */}
      <section className="py-28 px-6 bg-[#020C05] relative overflow-hidden" id="restaurant">
        <Image src={CL.amenityDining} alt="Gold Coast Restaurant" fill className="object-cover opacity-12" sizes="100vw" />
        <div className="absolute inset-0 adinkra-pattern opacity-[0.06]" />
        <div className="absolute inset-0 bg-[#020C05]/80" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="xh-goldline mb-7" />
              <p className="text-gold-400/70 text-[10px] font-medium tracking-[0.5em] uppercase mb-6">Gold Coast Fine Dining</p>
              <h2 className="font-display font-light text-white leading-tight mb-8"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
                A Culinary Journey<br /><em className="not-italic text-gold-400/80">Through Ghana</em>
              </h2>
              <p className="text-white/40 text-[15px] leading-relaxed font-light mb-10">
                Executive Chef Claire Fontaine leads a team passionate about celebrating the depth of Ghanaian ingredients — farm-sourced, ocean-fresh, and always extraordinary.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[["Dining","7am – 10pm"],["Bar","6pm – 1am"],["Breakfast","6:30 – 10:30am"]].map(([l,t]) => (
                  <div key={l} className="border border-white/8 rounded-2xl p-4 text-center">
                    <p className="text-white/60 text-xs font-semibold tracking-wide mb-1">{l}</p>
                    <p className="text-white/30 text-[10px]">{t}</p>
                  </div>
                ))}
              </div>
              <Link href="/booking" className="xh-btn-gold text-[10px] px-10 py-3.5 tracking-[0.2em] inline-flex items-center gap-2">
                Reserve a Table <ArrowRight size={13} />
              </Link>
            </div>
            {/* Menu preview */}
            <div className="space-y-6">
              {RESTAURANT_MENU.map(({ category, items }) => (
                <div key={category} className="border border-white/8 rounded-2xl overflow-hidden">
                  <div className="px-6 py-3.5 bg-white/4 border-b border-white/6">
                    <p className="text-gold-400/70 text-[10px] font-bold tracking-[0.3em] uppercase">{category}</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {items.map(item => (
                      <div key={item.name} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-white/3 transition-colors">
                        <div>
                          <p className="text-white/70 text-sm font-medium mb-0.5">{item.name}</p>
                          <p className="text-white/25 text-[11px] font-light">{item.note}</p>
                        </div>
                        <span className="text-gold-400/70 text-sm font-semibold whitespace-nowrap flex-shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-28 px-6 bg-[#FAFAF8]" id="gallery">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="xh-goldline mx-auto mb-7" />
            <p className="text-gold-500 text-[10px] font-semibold tracking-[0.45em] uppercase mb-5">Visual Journey</p>
            <h2 className="font-display font-light text-brand-900" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: IMAGES.pool,   alt: "Rooftop pool",       cls: "col-span-2 row-span-2" },
              { src: CL.roomKente,  alt: "Kente Suite",        cls: "" },
              { src: IMAGES.beach,  alt: "Beachside",          cls: "" },
              { src: CL.lobby,      alt: "Lobby lounge",       cls: "" },
              { src: CL.aerial,     alt: "Accra aerial",       cls: "" },
              { src: CL.amenityDining, alt: "Fine dining",     cls: "col-span-2" },
            ].map(({ src, alt, cls }) => (
              <div key={alt} className={`relative overflow-hidden rounded-2xl group ${cls}`} style={{ height: cls.includes("row-span-2") ? "480px" : cls.includes("col-span-2") ? "200px" : "232px" }}>
                <Image src={src} alt={alt} fill className="object-cover group-hover:scale-105 transition-transform duration-600" sizes="25vw" />
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/25 transition-all duration-400" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <p className="text-white text-xs font-light tracking-widest">{alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="xh-goldline mx-auto mb-7" />
            <p className="text-gold-500 text-[10px] font-semibold tracking-[0.45em] uppercase mb-5">What's On</p>
            <h2 className="font-display font-light text-brand-900" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Upcoming Events
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {EVENTS.map(({ date, title, time, location, tag }) => (
              <div key={title} className="group border border-black/6 rounded-3xl p-7 bg-white hover:shadow-lg hover:border-gold-200/60 hover:-translate-y-1 transition-all duration-400">
                <div className="flex items-start justify-between mb-5">
                  <div className="bg-brand-900 text-white px-3 py-2 rounded-xl text-center min-w-[52px]">
                    <p className="text-gold-400/80 text-[9px] tracking-widest uppercase font-semibold">{date.split(" ")[0]}</p>
                    <p className="text-white font-display text-xl font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>{date.split(" ")[1]}</p>
                  </div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-gold-600 bg-gold-50 border border-gold-100 px-2.5 py-1 rounded-full">{tag}</span>
                </div>
                <h3 className="font-semibold text-brand-900 mb-3 text-base tracking-tight">{title}</h3>
                <div className="flex flex-col gap-1.5 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5"><Clock size={11} /> {time}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={11} /> {location}</span>
                </div>
                <div className="mt-6 pt-5 border-t border-gray-50">
                  <Link href="/contact" className="text-[10px] font-bold text-brand-700 group-hover:text-gold-600 transition-colors tracking-widest uppercase flex items-center gap-1.5">
                    Reserve Seat <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="xh-goldline mx-auto mb-7" />
            <p className="text-gold-500 text-[10px] font-semibold tracking-[0.45em] uppercase mb-5">Guest Stories</p>
            <h2 className="font-display font-light text-brand-900" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              What Our Guests Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {TESTIMONIALS.map(({ name, flag, city, rating, text }) => (
              <div key={name} className="bg-white border border-black/5 rounded-3xl p-9 shadow-sm hover:shadow-md transition-shadow relative">
                <Quote className="absolute top-7 right-7 text-gold-100" size={32} />
                <div className="flex gap-0.5 mb-6">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-light mb-8 italic">"{text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-display font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-900 text-sm">{name} <span className="text-base">{flag}</span></p>
                    <p className="text-gray-400 text-[11px] font-light">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-32 px-6 bg-brand-900 overflow-hidden text-center">
        <Image src={CL.amenityPool} alt="Xain Hotel" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 adinkra-pattern opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-900/50 to-brand-900/80" />
        <div className="relative max-w-2xl mx-auto">
          <div className="xh-goldline mx-auto mb-8" />
          <p className="text-gold-400/70 text-[10px] font-medium tracking-[0.5em] uppercase mb-7">Your Next Chapter Awaits</p>
          <h2 className="font-display font-light text-white leading-tight mb-7"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>
            Begin Your Stay<br />at Xain Hotel
          </h2>
          <p className="text-white/40 text-[15px] mb-12 font-light leading-relaxed">
            Best rate guaranteed when you book direct. Complimentary airport transfer for stays of 3 nights or more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/booking" className="xh-btn-gold text-[10px] px-14 py-4 tracking-[0.25em] inline-flex items-center gap-2">
              Book Direct — Best Rate <ArrowRight size={13} />
            </Link>
            <Link href="/contact" className="xh-btn-outline text-[10px] px-14 py-4 tracking-[0.25em]">
              Talk to Concierge
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/25 text-[10px] tracking-widest">
            {["Free Cancellation","Complimentary Breakfast on Select Rates","Best Rate Guarantee","Airport Transfer Available"].map(p => (
              <span key={p} className="flex items-center gap-1.5"><Check size={10} className="text-gold-400/50" />{p}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
