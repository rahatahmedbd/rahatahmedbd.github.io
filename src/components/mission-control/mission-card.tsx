"use client";
import { getMissionCode, mapStatusToStageIndex, TIMELINE_STAGES } from "./mission-utils";
import { Rocket, Radio, Cpu, Activity, ExternalLink, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export function MissionCard({ project, index, onEnter, isSelected }: { project: any; index: number; onEnter?: () => void; isSelected?: boolean }) {
  const code = getMissionCode(index, project.reference);
  const stageIdx = mapStatusToStageIndex(project.status);
  const pct = Math.round(((stageIdx+1)/TIMELINE_STAGES.length)*100);
  const [pulse, setPulse] = useState(0);
  useEffect(()=>{ const i=setInterval(()=>setPulse(p=>p+1),2600); return ()=>clearInterval(i); },[]);

  return (
    <div
      onClick={onEnter}
      className={`group relative cursor-pointer overflow-hidden rounded-[28px] border bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] backdrop-blur-xl transition-all duration-700
        ${isSelected ? "border-rose-400/50 shadow-[0_0_30px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.14)] scale-[1.02]" : "border-white/[0.08] hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1"}
      `}
    >
      {/* Holographic scan */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px]" />
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" style={{ top: `${(pulse*13)%100}%`, transition: "top 2.5s linear" }} />
      </div>

      {/* glow orbs */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.28),transparent_60%)] blur-[18px] group-hover:bg-[radial-gradient(circle,rgba(244,63,94,0.45),transparent_60%)] transition-all duration-700" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_65%)] blur-[22px]" />

      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#0d101a] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Rocket className="h-5 w-5 text-white" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-rose-500/20 to-violet-500/20 blur-[10px] -z-10" />
              <div className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 text-[8px] font-black text-black">{pct}%</div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-[0.2em] text-white">{code}</span>
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[8px] font-bold tracking-widest text-cyan-300">{project.reference}</span>
              </div>
              <div className="mt-1 text-[13px] font-bold leading-tight text-white/90 max-w-[18ch] truncate">{project.website_type || "Custom Web Mission"}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[9px] font-bold tracking-widest text-white/60 uppercase">{project.status}</span>
          </div>
        </div>

        {/* Mini timeline */}
        <div className="mt-5 flex items-center gap-1">
          {TIMELINE_STAGES.map((_, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-700 ${i <= stageIdx ? "bg-gradient-to-r from-rose-400 to-violet-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-white/10"}`} style={{ transitionDelay: `${i*40}ms` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] tracking-widest text-white/40 uppercase">Stage {stageIdx+1}/{TIMELINE_STAGES.length}</span>
          <span className="text-[10px] font-bold tracking-widest text-cyan-300">{TIMELINE_STAGES[stageIdx].label}</span>
        </div>

        {/* Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center gap-1 text-[9px] tracking-widest text-white/40 uppercase"><Cpu className="h-3 w-3" /> Progress</div>
            <div className="mt-1 text-[16px] font-black text-white">{pct}%</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center gap-1 text-[9px] tracking-widest text-white/40 uppercase"><Activity className="h-3 w-3" /> Systems</div>
            <div className="mt-1 text-[13px] font-bold text-white/90">{stageIdx>=3?"Online":"Booting"}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center gap-1 text-[9px] tracking-widest text-white/40 uppercase"><Radio className="h-3 w-3" /> Signal</div>
            <div className="mt-1 text-[13px] font-bold text-emerald-300">Locked</div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
            <Shield className="h-3 w-3 text-white/30" />
            {project.final_price ? `$${project.final_price} • SECURED` : project.estimated_cost ? `$${project.estimated_cost} EST` : "Budget Encrypted"}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-white group-hover:text-rose-300 transition-colors">
            ENTER CONTROL ROOM <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* bottom energy bar */}
      <div className="relative h-[3px] w-full overflow-hidden bg-white/5">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-400 transition-all duration-1000" style={{ width: `${pct}%` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3" style={{ animation: "shimmerMove 2s linear infinite" }} />
      </div>
    </div>
  );
}

export function MissionHangarEmpty({ onLaunch }: { onLaunch?: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] p-12 text-center backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(244,63,94,0.14),transparent_70%)]" />
      </div>
      <div className="relative">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Rocket className="h-9 w-9 text-white/50" />
        </div>
        <h3 className="mt-6 text-[22px] font-black tracking-tight text-white">No Active Missions Detected</h3>
        <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-white/50">Space Dock is empty. Launch your first website mission from Service District to ignite your digital command center.</p>
        <a href="/service-district" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-bold tracking-widest text-black hover:bg-white/90 transition-colors">
          <Zap className="h-4 w-4" /> LAUNCH NEW MISSION
        </a>
      </div>
    </div>
  );
}
