"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Users, Wifi, Wind, Tv, Coffee, ChevronRight, Search, ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/images";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const AMENITY_ICONS  = [Wifi, Wind, Tv, Coffee];
const AMENITY_LABELS = ["Free WiFi", "Air Con", "Smart TV", "Coffee Maker"];

// Cloudinary images mapped by room type name
const ROOM_IMAGES: Record<string, string> = {
  "Classic Room":       "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/one-king-size-bed-hotel-room_114579-12159_aadqgg.avif",
  "Kente Suite":        "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/modern-studio-apartment-design-with-bedroom-living-space_1262-12375_faldtb.avif",
  "Presidential Suite": "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/pillow-bed_74190-6244_sueu3d.avif",
  "Executive Room":     "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/tropical-hotel-holiday-background-resort_1203-4943_raibay.avif",
  "Sunset Suite":       "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/sunset-pool_1203-3191_wg2dwy.jpg",
  "Family Suite":       "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588186/g_mzqus0.avif",
};
const DEFAULT_ROOM_IMAGE = "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588186/e_rc4ztd.avif";

// Fallback rooms if API is offline
const FALLBACK_ROOMS = [
  { id: 1, roomNo: "101", status: "available", floorId: 1, description: "Refined comfort with rich Ghanaian textile accents and modern amenities.", roomType: { name: "Classic Room",        pricePerNight: 250, maxGuests: 2 } },
  { id: 2, roomNo: "201", status: "available", floorId: 2, description: "Our signature suite — kente-woven headboards, premium linens, panoramic city views.", roomType: { name: "Kente Suite",          pricePerNight: 480, maxGuests: 3 } },
  { id: 3, roomNo: "301", status: "available", floorId: 3, description: "An entire floor of opulence — private terrace, personal butler, bespoke dining.", roomType: { name: "Presidential Suite",  pricePerNight: 950, maxGuests: 6 } },
  { id: 4, roomNo: "102", status: "available", floorId: 1, description: "Spacious executive quarters with a dedicated workspace and garden views.", roomType: { name: "Executive Room",      pricePerNight: 320, maxGuests: 2 } },
  { id: 5, roomNo: "202", status: "available", floorId: 2, description: "Romantic suite with a private balcony overlooking the Accra skyline at dusk.", roomType: { name: "Sunset Suite",         pricePerNight: 580, maxGuests: 2 } },
  { id: 6, roomNo: "103", status: "available", floorId: 1, description: "Interconnected rooms ideal for families — warm décor and separate lounge.", roomType: { name: "Family Suite",         pricePerNight: 420, maxGuests: 5 } },
];

const ROOM_GRADIENTS: Record<string, string> = {
  "Classic Room":        "from-[#0A3520] via-[#0F5530] to-[#1A6040]",
  "Kente Suite":         "from-[#1A0C05] via-[#2E1508] to-[#3D1C0A]",
  "Presidential Suite":  "from-[#0D1A0A] via-[#142810] to-[#1E3A14]",
  "Executive Room":      "from-[#0A1A30] via-[#0F2A4A] to-[#153860]",
  "Sunset Suite":        "from-[#2A0A08] via-[#4A1510] to-[#5E2016]",
  "Family Suite":        "from-[#151530] via-[#202050] to-[#282870]",
};
const defaultGrad = "from-[#0A3520] via-[#0F5530] to-[#1A6040]";

const STATUS_BADGE: Record<string, string> = {
  available:   "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  occupied:    "bg-red-500/15 text-red-300 border border-red-500/20",
  maintenance: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
};

export default function RoomsPage() {
  const [rooms, setRooms]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetch(`${API}/public/rooms`)
      .then(r => r.json())
      .then(d => setRooms(Array.isArray(d.data) ? d.data : []))
      .catch(() => setRooms(FALLBACK_ROOMS))
      .finally(() => setLoading(false));
  }, []);

  const displayRooms = rooms.length > 0 ? rooms : FALLBACK_ROOMS;
  const types = ["all", ...Array.from(new Set(displayRooms.map(r => r.roomType?.name).filter(Boolean))) as string[]];

  const filtered = displayRooms.filter(r => {
    const matchSearch = !search ||
      r.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
      r.roomType?.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || r.roomType?.name === filterType;
    return matchSearch && matchType;
  });

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-6 bg-brand-900 overflow-hidden text-center">
        <Image
          src={IMAGES.g1}
          alt="Xain Hotel rooms and suites"
          fill
          priority
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 adinkra-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-brand-900/60 to-brand-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-400/5 rounded-full blur-[120px]" />
        <div className="relative">
          <div className="gold-line mx-auto mb-6" />
          <p className="text-gold-400/70 text-[11px] font-medium tracking-[0.5em] uppercase mb-5">Accommodations</p>
          <h1 className="font-display font-light text-white mb-5"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem,7vw,5.5rem)" }}>
            Rooms & Suites
          </h1>
          <p className="text-white/40 text-base max-w-xl mx-auto font-light leading-relaxed">
            Every room is a sanctuary of heritage and refinement. Choose the space that suits your journey.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search rooms…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 text-[11px] font-medium tracking-widest uppercase transition-all duration-200 ${
                  filterType === t
                    ? "bg-brand-900 text-gold-400 shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-brand-50 hover:text-brand-700"
                }`}>
                {t === "all" ? "All Rooms" : t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROOMS GRID ── */}
      <section className="py-20 px-6 bg-cream min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-7 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <BedDouble size={48} className="text-gray-200 mx-auto mb-5" />
              <p className="text-gray-400 text-lg font-light">No rooms found</p>
              <p className="text-gray-300 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map(room => {
                const gradKey  = room.roomType?.name as string;
                const grad     = ROOM_GRADIENTS[gradKey] || defaultGrad;
                const price    = room.roomType?.pricePerNight || room.roomType?.price;
                const imgSrc   = ROOM_IMAGES[gradKey] || DEFAULT_ROOM_IMAGE;
                return (
                  <div key={room.id} className="luxury-card group">
                    <div className={`h-56 bg-gradient-to-br ${grad} relative overflow-hidden`}>
                      <Image
                        src={imgSrc}
                        alt={room.roomType?.name || "Hotel Room"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 adinkra-pattern opacity-20" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <BedDouble className="absolute bottom-4 right-4 text-white/8 group-hover:text-white/15 transition-colors duration-500" size={80} />

                      <div className="absolute top-4 left-4 flex gap-2 items-center">
                        <span className="bg-brand-900/60 text-white/80 text-[10px] font-mono px-2.5 py-1 border border-white/10 backdrop-blur-sm">
                          #{room.roomNo}
                        </span>
                        {room.status && (
                          <span className={`text-[10px] font-medium px-2.5 py-1 capitalize backdrop-blur-sm ${STATUS_BADGE[room.status] || "bg-gray-500/15 text-gray-300"}`}>
                            {room.status}
                          </span>
                        )}
                      </div>

                      {room.roomType?.name && (
                        <span className="absolute top-4 right-4 bg-gold-400 text-brand-900 text-[10px] font-semibold px-3 py-1.5 tracking-widest uppercase">
                          {room.roomType.name}
                        </span>
                      )}

                      <div className="absolute bottom-5 left-5">
                        {price ? (
                          <>
                            <p className="text-2xl font-display text-white font-semibold"
                               style={{ fontFamily: "var(--font-display)" }}>
                              GH₵{price.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase">per night</p>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="p-7">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display font-semibold text-brand-900 text-xl"
                              style={{ fontFamily: "var(--font-display)" }}>
                            {room.roomType?.name || "Standard Room"}
                          </h3>
                          <p className="text-gray-400 text-[11px] mt-0.5 tracking-wide">
                            Floor {room.floorId || 1} · Room {room.roomNo}
                          </p>
                        </div>
                      </div>

                      {room.description && (
                        <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2 font-light">
                          {room.description}
                        </p>
                      )}

                      <div className="flex gap-2 mb-6">
                        {AMENITY_ICONS.map((Icon, i) => (
                          <div key={i} title={AMENITY_LABELS[i]}
                            className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center border border-brand-100/50">
                            <Icon size={13} className="text-brand-600" />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <Users size={12} />
                          <span>Up to {room.roomType?.maxGuests || 2} guests</span>
                        </div>
                        <Link
                          href={`/booking?roomId=${room.id}&type=${encodeURIComponent(room.roomType?.name || "")}`}
                          className="btn-gold text-[10px] px-5 py-2 tracking-widest inline-flex items-center gap-1.5">
                          Book Now <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 px-6 bg-brand-900 overflow-hidden text-center">
        <Image
          src={IMAGES.beach}
          alt="Xain Hotel relaxation"
          fill
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 adinkra-pattern opacity-40" />
        <div className="absolute inset-0 bg-brand-900/75" />
        <div className="relative">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display font-light text-white mb-3"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
            Can't find what you're looking for?
          </h2>
          <p className="text-white/40 mb-8 text-sm font-light">Our concierge team is delighted to help you find the perfect room.</p>
          <Link href="/contact"
            className="btn-gold text-[11px] px-10 py-3.5 tracking-widest inline-flex items-center gap-2">
            Contact Concierge <ChevronRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
