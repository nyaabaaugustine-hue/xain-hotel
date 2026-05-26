"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import {
  CheckCircle, BedDouble, User, Calendar, CreditCard,
  ChevronRight, Loader2, ArrowRight, ArrowLeft,
} from "lucide-react";
import { IMAGES } from "@/lib/images";

// ── Config ──────────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "meedzngr";

// Fallback rooms for production when the API is offline
const FALLBACK_ROOMS = [
  { id: 1, roomNo: "101", status: "available", floorId: 1, description: "Refined comfort with rich Ghanaian textile accents.", roomType: { name: "Classic Room",       pricePerNight: 250, maxGuests: 2 } },
  { id: 2, roomNo: "201", status: "available", floorId: 2, description: "Kente-woven headboards, premium linens, panoramic city views.", roomType: { name: "Kente Suite",         pricePerNight: 480, maxGuests: 3 } },
  { id: 3, roomNo: "301", status: "available", floorId: 3, description: "Private terrace, personal butler, bespoke dining.", roomType: { name: "Presidential Suite", pricePerNight: 950, maxGuests: 6 } },
  { id: 4, roomNo: "102", status: "available", floorId: 1, description: "Spacious executive quarters with dedicated workspace.", roomType: { name: "Executive Room",     pricePerNight: 320, maxGuests: 2 } },
  { id: 5, roomNo: "202", status: "available", floorId: 2, description: "Private balcony overlooking the Accra skyline at dusk.", roomType: { name: "Sunset Suite",       pricePerNight: 580, maxGuests: 2 } },
  { id: 6, roomNo: "103", status: "available", floorId: 1, description: "Interconnected rooms ideal for families.", roomType: { name: "Family Suite",       pricePerNight: 420, maxGuests: 5 } },
];

const ROOM_ACCENTS: Record<string, string> = {
  "Classic Room":        "from-[#0A3520] to-[#1A6040]",
  "Kente Suite":         "from-[#1A0C05] to-[#3D1C0A]",
  "Presidential Suite":  "from-[#0D1A0A] to-[#1E3A14]",
  "Executive Room":      "from-[#0A1A30] to-[#153860]",
  "Sunset Suite":        "from-[#2A0A08] to-[#5E2016]",
  "Family Suite":        "from-[#151530] to-[#282870]",
};

function today()    { return new Date().toISOString().split("T")[0]; }
function tomorrow() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; }

// ── Main Booking Form ────────────────────────────────────────────────────────
function BookingForm() {
  const params = useSearchParams();
  const [rooms, setRooms]         = useState<any[]>([]);
  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const [form, setForm] = useState({
    checkIn:       params.get("checkIn")  || today(),
    checkOut:      params.get("checkOut") || tomorrow(),
    adults:        "2",
    children:      "0",
    roomId:        params.get("roomId")   || "",
    name:          "",
    email:         "",
    phone:         "",
    paymentMethod: "cash",
    notes:         "",
  });

  // Persist form data to prevent disappearing during re-renders
  useEffect(() => {
    if (form.checkIn && form.checkOut && form.name && form.email) {
      // Save to sessionStorage to persist across refreshes
      try {
        sessionStorage.setItem('bookingFormData', JSON.stringify(form));
      } catch (e) {
        console.warn('Failed to save form data:', e);
      }
    }
  }, [form]);

  // Restore form data on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('bookingFormData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setForm(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.warn('Failed to restore form data:', e);
    }
  }, []);

  useEffect(() => {
    fetch(`${API}/public/rooms`)
      .then(r => r.json())
      .then(d => setRooms(Array.isArray(d.data) ? d.data : []))
      .catch(() => setRooms(FALLBACK_ROOMS));
  }, []);

  const displayRooms   = rooms.length > 0 ? rooms : FALLBACK_ROOMS;
  const selectedRoom   = displayRooms.find(r => String(r.id) === String(form.roomId));
  const nights         = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;
  const pricePerNight  = selectedRoom?.roomType?.pricePerNight || 0;
  const total          = nights * pricePerNight;

  function setField(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    setLoading(true); setError("");
    const ref = "XAIN-" + Math.random().toString(36).substr(2, 8).toUpperCase();

    // 1. Try the hotel API first
    try {
      const res = await fetch(`${API}/public/booking`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:          form.name,
          email:         form.email,
          phone:         form.phone,
          roomId:        +form.roomId,
          checkIn:       form.checkIn,
          checkOut:      form.checkOut,
          adults:        +form.adults,
          children:      +form.children,
          totalAmount:   total,
          paymentMethod: form.paymentMethod,
          notes:         form.notes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookingRef(data.data?.bookingNo || ref);
        setSubmitted(true);
        setLoading(false);
        return;
      }
    } catch { /* fallthrough to Formspree */ }

    // 2. Fallback: send via Formspree so the hotel still receives the request
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method:  "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body:    JSON.stringify({
            name:          form.name,
            email:         form.email,
            phone:         form.phone,
            room:          selectedRoom?.roomType?.name || form.roomId,
            roomNumber:    selectedRoom?.roomNo,
            checkIn:       form.checkIn,
            checkOut:      form.checkOut,
            nights,
            adults:        form.adults,
            children:      form.children,
            totalAmount:   `GH₵${total.toLocaleString()}`,
            paymentMethod: form.paymentMethod,
            notes:         form.notes,
            bookingRef:    ref,
            _subject:      `New Booking Request – ${form.name} (${ref})`,
          }),
        });
        if (!res.ok) throw new Error("Formspree error");
      } catch {
        setError("Booking service temporarily unavailable. Please call us on +233 30 100 0000.");
        setLoading(false);
        return;
      }

    setBookingRef(ref);
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
          <CheckCircle className="text-emerald-500" size={44} />
        </div>
        <div className="gold-line mx-auto mb-6" />
        <h2 className="font-display font-light text-brand-900 mb-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
          Booking Confirmed!
        </h2>
        <p className="text-gray-400 mb-3 font-light">Your reservation reference is:</p>
        <p className="text-2xl font-mono font-bold text-brand-600 mb-2 tracking-widest">{bookingRef}</p>
        <p className="text-gray-400 text-xs mb-10 max-w-sm leading-relaxed font-light">
          A confirmation will be sent to <strong className="text-gray-600">{form.email}</strong>. Our concierge team will be in touch shortly. We look forward to welcoming you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-outline-gold text-[11px] px-8 py-3 tracking-widest">
            Back to Home
          </Link>
          <Link href="/rooms" className="btn-gold text-[11px] px-8 py-3 tracking-widest">
            Browse More Rooms
          </Link>
        </div>
      </div>
    );
  }

  const STEPS = ["Stay Details", "Your Info", "Confirm"];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-14">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > i + 1
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : step === i + 1
                  ? "bg-brand-900 text-gold-400 shadow-lg shadow-brand-900/20 ring-2 ring-gold-400/20"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-[11px] font-medium tracking-widest uppercase hidden sm:block ${
                step === i + 1 ? "text-brand-800" : "text-gray-400"
              }`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-2 ${step > i + 1 ? "bg-emerald-300" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main form panel ── */}
        <div className="lg:col-span-2">

          {/* STEP 1 – Stay Details */}
          {step === 1 && (
            <div className="luxury-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100/50">
                  <Calendar className="text-brand-600" size={20} />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-brand-900 text-xl"
                      style={{ fontFamily: "var(--font-display)" }}>Stay Details</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Choose your dates and room</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Check In</label>
                  <input type="date" value={form.checkIn} min={today()}
                    onChange={e => setField("checkIn", e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Check Out</label>
                  <input type="date" value={form.checkOut} min={form.checkIn || today()}
                    onChange={e => setField("checkOut", e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Adults</label>
                  <select value={form.adults} onChange={e => setField("adults", e.target.value)} className="input">
                    {[1,2,3,4].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Children</label>
                  <select value={form.children} onChange={e => setField("children", e.target.value)} className="input">
                    {[0,1,2,3].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <label className="label mt-2">Select Room</label>
              {displayRooms.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">
                  <Loader2 size={20} className="animate-spin mx-auto mb-2 text-gold-400" />
                  Loading available rooms…
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                  {displayRooms.filter(r => r.status === "available").map(r => {
                    const price = r.roomType?.pricePerNight || r.roomType?.price;
                    return (
                      <div key={r.id} onClick={() => setField("roomId", String(r.id))}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          String(form.roomId) === String(r.id)
                            ? "border-gold-400 bg-gold-50 shadow-md shadow-gold-400/10"
                            : "border-gray-100 hover:border-brand-200 hover:bg-brand-50/30"
                        }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ROOM_ACCENTS[r.roomType?.name] || "from-brand-800 to-brand-600"} flex items-center justify-center`}>
                            <BedDouble size={16} className="text-white/60" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-800">{r.roomType?.name} – Room {r.roomNo}</p>
                            <p className="text-xs text-gray-400 font-light">{r.description || "Comfortable & stylish"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-brand-700 font-bold text-sm">GH₵{price?.toLocaleString() || "—"}</p>
                          <p className="text-gray-400 text-[10px]">/night</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button onClick={() => setStep(2)} disabled={!form.roomId || nights === 0}
                className="mt-7 w-full btn-gold py-3.5 tracking-widest text-[11px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                Continue to Guest Info <ArrowRight size={14} />
              </button>
              {(!form.roomId || nights === 0) && (
                <p className="text-center text-[11px] text-gray-400 mt-2">
                  {!form.roomId ? "Please select a room to continue" : "Please select valid check-in and check-out dates"}
                </p>
              )}
            </div>
          )}

          {/* STEP 2 – Guest Info */}
          {step === 2 && (
            <div className="luxury-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100/50">
                  <User className="text-brand-600" size={20} />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-brand-900 text-xl"
                      style={{ fontFamily: "var(--font-display)" }}>Your Information</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Your details are kept private and secure</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Full Name <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Kwame Mensah" value={form.name}
                    onChange={e => setField("name", e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Email Address <span className="text-red-400">*</span></label>
                  <input type="email" placeholder="kwame@example.com" value={form.email}
                    onChange={e => setField("email", e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" placeholder="+233 24 000 0000" value={form.phone}
                    onChange={e => setField("phone", e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Special Requests</label>
                  <textarea rows={3} placeholder="Any preferences, dietary needs, or special occasions…"
                    value={form.notes} onChange={e => setField("notes", e.target.value)}
                    className="input resize-none" />
                </div>
              </div>

              <div className="flex gap-3 mt-7">
                <button onClick={() => setStep(1)}
                  className="flex-1 btn-secondary py-3.5 text-sm flex items-center justify-center gap-2">
                  <ArrowLeft size={14} /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!form.name || !form.email}
                  className="flex-1 btn-gold py-3.5 tracking-widest text-[11px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  Review Booking <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 – Confirm */}
          {step === 3 && (
            <div className="luxury-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100/50">
                  <CreditCard className="text-brand-600" size={20} />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-brand-900 text-xl"
                      style={{ fontFamily: "var(--font-display)" }}>Review & Confirm</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Check your details before confirming</p>
                </div>
              </div>

              <div className="bg-cream rounded-2xl p-5 mb-6 space-y-3 text-sm border border-gold-100">
                {[
                  ["Guest",      form.name],
                  ["Email",      form.email],
                  ["Phone",      form.phone || "—"],
                  ["Room",       `${selectedRoom?.roomType?.name} · Room #${selectedRoom?.roomNo}`],
                  ["Check In",   form.checkIn],
                  ["Check Out",  form.checkOut],
                  ["Duration",   `${nights} night${nights !== 1 ? "s" : ""}`],
                  ["Guests",     `${form.adults} adult${+form.adults !== 1 ? "s" : ""}, ${form.children} child${+form.children !== 1 ? "ren" : ""}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-400 font-light">{k}</span>
                    <span className="font-medium text-gray-800 text-right">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gold-200/50 pt-3 mt-3">
                  <span className="text-gray-600 font-semibold">Total</span>
                  <span className="font-bold text-brand-700 text-base">GH₵{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[["cash","Cash"],["card","Card"],["transfer","Transfer"]].map(([m, label]) => (
                    <button key={m} onClick={() => setField("paymentMethod", m)}
                      className={`py-3 text-sm font-medium border-2 transition-all duration-200 ${
                        form.paymentMethod === m
                          ? "border-gold-400 bg-gold-50 text-brand-800 shadow-md shadow-gold-400/10"
                          : "border-gray-200 text-gray-500 hover:border-brand-200"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-2 font-light">
                  Payment will be processed at the hotel. We accept cash, card, and mobile money.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-light">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className="flex-1 btn-secondary py-3.5 text-sm flex items-center justify-center gap-2">
                  <ArrowLeft size={14} /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 btn-gold py-3.5 tracking-widest text-[11px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading
                    ? <><Loader2 size={14} className="animate-spin" /> Processing…</>
                    : <><CheckCircle size={14} /> Confirm · GH₵{total.toLocaleString()}</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Summary sidebar ── */}
        <div className="lg:col-span-1">
          <div className="luxury-card sticky top-28 overflow-hidden">
            <div className={`h-40 relative overflow-hidden ${!selectedRoom ? "bg-gradient-to-br from-brand-900 to-brand-700" : ""}`}>
              {selectedRoom ? (
                <>
                  <NextImage
                    src={IMAGES.g2}
                    alt="Room preview"
                    fill
                    className="object-cover object-center"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 adinkra-pattern opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </>
              )}
              <BedDouble className="absolute bottom-4 right-4 text-white/10" size={56} />
              {selectedRoom && (
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-display text-lg font-semibold"
                     style={{ fontFamily: "var(--font-display)" }}>{selectedRoom.roomType?.name}</p>
                  <p className="text-white/50 text-[10px] tracking-widest">Room #{selectedRoom.roomNo}</p>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Booking Summary</h3>
              {selectedRoom ? (
                <div className="space-y-2.5 text-sm">
                  {[
                    ["Room",     `${selectedRoom.roomType?.name} #${selectedRoom.roomNo}`],
                    ["Check In", form.checkIn || "—"],
                    ["Check Out",form.checkOut || "—"],
                    ["Nights",   nights || "—"],
                    ["Guests",   `${form.adults}A · ${form.children}C`],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between text-gray-500">
                      <span>{k}</span>
                      <span className="font-medium text-gray-700 text-right">{v}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-brand-700 text-lg">GH₵{total.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-light pt-1">
                    GH₵{pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <BedDouble size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="font-light">Select a room to see your summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <section className="relative pt-36 pb-20 px-6 bg-brand-900 overflow-hidden text-center">
        <NextImage
          src={IMAGES.resort}
          alt="Tropical hotel resort background"
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 adinkra-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-brand-900/55 to-brand-900" />
        <div className="relative">
          <div className="gold-line mx-auto mb-6" />
          <p className="text-gold-400/70 text-[11px] font-medium tracking-[0.5em] uppercase mb-5">Reservations</p>
          <h1 className="font-display font-light text-white mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,4.5rem)" }}>
            Book Your Stay
          </h1>
          <p className="text-white/40 text-base max-w-lg mx-auto font-light">
            Reserve your room in just three easy steps. We&apos;ll take care of the rest.
          </p>
        </div>
      </section>

      <div className="relative bg-cream min-h-screen py-4 overflow-hidden">
        <NextImage
          src={IMAGES.beach}
          alt="Relaxing hammocks background"
          fill
          className="object-cover object-center opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-cream/85" />
        <Suspense fallback={
          <div className="text-center py-24 text-gray-400">
            <Loader2 size={24} className="animate-spin mx-auto mb-3 text-gold-400" />
            <p className="text-sm font-light">Loading booking form…</p>
          </div>
        }>
          <BookingForm />
        </Suspense>
        </div>
    </>
  );
}
