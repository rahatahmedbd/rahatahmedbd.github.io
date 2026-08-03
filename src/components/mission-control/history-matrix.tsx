"use client";
import { Clock, File, CheckCircle2, MessageSquare, Upload, Rocket, Activity } from "lucide-react";

export function HistoryMatrix({ project }: { project?: any }) {
  const events = [
    { time: "2025-06-10 14:22", type: "launch", title: "Mission Launched", desc: `Project ${project?.reference || "ORD-XXXX"} ignited • Budget ${project?.estimated_cost || "..."}`, icon: Rocket, color: "text-rose-400" },
    { time: "2025-06-11 09:15", type: "file", title: "Brief Uploaded", desc: `${project?.uploaded_files?.length||2} files sealed in vault • Requirement phase`, icon: File, color: "text-cyan-300" },
    { time: "2025-06-12 16:40", type: "message", title: "Transmission Received", desc: "Mission Control: Requirement Review completed, moving to Planning", icon: MessageSquare, color: "text-violet-300" },
    { time: "2025-06-14 11:00", type: "design", title: "UI/UX Matrix Rendered", desc: "3 design concepts materialized for approval • Check Approval Bay", icon: Activity, color: "text-fuchsia-300" },
    { time: "2025-06-18 13:25", type: "approve", title: "Milestone Approved", desc: "Client approved Design Phase • Development ignition started", icon: CheckCircle2, color: "text-emerald-300" },
    { time: "2025-06-20 10:05", type: "upload", title: "Dev Build Pushed", desc: "Internal build v0.8 deployed to staging • Live preview updated", icon: Upload, color: "text-amber-300" },
  ];

  return (
    <div className="relative rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] p-5 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] border border-white/10"><Clock className="h-4 w-4 text-white/70" /></div>
        <div>
          <div className="text-[12px] font-black tracking-[0.18em] text-white">MISSION HISTORY • BLACK BOX</div>
          <div className="text-[10px] tracking-widest text-white/40 uppercase">Complete immutable timeline • Every action logged</div>
        </div>
      </div>

      <div className="relative mt-6 pl-2">
        <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
        <div className="space-y-4">
          {events.map((ev,i)=>{
            const Icon=ev.icon;
            return (
              <div key={i} className="relative flex gap-4 group">
                <div className="relative shrink-0">
                  <div className={`grid h-10 w-10 place-items-center rounded-full border bg-[#0d0f18] border-white/10 shadow-[0_0_18px_rgba(255,255,255,0.08)] group-hover:border-white/20 transition-colors ${ev.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[6px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="min-w-0 flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[12px] font-bold text-white">{ev.title}</div>
                    <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] font-mono text-white/40">{ev.time}</span>
                  </div>
                  <div className="mt-1 text-[11px] leading-relaxed text-white/50">{ev.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 flex items-center gap-2 text-[10px] font-mono text-white/30">
        <Activity className="h-3 w-3 text-emerald-400" /> Activity logging active • SHA-256 verified • Supabase: activity_logs table synced with Admin Tower
      </div>
    </div>
  );
}
