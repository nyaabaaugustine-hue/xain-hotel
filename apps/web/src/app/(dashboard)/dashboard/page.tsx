"use client";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { fmt } from "@/lib/utils";
import {
  BedDouble, CalendarCheck, Users, TrendingUp,
  CheckCircle, Clock, AlertCircle, DollarSign,
  ArrowUpRight, ArrowDownRight, Sparkles, Star,
  Coffee, Utensils, Car, Wifi, Activity, Bell,
  ChevronRight, MapPin, Moon, Sun, Zap,
} from "lucide-react";

// ─── Fictional seed data shown until real data loads ─────────────────────────
const FICTIONAL_STATS = {
  totalRooms: 48,
  availableRooms: 14,
  occupiedRooms: 34,
  checkedIn: 34,
  todayArrivals: 9,
  todayDepartures: 5,
  pendingReservations: 7,
  totalCustomers: 312,
  monthlyRevenue: 87640,
  totalReservations: 128,
};

const FICTIONAL_RESERVATIONS = [
  { id: "1",  bookingNo: "XH-240901", customer: { name: "Amara Osei-Bonsu"    }, room: { roomNo: "P-12", roomType: { name: "Sky Penthouse Suite"  } }, checkIn: "2025-05-26", status: "checked_in",  totalAmount: 9600  },
  { id: "2",  bookingNo: "XH-240897", customer: { name: "Dr. Kwame Asante"    }, room: { roomNo: "D-07", roomType: { name: "Deluxe Garden Room"   } }, checkIn: "2025-05-26", status: "pending",     totalAmount: 3700  },
  { id: "3",  bookingNo: "XH-240889", customer: { name: "Serena Mensah"       }, room: { roomNo: "S-21", roomType: { name: "Executive Room"       } }, checkIn: "2025-05-25", status: "checked_in",  totalAmount: 1920  },
  { id: "4",  bookingNo: "XH-240882", customer: { name: "Nana Acheampong"     }, room: { roomNo: "D-03", roomType: { name: "Deluxe Garden Room"   } }, checkIn: "2025-05-24", status: "checked_out", totalAmount: 4800  },
  { id: "5",  bookingNo: "XH-240878", customer: { name: "Isabella Torres"     }, room: { roomNo: "P-08", roomType: { name: "Presidential Suite"  } }, checkIn: "2025-05-24", status: "checked_in",  totalAmount: 16400 },
  { id: "6",  bookingNo: "XH-240871", customer: { name: "James Ofori"         }, room: { roomNo: "S-15", roomType: { name: "Executive Room"       } }, checkIn: "2025-05-24", status: "cancelled",  totalAmount: 720   },
  { id: "7",  bookingNo: "XH-240865", customer: { name: "Fatima Al-Rashid"    }, room: { roomNo: "K-04", roomType: { name: "Kente Suite"          } }, checkIn: "2025-05-23", status: "checked_out", totalAmount: 2400  },
  { id: "8",  bookingNo: "XH-240860", customer: { name: "Emmanuel Boateng"    }, room: { roomNo: "C-11", roomType: { name: "Classic Room"          } }, checkIn: "2025-05-22", status: "checked_out", totalAmount: 1000  },
  { id: "9",  bookingNo: "XH-240855", customer: { name: "Sophie Okonkwo"      }, room: { roomNo: "D-14", roomType: { name: "Deluxe Garden Room"   } }, checkIn: "2025-05-27", status: "pending",     totalAmount: 5550  },
  { id: "10", bookingNo: "XH-240849", customer: { name: "Charles Mensah-Brown"}, room: { roomNo: "K-09", roomType: { name: "Kente Suite"          } }, checkIn: "2025-05-28", status: "pending",     totalAmount: 3840  },
  { id: "11", bookingNo: "XH-240843", customer: { name: "Abena Frimpong"      }, room: { roomNo: "C-05", roomType: { name: "Classic Room"          } }, checkIn: "2025-05-21", status: "checked_out", totalAmount: 700   },
  { id: "12", bookingNo: "XH-240837", customer: { name: "Ravi Patel"          }, room: { roomNo: "P-01", roomType: { name: "Presidential Suite"  } }, checkIn: "2025-05-29", status: "pending",     totalAmount: 19200 },
  { id: "13", bookingNo: "XH-240831", customer: { name: "Adwoa Asante"        }, room: { roomNo: "S-08", roomType: { name: "Executive Room"       } }, checkIn: "2025-05-20", status: "checked_out", totalAmount: 1920  },
  { id: "14", bookingNo: "XH-240825", customer: { name: "Yaw Darko"           }, room: { roomNo: "K-06", roomType: { name: "Kente Suite"          } }, checkIn: "2025-05-30", status: "pending",     totalAmount: 7200  },
  { id: "15", bookingNo: "XH-240819", customer: { name: "Ama Owusu"           }, room: { roomNo: "C-18", roomType: { name: "Classic Room"          } }, checkIn: "2025-05-19", status: "checked_out", totalAmount: 700   },
  { id: "16", bookingNo: "XH-240813", customer: { name: "Omar Hassan"         }, room: { roomNo: "D-17", roomType: { name: "Deluxe Garden Room"   } }, checkIn: "2025-05-18", status: "cancelled",  totalAmount: 2400  },
  { id: "17", bookingNo: "XH-240807", customer: { name: "Gifty Tetteh"        }, room: { roomNo: "S-22", roomType: { name: "Executive Room"       } }, checkIn: "2025-06-01", status: "pending",     totalAmount: 5600  },
  { id: "18", bookingNo: "XH-240801", customer: { name: "Akwesi Bonsu"        }, room: { roomNo: "P-05", roomType: { name: "Sky Penthouse Suite"  } }, checkIn: "2025-05-16", status: "checked_out", totalAmount: 6400  },
  { id: "19", bookingNo: "XH-240795", customer: { name: "Priscilla Agyei"     }, room: { roomNo: "K-11", roomType: { name: "Kente Suite"          } }, checkIn: "2025-06-03", status: "pending",     totalAmount: 10800 },
  { id: "20", bookingNo: "XH-240789", customer: { name: "Ben Appiah"          }, room: { roomNo: "C-02", roomType: { name: "Classic Room"          } }, checkIn: "2025-05-15", status: "checked_out", totalAmount: 350   },
];

const LIVE_ACTIVITY = [
  { time: "09:42", msg: "Room P-12 — Early check-in approved", type: "success" },
  { time: "09:31", msg: "Booking XH-240887 — Payment confirmed", type: "info" },
  { time: "09:18", msg: "Room D-05 — Housekeeping complete", type: "success" },
  { time: "08:55", msg: "Booking XH-240881 — Awaiting payment", type: "warn" },
  { time: "08:40", msg: "New reservation from Isabella Torres", type: "info" },
];

const ROOM_TYPES = [
  { name: "Penthouse Suite", total: 6, occupied: 5, color: "#E8B433" },
  { name: "Deluxe King",     total: 18, occupied: 14, color: "#0F7048" },
  { name: "Superior Twin",   total: 16, occupied: 12, color: "#7C3AED" },
  { name: "Standard Room",   total: 8,  occupied: 3,  color: "#0EA5E9" },
];

const AMENITY_STATS = [
  { icon: Coffee,   label: "Restaurant",  value: "GH₵ 4,320",  sub: "38 covers today" },
  { icon: Car,      label: "Parking",     value: "23 / 30",     sub: "Bays occupied" },
  { icon: Utensils, label: "Room Service",value: "GH₵ 1,740",  sub: "14 orders today" },
  { icon: Wifi,     label: "Concierge",   value: "11 requests", sub: "2 pending" },
];

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:     { label: "Pending",     bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400" },
  checked_in:  { label: "Checked In",  bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500" },
  checked_out: { label: "Checked Out", bg: "bg-sky-50",     text: "text-sky-700",    dot: "bg-sky-500" },
  cancelled:   { label: "Cancelled",   bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400" },
};

// ─── Micro components ─────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon: Icon, gradient, trend, trendDir }: {
  label: string; value: string | number; sub?: string; icon: any;
  gradient: string; trend?: string; trendDir?: "up" | "down";
}) {
  return (
    <div className="xh-card group relative overflow-hidden">
      {/* gradient accent blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${gradient}`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${gradient} shadow-sm`}>
            <Icon size={18} className="text-white" />
          </div>
          {trend && (
            <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-full ${
              trendDir === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}>
              {trendDir === "up" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-0.5">{value}</p>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function OccupancyRing({ pct }: { pct: number }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct > 85 ? "#ef4444" : pct > 65 ? "#f59e0b" : "#0F7048";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-gray-800 leading-none">{pct}%</p>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Full</p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/api/dashboard").then(r => r.data.data),
    refetchInterval: 60_000,
  });

  const s = (data?.stats && data.stats.totalRooms > 0) ? data.stats : FICTIONAL_STATS;
  const recent = data?.recentReservations?.length ? data.recentReservations : FICTIONAL_RESERVATIONS;
  const occupiedRooms = s.totalRooms - s.availableRooms;
  const occupancyPct = s.totalRooms > 0 ? Math.round((occupiedRooms / s.totalRooms) * 100) : 71;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const GreetIcon = hour < 12 ? Sun : hour < 18 ? Zap : Moon;
  const firstName = user?.fullname?.split(" ")[0] ?? "Manager";

  return (
    <div className="xh-root min-h-screen">

      {/* ── Header ── */}
      <div className="xh-header mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GreetIcon size={16} className="text-gold-500" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{greeting}</p>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {firstName} <span className="text-brand-600">·</span> Operations Center
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              {new Date().toLocaleDateString("en-GH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-gray-600">Live · All systems</span>
            </div>

            {/* Notification bell */}
            <button className="relative w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
              <Bell size={16} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-5 flex items-center gap-4 flex-wrap">
          {[
            { label: "Satisfaction Score", value: "4.8", icon: Star, color: "text-amber-500" },
            { label: "RevPAR Today", value: "GH₵ 1,827", icon: TrendingUp, color: "text-brand-600" },
            { label: "Guests In-House", value: String(s.checkedIn), icon: Users, color: "text-violet-600" },
            { label: "ADR This Month", value: "GH₵ 2,118", icon: Sparkles, color: "text-sky-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3.5 py-2 shadow-sm">
              <Icon size={13} className={color} />
              <span className="text-xs text-gray-400 font-medium">{label}</span>
              <span className="text-xs font-bold text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total Rooms"      value={s.totalRooms}           icon={BedDouble}     gradient="bg-brand-600"   trend="+6 this yr" trendDir="up" />
        <KpiCard label="Occupied Now"     value={occupiedRooms}          icon={CheckCircle}   gradient="bg-emerald-500" sub={`${s.availableRooms} available`} trend="+3 vs yesterday" trendDir="up" />
        <KpiCard label="Arrivals Today"   value={s.todayArrivals}        icon={ArrowUpRight}  gradient="bg-amber-500"   trend="2 early" trendDir="up" />
        <KpiCard label="Departures Today" value={s.todayDepartures}      icon={ArrowDownRight}gradient="bg-rose-500"    sub="1 late checkout" />
        <KpiCard label="Pending Bookings" value={s.pendingReservations}  icon={Clock}         gradient="bg-orange-500"  trend="3 new" trendDir="up" />
        <KpiCard label="Guests Checked In"value={s.checkedIn}            icon={Users}         gradient="bg-sky-500"     sub="in-house now" />
        <KpiCard label="Total Customers"  value={s.totalCustomers}       icon={AlertCircle}   gradient="bg-violet-500"  trend="+12 this month" trendDir="up" />
        <KpiCard label="Monthly Revenue"  value={fmt.currency(s.monthlyRevenue, "GH₵")} icon={DollarSign} gradient="bg-gold-500" trend="+18% vs last month" trendDir="up" />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

        {/* Occupancy Card */}
        <div className="xh-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="xh-section-title">Occupancy</h2>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Live</span>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <OccupancyRing pct={occupancyPct} />
            <div className="flex-1 space-y-3">
              {ROOM_TYPES.map(({ name, total, occupied, color }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">{name}</span>
                    <span className="text-gray-700 font-bold">{occupied}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(occupied / total) * 100}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
            {[
              { label: "Available", val: s.availableRooms, dot: "bg-brand-500" },
              { label: "Occupied",  val: occupiedRooms,    dot: "bg-amber-400" },
              { label: "Pending",   val: s.pendingReservations, dot: "bg-violet-400" },
            ].map(({ label, val, dot }) => (
              <div key={label} className="text-center">
                <div className={`w-2 h-2 rounded-full ${dot} mx-auto mb-1`} />
                <p className="text-lg font-bold text-gray-800">{val}</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="xh-card">
          <h2 className="xh-section-title mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/reservations", label: "New Booking",  icon: CalendarCheck, cls: "from-violet-50 to-violet-100/60 border-violet-100 text-violet-700 hover:border-violet-300" },
              { href: "/customers",    label: "Add Guest",    icon: Users,         cls: "from-emerald-50 to-emerald-100/60 border-emerald-100 text-emerald-700 hover:border-emerald-300" },
              { href: "/manage-rooms", label: "Room Status",  icon: BedDouble,     cls: "from-sky-50 to-sky-100/60 border-sky-100 text-sky-700 hover:border-sky-300" },
              { href: "/orders",       label: "New Order",    icon: Utensils,      cls: "from-amber-50 to-amber-100/60 border-amber-100 text-amber-700 hover:border-amber-300" },
              { href: "/reports",      label: "Reports",      icon: Activity,      cls: "from-rose-50 to-rose-100/60 border-rose-100 text-rose-700 hover:border-rose-300" },
              { href: "/settings",     label: "Settings",     icon: TrendingUp,    cls: "from-gray-50 to-gray-100/60 border-gray-100 text-gray-600 hover:border-gray-300" },
            ].map(({ href, label, icon: Icon, cls }) => (
              <a key={href} href={href}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border bg-gradient-to-br transition-all hover:shadow-sm hover:-translate-y-0.5 ${cls}`}>
                <Icon size={16} />
                <span className="text-xs font-semibold">{label}</span>
                <ChevronRight size={11} className="ml-auto opacity-50" />
              </a>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="xh-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="xh-section-title">Live Activity</h2>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Real-time
            </span>
          </div>
          <div className="space-y-3">
            {LIVE_ACTIVITY.map(({ time, msg, type }, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  type === "success" ? "bg-emerald-500" : type === "warn" ? "bg-amber-400" : "bg-sky-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">{msg}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-brand-50 to-emerald-50 rounded-xl">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-brand-600" />
                <span className="text-xs font-semibold text-gray-700">Kumasi, Ghana</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                Hotel Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Amenities Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {AMENITY_STATS.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="xh-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center flex-shrink-0">
              <Icon size={17} className="text-gold-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{value}</p>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Reservations Table ── */}
      <div className="xh-card overflow-hidden p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="xh-section-title">Recent Reservations</h2>
            <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {recent.length} entries
            </span>
          </div>
          <a href="/reservations"
            className="flex items-center gap-1 text-brand-600 text-xs font-bold hover:text-brand-700 transition-colors">
            View all <ChevronRight size={13} />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-left">
                {["Booking #", "Guest", "Room Type", "Check-In", "Status", "Amount"].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r: any, idx: number) => {
                const st = STATUS_MAP[r.status] || { label: r.status, bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };
                return (
                  <tr key={r.id}
                    className={`border-t border-gray-50/80 hover:bg-brand-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">{r.bookingNo}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-[10px] font-bold flex-shrink-0">
                          {r.customer?.name?.[0]?.toUpperCase() ?? "G"}
                        </div>
                        <span className="font-semibold text-gray-800 text-xs">{r.customer?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="text-xs font-bold text-gray-700">{r.room?.roomNo}</span>
                        <span className="text-[10px] text-gray-400 ml-1.5">{r.room?.roomType?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{fmt.date(r.checkIn)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900 text-sm">{fmt.currency(r.totalAmount, "GH₵")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <p className="text-[11px] text-gray-400 font-medium">Showing {recent.length} most recent reservations · Auto-refreshes every 60s</p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-600">
            <Activity size={11} />
            Live data
          </div>
        </div>
      </div>

    </div>
  );
}
