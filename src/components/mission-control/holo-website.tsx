"use client";
import { generateHoloData, mapStatusToStageIndex } from "./mission-utils";
import { useMemo } from "react";

export function HoloWebsite({ status, title = "LIVE PREVIEW" }: { status: string; title?: string }) {
  const stageIdx = mapStatusToStageIndex(status);
  const blocks = useMemo(()=>generateHoloData(stageIdx),[stageIdx]);
  const pct = Math.round(((stageIdx+1)/9)*100);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[radial-gradient(120%_120%_at_50%_0%,rgba(99,102,241,0.15),rgba(0,0,0,0.8))] p-5 backdrop-blur-xl">
      {/* scanlines */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.06)_50%)] bg-[length:100%_3px]" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black font-black text-[10px] tracking-widest">LIVE</div>
          <div>
            <div className="text-[12px] font-black tracking-[0.18em] text-white">{title}</div>
            <div className="text-[10px] tracking-widest text-cyan-300/70 uppercase">Holographic • {pct}% Materialized</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-white/60">RENDERING ENGINE: ACTIVE</span>
        </div>
      </div>

      {/* Holo viewport */}
      <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#070a13] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_0_40px_rgba(99,102,241,0.15)]">
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: `linear-gradient(rgba(100,150,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(100,150,255,0.18) 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
        {/* perspective */}
        <div className="absolute inset-0" style={{ perspective: "900px", perspectiveOrigin: "50% 30%" }}>
          <div className="absolute left-[8%] right-[8%] top-[10%] bottom-[10%] rotate-x-[12deg]" style={{ transformStyle: "preserve-3d" as any }}>
            {blocks.map((b, i) => (
              <div
                key={b.id}
                className={`absolute overflow-hidden rounded-[10px] border backdrop-blur-sm transition-all duration-[1200ms] ${b.active ? "border-white/20 bg-white/[0.06]" : "border-white/[0.04] bg-white/[0.01] opacity-30 translate-y-3 scale-[0.96]"}`}
                style={{ 
                  top: `${b.top}%`, 
                  left: `${b.left}%`, 
                  width: `${b.w}%`, 
                  height: `${b.h}%`,
                  transitionDelay: `${i*120}ms`,
                  transform: `translateZ(${b.active ? i*14 : 0}px) ${b.active ? "" : "scale(0.9)"}`,
                  boxShadow: b.active ? `0 0 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.12)` : undefined,
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-rose-400/0 via-cyan-400/80 to-violet-400/0 opacity-80" style={{ display: b.active? "block":"none" }} />
                <div className={`flex h-full w-full items-center justify-center text-[8px] font-black tracking-[0.2em] ${b.active ? "text-white/70" : "text-white/20"}`}>
                  {b.active ? b.label : "/// LOCKED ///"}
                </div>
                {b.active && (
                  <>
                    <div className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <div className="absolute right-1 bottom-1 h-[2px] w-6 bg-gradient-to-r from-cyan-400 to-transparent" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* scanning laser */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 blur-[0.5px]" style={{ top: "34%", animation: "scanLaser 3.2s linear infinite" }} />
        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_30%,rgba(0,0,0,0.75)_90%)]" />
        {/* corner brackets */}
        <div className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-cyan-400/60" />
        <div className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-cyan-400/60" />
        <div className="absolute left-3 bottom-3 h-5 w-5 border-l-2 border-b-2 border-cyan-400/60" />
        <div className="absolute right-3 bottom-3 h-5 w-5 border-r-2 border-b-2 border-cyan-400/60" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { k: "Pages", v: `${Math.max(1,stageIdx-1)}/6 LIVE` },
          { k: "Components", v: `${blocks.filter(b=>b.active).length*4} Active` },
          { k: "Systems", v: stageIdx>=4 ? "Online" : "Booting" },
        ].map(item=>(
          <div key={item.k} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="text-[9px] tracking-widest text-white/40 uppercase">{item.k}</div>
            <div className="mt-0.5 text-[12px] font-bold text-white">{item.v}</div>
          </div>
        ))}
      </div>

      <style>{`@keyframes scanLaser { 0% { transform: translateY(-120px); opacity:0 } 10% { opacity:1 } 90% { opacity:1 } 100% { transform: translateY(180px); opacity:0 } }`}</style>
    </div>
  );
}
