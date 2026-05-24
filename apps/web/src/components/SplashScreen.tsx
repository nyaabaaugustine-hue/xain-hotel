"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit" | "hidden">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => setPhase("hidden"), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "hidden") return <>{children}</>;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-900"
        style={{
          transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
          transition: phase === "enter"
            ? "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
            : "transform 0.8s cubic-bezier(0.55, 0, 1, 0.45) 0.1s",
        }}
      >
        <div
          className="flex flex-col items-center gap-3"
          style={{
            opacity: phase === "visible" ? 1 : 0,
            transform: phase === "visible" ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: phase === "visible" ? "0.1s" : "0s",
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-500 rounded-xl flex items-center justify-center shadow-2xl shadow-gold-400/20">
            <span className="text-brand-900 font-bold text-2xl tracking-widest">S</span>
          </div>
          <div className="text-center">
            <p className="text-white font-display text-2xl font-semibold tracking-[0.3em]">SMIC360</p>
            <p className="text-gold-400/60 text-[10px] font-light tracking-[0.4em] uppercase -mt-0.5">Softwares</p>
          </div>
        </div>

        <div className="absolute bottom-12 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold-400/40"
              style={{
                animation: phase === "visible" ? `splashDot 1.2s ease-in-out ${i * 0.2}s infinite` : "none",
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splashDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {children}
    </>
  );
}
