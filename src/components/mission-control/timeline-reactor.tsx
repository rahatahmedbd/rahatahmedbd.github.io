"use client";
import { TIMELINE_STAGES, mapStatusToStageIndex } from "./mission-utils";
import { useEffect, useRef, useState } from "react";
import { Clock, Paperclip, FileText, Check } from "lucide-react";

export function TimelineReactor({ status, project }: { status: string; project?: any }) {
  const stageIdx = mapStatusToStageIndex(status);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleStages, setVisibleStages] = useState<number>(stageIdx+1);

  useEffect(()=>{
    setVisibleStages(stageIdx+1);
  },[stageIdx]);

  return (
    <div ref={containerRef} className="relative rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] p-5 md:p-6 backdrop-blur-xl overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_60%)] blur-[20px]" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black font-black text-[12px] shadow-[0_0_18px_rgba(255,255,255,0.25)]">9</div>
          <div>
            <div className="text-[12px] font-black tracking-[0.18em] text-white">MISSION TIMELINE</div>
            <div className="text-[10px] tracking-widest text-white/40 uppercase">AUTOMATED PROGRESSION PROTOCOL</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] font-bold tracking-widest text-white/70">LIVE TRACKING</span>
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="relative mt-7 pl-2">
        {/* central beam */}
        <div className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
        <div className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-rose-400 via-violet-400 to-cyan-400 opacity-60" style={{ height: `${(stageIdx/(TIMELINE_STAGES.length-1))*100}%`, transition: "height 1.2s cubic-bezier(0.16,1,0.3,1)" }} />

        <div className="space-y-1">
          {TIMELINE_STAGES.map((stage, i) => {
            const active = i <= stageIdx;
            const current = i === stageIdx;
            const completed = i < stageIdx;
            return (
              <div key={stage.id} className={`relative flex gap-4 rounded-2xl p-3 transition-all duration-700 ${current ? "bg-white/[0.06] border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.12)]" : "border border-transparent"}`} style={{ transitionDelay: `${i*60}ms`, opacity: i<=visibleStages?1:0.3 }}>
                <div className="relative shrink-0">
                  <div className={`grid h-11 w-11 place-items-center rounded-full border text-[14px] font-black transition-all duration-700 ${active ? "bg-[#0c0e18] border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]" : "bg-white/[0.03] border-white/10 text-white/30"}`} style={{ borderColor: active ? stage.color : undefined }}>
                    {completed ? <Check className="h-5 w-5 text-emerald-300" /> : stage.icon}
                  </div>
                  {current && <div className="absolute inset-0 animate-ping rounded-full border border-white/20" />}
                  {current && <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-rose-500/20 to-violet-500/20 blur-[10px] -z-10" />}
                </div>

                <div className="min-w-0 flex-1 py-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[13px] font-bold tracking-wide ${active ? "text-white" : "text-white/35"}`}>{stage.label}</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold tracking-widest text-white/40">{stage.est}</span>
                    {current && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black tracking-widest text-white shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse">ACTIVE</span>}
                    {completed && <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold tracking-widest text-emerald-300">COMPLETED</span>}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-white/40">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{stage.bn} • {active ? (completed ? "Systems nominal" : current ? "In progress • telemetry live" : "Queued") : "Standby"}</span>
                  </div>

                  {/* expanded details for current */}
                  {current && (
                    <div className="mt-3 grid gap-2.5">
                      <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/50 uppercase"><FileText className="h-3 w-3" /> Current Directive</div>
                        <div className="mt-1.5 text-[12px] leading-relaxed text-white/70">
                          {project?.internal_notes ? project.internal_notes.slice(0,180) : `Engineering division is actively constructing ${stage.label} systems. Live telemetry indicates ${Math.floor(Math.random()*20+75)}% subsystem efficiency.`}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                          <div className="text-[9px] tracking-widest text-white/40 uppercase">Est. Completion</div>
                          <div className="mt-1 text-[12px] font-bold text-white">{project?.final_delivery || project?.estimated_delivery || stage.est}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                          <div className="text-[9px] tracking-widest text-white/40 uppercase">Progress</div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-r from-rose-400 to-cyan-400" style={{ width: `${current ? 68 : completed ? 100 : 0}%` }} /></div>
                            <span className="text-[11px] font-bold text-white">{current ? "68%" : completed ? "100%" : "0%"}</span>
                          </div>
                        </div>
                      </div>

                      {(project?.uploaded_files?.length>0 || project?.internal_files?.length>0) && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/50 uppercase"><Paperclip className="h-3 w-3" /> Attached Artifacts</div>
                          <div className="mt-2 grid gap-1.5">
                            {[...(project?.internal_files||[]).slice(0,2), ...(project?.uploaded_files||[]).slice(0,1)].map((f:any, idx:number)=>(
                              <a key={idx} href={f.url} target="_blank" className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[11px] text-white/70 hover:text-white transition-colors">
                                <span className="truncate">{f.name}</span><span className="text-[9px] font-mono text-white/30">OPEN</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
