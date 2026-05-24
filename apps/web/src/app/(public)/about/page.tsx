import Link from "next/link";
import Image from "next/image";
import { Heart, Award, Users, Clock, Star, ArrowRight, Globe, Leaf } from "lucide-react";
import { IMAGES } from "@/lib/images";

const CL = {
  resort: IMAGES.resort,
  shore:  IMAGES.shore,
  pool:   IMAGES.pool,
  beach:  IMAGES.beach,
  desk:   IMAGES.desk,
};

const TEAM = [
  { name: "Jonathan Reid",   role: "General Manager",       initial: "JR", color: "from-brand-700 to-brand-900" },
  { name: "Amara Osei",      role: "Head Concierge",         initial: "AO", color: "from-[#1A0C05] to-[#3D1C0A]" },
  { name: "Claire Fontaine", role: "Executive Chef",         initial: "CF", color: "from-[#0A1A30] to-[#153860]" },
  { name: "Marcus Webb",     role: "Head of Housekeeping",  initial: "MW", color: "from-[#151530] to-[#282870]" },
];

const VALUES = [
  { icon: Heart,  title: "Genuine Hospitality",   desc: "We treat every guest like family — going above and beyond to craft moments that echo long after checkout." },
  { icon: Award,  title: "Unwavering Quality",    desc: "From thread count to table settings, we never compromise. Excellence is our baseline, not our aspiration." },
  { icon: Globe,  title: "Proudly Ghanaian",      desc: "We celebrate our heritage at every turn — kente-woven interiors, local artisans, and farm-to-table cuisine." },
  { icon: Leaf,   title: "Sustainable Luxury",    desc: "We source locally, reduce waste, and invest in renewable energy — because true luxury respects the planet." },
  { icon: Users,  title: "Community First",        desc: "We invest in Accra's future — hiring locally, funding youth training, and supporting cultural preservation." },
  { icon: Clock,  title: "Always Here For You",   desc: "Our concierge and front desk teams are available 24/7 — whatever you need, we are ready." },
];

const MILESTONES = [
  { year: "2010", event: "SMIC360 Softwares opens its doors in Cantonments, Accra." },
  { year: "2013", event: "Awarded Best Boutique Hotel in West Africa by Luxury Travel Magazine." },
  { year: "2016", event: "Presidential Suite wing added; capacity expanded to 80 rooms." },
  { year: "2019", event: "Rooftop infinity pool and Gold Coast Fine Dining restaurant launched." },
  { year: "2022", event: "Recognised as Ghana's top-rated hotel on TripAdvisor for 3rd consecutive year." },
  { year: "2024", event: "Solar energy installation — Xain becomes Accra's first carbon-neutral luxury hotel." },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 bg-brand-900 overflow-hidden text-center">
        <Image
          src={CL.resort}
          alt="Xain Hotel aerial view"
          fill
          priority
          className="object-cover object-center opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 kente-weave opacity-30" />
        <div className="absolute inset-0 adinkra-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-brand-900/60 to-brand-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold-400/5 rounded-full blur-[130px]" />
        <div className="relative">
          <div className="gold-line mx-auto mb-6" />
          <p className="text-gold-400/70 text-[11px] font-medium tracking-[0.5em] uppercase mb-5">Our Story</p>
          <h1 className="font-display font-light text-white mb-5"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem,7vw,5.5rem)" }}>
            About SMIC360 Softwares
          </h1>
          <p className="text-white/40 text-base max-w-2xl mx-auto font-light leading-relaxed">
            Since 2010, SMIC360 Softwares has been a haven of elegance and warmth — where world-class hospitality
            meets a deep commitment to Ghanaian heritage and every guest's well-being.
          </p>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="gold-line mb-6" />
            <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-5">Who We Are</p>
            <h2 className="font-display font-light text-brand-900 mb-7 leading-tight"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)" }}>
              A Legacy Born on the<br /><em className="text-gold-500 not-italic">Gold Coast</em>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5 font-light text-[15px]">
              Founded with a simple conviction — that Ghana deserves world-class luxury on its own terms — SMIC360 Softwares has grown from a boutique Cantonments property into one of West Africa's most celebrated hospitality destinations.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 font-light text-[15px]">
              Our 150+ dedicated professionals work tirelessly to ensure every stay is seamless, every meal is memorable, and every guest leaves feeling enriched by the culture and warmth of Ghana.
            </p>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-gold-400 fill-gold-400" />)}
              <span className="text-gray-400 text-sm ml-2 font-light">Rated 4.9 / 5 by over 2,400 guests</span>
            </div>
          </div>

          {/* Image collage replacing the stat grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-52 rounded-2xl overflow-hidden col-span-2">
              <Image src={IMAGES.shore} alt="Serenity shore" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <Image src={IMAGES.desk} alt="Xain Hotel front desk" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <Image src={IMAGES.pool} alt="Sunset pool" fill className="object-cover" sizes="25vw" />
            </div>
            {[
              ["15+",   "Years of Service"],
              ["150+",  "Team Members"],
              ["80",    "Luxury Rooms"],
              ["2,400+","Happy Guests"],
            ].map(([num, label]) => (
              <div key={label}
                className="bg-cream border border-gold-100 rounded-2xl p-5 text-center hover:border-gold-300 transition-colors group">
                <p className="font-display text-2xl font-semibold text-brand-700 mb-1 group-hover:text-gold-500 transition-colors"
                   style={{ fontFamily: "var(--font-display)" }}>{num}</p>
                <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase font-light">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="gold-line mx-auto mb-6" />
            <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">What Drives Us</p>
            <h2 className="font-display font-light text-brand-900"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="luxury-card p-8 group">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6
                                group-hover:bg-gradient-to-br group-hover:from-gold-100 group-hover:to-gold-50
                                transition-all duration-300 border border-brand-100/50 group-hover:border-gold-200">
                  <Icon className="text-brand-600 group-hover:text-gold-600 transition-colors" size={22} />
                </div>
                <h3 className="font-semibold text-brand-900 mb-2.5 tracking-tight">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO BREAK ── */}
      <section className="relative h-72 overflow-hidden">
        <Image
          src={CL.beach}
          alt="Xain Hotel beachside hammocks"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-900/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="gold-line mx-auto mb-4" />
            <p className="font-display font-light text-3xl tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
              Where Every Moment is Luxury
            </p>
          </div>
        </div>
      </section>

      {/* ── TIMELINE / MILESTONES ── */}
      <section className="py-28 px-6 bg-brand-900 relative overflow-hidden">
        <Image
          src={CL.shore}
          alt="Serenity shore"
          fill
          className="object-cover object-center opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 kente-weave opacity-20" />
        <div className="absolute inset-0 adinkra-pattern opacity-30" />
        <div className="absolute inset-0 bg-brand-900/85" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="gold-line mx-auto mb-6" />
            <p className="text-gold-400/70 text-[11px] font-medium tracking-[0.5em] uppercase mb-5">Our Journey</p>
            <h2 className="font-display font-light text-white"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Milestones
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-400/25 to-transparent hidden sm:block" />
            <div className="flex flex-col gap-8">
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                  <div className="sm:w-28 flex-shrink-0 flex sm:justify-end">
                    <span className="font-display text-gold-400 text-lg font-semibold"
                          style={{ fontFamily: "var(--font-display)" }}>{year}</span>
                  </div>
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-3 h-3 rounded-full bg-gold-400 mt-1.5 flex-shrink-0 hidden sm:block shadow-lg shadow-gold-400/30" />
                    <p className="text-white/55 text-sm leading-relaxed font-light">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="gold-line mx-auto mb-6" />
            <p className="text-gold-500 text-[11px] font-semibold tracking-[0.4em] uppercase mb-4">The People Behind It</p>
            <h2 className="font-display font-light text-brand-900"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              Meet Our Leadership
            </h2>
          </div>

          {/* Front Desk feature image */}
          <div className="relative h-60 rounded-3xl overflow-hidden mb-12">
            <Image
              src={CL.desk}
              alt="Xain Hotel front desk team"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
            <div className="absolute bottom-6 left-8">
              <p className="text-white font-light text-lg tracking-widest font-display" style={{ fontFamily: "var(--font-display)" }}>
                150+ professionals. One shared mission.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TEAM.map(member => (
              <div key={member.name} className="text-center group">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                  <span className="text-white text-2xl font-display font-semibold"
                        style={{ fontFamily: "var(--font-display)" }}>{member.initial}</span>
                </div>
                <p className="font-semibold text-brand-900 tracking-tight">{member.name}</p>
                <p className="text-gold-500 text-xs mt-1 tracking-wide font-light">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-6 bg-cream overflow-hidden text-center">
        <div className="max-w-xl mx-auto">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="font-display font-light text-brand-900 mb-4 leading-tight"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4.5vw,3rem)" }}>
            Come Experience It Yourself
          </h2>
          <p className="text-gray-400 mb-10 font-light text-[15px]">
            Words can only say so much. Let us show you what luxury truly feels like on the Gold Coast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-gold text-[11px] px-10 py-4 tracking-widest inline-flex items-center gap-2">
              Book Now <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="btn-outline-gold text-[11px] px-10 py-4 tracking-widest border border-brand-600/30 text-brand-700 hover:bg-brand-50 hover:border-brand-400">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
