"use client";
import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2, MessageSquare, Instagram, Facebook, Twitter } from "lucide-react";
import { IMAGES } from "@/lib/images";

// Formspree form ID — set in .env.local as NEXT_PUBLIC_FORMSPREE_ID
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "meedzngr";

const INFO = [
  {
    icon:   Phone,
    label:  "Call Us",
    lines:  ["+233 30 100 0000", "+233 24 100 0001"],
    sub:    "Available 24 / 7",
    color:  "from-brand-700 to-brand-900",
  },
  {
    icon:   Mail,
    label:  "Email",
    lines:  ["info@xainhotel.com", "bookings@xainhotel.com"],
    sub:    "Reply within 2 hours",
    color:  "from-[#1A0C05] to-[#3D1C0A]",
  },
  {
    icon:   MapPin,
    label:  "Location",
    lines:  ["Cantonments, Accra", "Greater Accra Region, Ghana"],
    sub:    "Near the Diplomatic Enclave",
    color:  "from-[#0A1A30] to-[#153860]",
  },
  {
    icon:   Clock,
    label:  "Front Desk",
    lines:  ["Open 24 hours", "7 days a week"],
    sub:    "Concierge always available",
    color:  "from-[#151530] to-[#282870]",
  },
];

const SUBJECTS = [
  "Reservation Enquiry",
  "Group / Event Booking",
  "Special Occasion",
  "Feedback",
  "General Enquiry",
  "Other",
];

export default function ContactPage() {
  const [form, setForm]         = useState({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  function setField(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true); setError("");

    // Send via Formspree
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify({
          name:     form.name,
          email:    form.email,
          phone:    form.phone,
          subject:  form.subject,
          message:  form.message,
          _subject: `Contact Form – ${form.subject} – ${form.name}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Formspree returned an error");
      setSent(true);
    } catch {
      setError("Message could not be sent. Please email us directly at info@xainhotel.com");
    }
    setLoading(false);
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-6 bg-brand-900 overflow-hidden text-center">
        <Image
          src={IMAGES.desk}
          alt="SMIC360 front desk team"
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 adinkra-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-brand-900/55 to-brand-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-400/5 rounded-full blur-[120px]" />
        <div className="relative">
          <div className="gold-line mx-auto mb-6" />
          <p className="text-gold-400/70 text-[11px] font-medium tracking-[0.5em] uppercase mb-5">Get In Touch</p>
          <h1 className="font-display font-light text-white mb-5"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem,7vw,5.5rem)" }}>
            Contact Us
          </h1>
          <p className="text-white/40 text-base max-w-xl mx-auto font-light leading-relaxed">
            Have a question, a special request, or simply want to say hello?
            Our team is always delighted to hear from you.
          </p>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {INFO.map(({ icon: Icon, label, lines, sub, color }) => (
            <div key={label} className="luxury-card group">
              <div className={`h-20 bg-gradient-to-br ${color} relative flex items-center justify-center`}>
                <div className="absolute inset-0 adinkra-pattern opacity-40" />
                <Icon className="relative text-white/70 group-hover:text-white transition-colors" size={22} />
              </div>
              <div className="p-5 text-center">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.25em] mb-2">{label}</p>
                {lines.map(l => (
                  <p key={l} className="text-gray-700 text-sm font-medium leading-snug">{l}</p>
                ))}
                <p className="text-gray-400 text-[11px] mt-1.5 font-light">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM + MAP ── */}
      <section className="relative py-16 px-6 overflow-hidden">
        <Image
          src={IMAGES.shore}
          alt="Serenity shore background"
          fill
          className="object-cover object-center opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-cream/90" />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div>
            {sent ? (
              <div className="luxury-card p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-full flex items-center justify-center mb-7 border border-emerald-500/20">
                  <CheckCircle className="text-emerald-500" size={38} />
                </div>
                <div className="gold-line mx-auto mb-5" />
                <h2 className="font-display font-light text-brand-900 mb-3"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>
                  Message Sent!
                </h2>
                <p className="text-gray-400 text-sm font-light mb-8 max-w-xs leading-relaxed">
                  Thank you for reaching out, <strong className="text-gray-600">{form.name}</strong>. Our team will get back to you at <strong className="text-gray-600">{form.email}</strong> within 2 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name:"", email:"", phone:"", subject: SUBJECTS[0], message:"" }); }}
                  className="btn-outline-gold text-[11px] px-8 py-3 tracking-widest border border-brand-400/30 text-brand-700 hover:bg-brand-50">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="luxury-card p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-11 h-11 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100/50">
                    <MessageSquare className="text-brand-600" size={20} />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-brand-900 text-xl"
                        style={{ fontFamily: "var(--font-display)" }}>Send Us a Message</h2>
                    <p className="text-gray-400 text-xs mt-0.5">We&apos;ll respond within 2 hours</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="label">Your Name <span className="text-red-400">*</span></label>
                    <input type="text" placeholder="Kwame Mensah" value={form.name}
                      onChange={e => setField("name", e.target.value)} className="input" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="label">Email Address <span className="text-red-400">*</span></label>
                    <input type="email" placeholder="kwame@example.com" value={form.email}
                      onChange={e => setField("email", e.target.value)} className="input" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="label">Phone (optional)</label>
                  <input type="tel" placeholder="+233 24 000 0000" value={form.phone}
                    onChange={e => setField("phone", e.target.value)} className="input" />
                </div>

                <div className="mb-4">
                  <label className="label">Subject</label>
                  <select value={form.subject} onChange={e => setField("subject", e.target.value)} className="input">
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="label">Message <span className="text-red-400">*</span></label>
                  <textarea rows={5} placeholder="Tell us how we can help…" value={form.message}
                    onChange={e => setField("message", e.target.value)} className="input resize-none" />
                </div>

                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-light">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.message || loading}
                  className="w-full btn-gold py-3.5 tracking-widest text-[11px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading
                    ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                    : <><Send size={14} /> Send Message</>
                  }
                </button>
              </div>
            )}
          </div>

          {/* Right panel: map placeholder + social */}
          <div className="flex flex-col gap-5">
            {/* Map */}
            <div className="luxury-card overflow-hidden flex-1">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={IMAGES.g1}
                  alt="Hotel location"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-brand-900/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-6">
                  <div className="w-12 h-12 bg-gold-400/10 border border-gold-400/20 rounded-2xl flex items-center justify-center mb-2">
                    <MapPin className="text-gold-400" size={22} />
                  </div>
                  <p className="text-white font-medium text-sm">Xain Hotel & Suites</p>
                  <p className="text-white/50 text-xs">Cantonments, Accra, Ghana</p>
                  <a href="https://maps.google.com/?q=Cantonments,Accra,Ghana" target="_blank" rel="noopener noreferrer"
                    className="mt-3 btn-gold text-[10px] px-5 py-2 tracking-widest">
                    View on Google Maps
                  </a>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Cantonments, Accra</p>
                    <p className="text-xs text-gray-400 font-light">Greater Accra Region, Ghana · Near the Diplomatic Enclave</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={15} className="text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Front Desk Open 24 / 7</p>
                    <p className="text-xs text-gray-400 font-light">Concierge and valet available around the clock</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social / Quick contact */}
            <div className="luxury-card p-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.25em] mb-4">Follow Us</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Instagram, label: "@xainhotel",     platform: "Instagram", href: "#" },
                  { icon: Facebook,  label: "Xain Hotel",      platform: "Facebook",  href: "#" },
                  { icon: Twitter,   label: "@xainhotelgh",    platform: "Twitter / X", href: "#" },
                ].map(({ icon: Icon, label, platform, href }) => (
                  <a key={platform} href={href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all group">
                    <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center border border-brand-100/50 group-hover:bg-brand-100 transition-colors">
                      <Icon size={15} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-[11px] text-gray-400 font-light">{platform}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
