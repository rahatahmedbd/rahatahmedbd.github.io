"use client";
import { useEffect, useState } from "react";
import { Radio, Satellite, Activity, Zap } from "lucide-react";

export function HudBar({ missionCount = 0, activeTransmissions = 3 }: { missionCount?: number; activeTransmissions?: number }) {
  const [time, setTime] = useState<string>("");
  const [utc, setUtc] = useState<string>("");
  useEffect(() => {
    const upd = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour12: false }));
      setUtc(now.toISOString().slice(11,19) + " UTC");
    };
    upd();
    const i = setInterval(upd, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative z-20 flex h-[52px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#05070d]/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] border border-white/[0.08]">
            <Activity className="h-4 w-4 text-cyan-300 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Mission Control</span>
              <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="text-[11px] font-mono text-white/80 -mt-0.5">LINK: STABLE • {utc || "00:00:00 UTC"}</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 pl-5 border-l border-white/10">
          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-white/40 uppercase"><Satellite className="h-3 w-3" /> TELEMETRY</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-300">{missionCount} ACTIVE MISSIONS</span>
            <span className="text-[11px] font-mono text-violet-300">{activeTransmissions} LIVE SIGNALS</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
          <Zap className="h-3 w-3 text-amber-300" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-white/70">QUANTUM LINK 99.9%</span>
          <div className="ml-1 h-1 w-16 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[99%] bg-gradient-to-r from-cyan-400 to-violet-400" /></div>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
          <span className="text-[12px] font-mono font-bold text-white tracking-widest">{time}</span>
        </div>
      </div>
    </div>
  );
}
