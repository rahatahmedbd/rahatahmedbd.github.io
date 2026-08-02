"use client";

import { useState, useMemo } from "react";
import { getMissionCode, mapStatusToStageIndex, TIMELINE_STAGES } from "@/components/mission-control/mission-utils";
import { TimelineReactor } from "@/components/mission-control/timeline-reactor";
import { HoloWebsite } from "@/components/mission-control/holo-website";
import { StatsHolo } from "@/components/mission-control/stats-holo";
import { HistoryMatrix } from "@/components/mission-control/history-matrix";
import { FileVaultUI } from "@/components/mission-control/file-vault-ui";
import { ApprovalBay } from "@/components/mission-control/approval-bay";
import { MissionCompleteCelebration } from "@/components/mission-control/celebration";
import { 
  Rocket, Search, X, Orbit, Radio, Shield, Zap, Eye, Activity, 
  ExternalLink, Cpu, Clock, Database
} from "lucide-react";

interface Project {
  id: string;
  reference: string;
  client_id: string | null;
  status: string;
  total_amount: number;
  currency: string;
  notes: string | null;
  client_info: any;
  website_type: string | null;
  required_features: string[] | null;
  design_preference: string[] | null;
  budget_option: string | null;
  deadline_option: string | null;
  project_details: string | null;
  uploaded_files: any[] | null;
  estimated_cost: number | null;
  estimated_delivery: string | null;
  final_price: number | null;
  final_delivery: string | null;
  is_priority: boolean;
  internal_notes: string | null;
  internal_files: any[] | null;
  created_at: string;
}

export function ProjectsList({ initialProjects }: { initialProjects: Project[] }) {
  const [projects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Project | null>(initialProjects[0] || null);
  const [showCelebration, setShowCelebration] = useState(false);

  const filtered = useMemo(()=> projects.filter(p=>{
    const matchesSearch = p.reference.toLowerCase().includes(search.toLowerCase()) || (p.website_type && p.website_type.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus==="all" || p.status===filterStatus || (filterStatus==="completed" && p.status.includes("complet"));
    return matchesSearch && matchesStatus;
  }),[projects, search, filterStatus]);

  const currentStageIdx = selected ? mapStatusToStageIndex(selected.status) : 0;
  const codename = selected ? getMissionCode(projects.indexOf(selected), selected.reference) : "MISSION ALPHA";

  const openMission = (p: Project) => {
    setSelected(p);
    if (p.status.toLowerCase().includes("complet")) {
      setShowCelebration(true);
    }
    // smooth scroll to top of control room on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {showCelebration && selected && <MissionCompleteCelebration missionName={getMissionCode(projects.indexOf(selected), selected.reference)} onClose={()=>setShowCelebration(false)} />}

      {/* Hangar Header */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.18),transparent_60%)] blur-[18px]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-violet-600 text-white shadow-[0_0_24px_rgba(244,63,94,0.4)]"><Rocket className="h-7 w-7" /></div>
            <div>
              <h1 className="text-[22px] font-black tracking-tight text-white leading-none">MISSION HANGAR</h1>
              <p className="mt-1 text-[11px] font-mono tracking-widest text-white/40 uppercase">Every website is a mission • Each opens its own control room</p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-mono text-white/50">{projects.length} VESSELS DOCKED</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-emerald-300">{projects.filter(p=>!p.status.includes("complet")).length} ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search missions by code or type..." className="h-11 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[13px] text-white placeholder:text-white/25 focus:border-violet-400/40 focus:outline-none" />
            </div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="h-11 rounded-full border border-white/10 bg-black/40 px-4 text-[13px] text-white focus:border-white/20 outline-none">
              <option value="all">All Systems</option>
              <option value="pending">Pending / Requirement</option>
              <option value="development">Development Active</option>
              <option value="completed">Mission Complete</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-5 items-start">
        {/* Dock List */}
        <div className="space-y-3 lg:sticky top-6">
          <div className="flex items-center justify-between px-1"><span className="text-[11px] font-black tracking-[0.2em] text-white uppercase">Dock Manifest</span><span className="text-[10px] font-mono text-white/30">{filtered.length} found</span></div>
          <div className="grid gap-3 max-h-[70vh] overflow-y-auto pr-1 thin-scrollbar">
            {filtered.length>0 ? filtered.map((p,i)=>{
              const isActive = selected?.id===p.id;
              const stageIdx = mapStatusToStageIndex(p.status);
              const pct = Math.round(((stageIdx+1)/TIMELINE_STAGES.length)*100);
              return (
                <button key={p.id} onClick={()=>openMission(p)} className={`text-left relative overflow-hidden rounded-[20px] border p-4 transition-all duration-500 ${isActive ? "border-rose-400/40 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(244,63,94,0.18),rgba(99,102,241,0.12))] shadow-[0_0_24px_rgba(244,63,94,0.25)]" : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/40 border border-white/10 text-white font-black text-[12px]">{pct}%</div>
                      <div><div className="text-[12px] font-black tracking-wide text-white">{getMissionCode(i, p.reference)}</div><div className="text-[11px] font-bold text-white/70">{p.website_type}</div></div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest border ${p.status.includes("complet") ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-white/50"}`}>{p.status}</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-r from-rose-400 to-violet-400 transition-all duration-700" style={{ width: `${pct}%` }} /></div>
                  <div className="mt-2 flex justify-between text-[10px] font-mono text-white/30"><span>{p.reference}</span><span>{TIMELINE_STAGES[stageIdx].label}</span></div>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-full bg-gradient-to-b from-rose-400 to-violet-400 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />}
                </button>
              )
            }) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-[12px] text-white/40">No missions match filters</div>
            )}
          </div>
        </div>

        {/* Control Room */}
        {selected ? (
          <div className="space-y-5 min-w-0">
            {/* Control Room Header */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0c0e18] p-6">
              <div className="absolute inset-0 opacity-30"><div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" /></div>
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-black font-black text-[14px] shadow-[0_0_24px_rgba(255,255,255,0.3)]"><Orbit className="h-6 w-6" /></div>
                  <div>
                    <div className="flex items-center gap-2"><span className="text-[16px] font-black tracking-wide text-white">{codename}</span><span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-cyan-300">{selected.reference}</span><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest border ${selected.is_priority ? "bg-amber-400 text-black border-amber-400" : "border-white/10 bg-white/5 text-white/50"}`}>{selected.is_priority ? "PRIORITY" : "STANDARD"}</span></div>
                    <div className="mt-1 text-[13px] font-bold text-white/80">{selected.website_type} • {selected.budget_option || "Custom Budget"}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-white/40"><Clock className="h-3 w-3" /> Launched {new Date(selected.created_at).toLocaleDateString()} • {selected.estimated_delivery || "ETA TBD"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-300"><Radio className="h-3 w-3 inline mr-1" /> Control Room Active</span>
                  <a href={`/dashboard/files?mission=${selected.id}`} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-white/[0.10] flex items-center gap-1"><Database className="h-3.5 w-3.5" /> Vault</a>
                </div>
              </div>

              <div className="relative mt-6 grid md:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-[10px] tracking-widest text-white/40 uppercase flex items-center gap-1"><Cpu className="h-3 w-3" /> Mission Progress</div><div className="mt-2 text-[28px] font-black text-white leading-none">{Math.round(((currentStageIdx+1)/9)*100)}%</div><div className="mt-1 text-[11px] text-violet-300">{TIMELINE_STAGES[currentStageIdx].label}</div></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-[10px] tracking-widest text-white/40 uppercase flex items-center gap-1"><Shield className="h-3 w-3" /> Budget Secured</div><div className="mt-2 text-[20px] font-black text-white leading-none">{selected.final_price ? `$${selected.final_price}` : `$${selected.estimated_cost || 0}`}</div><div className="mt-1 text-[11px] text-white/50">{selected.final_price ? "Final • Locked" : "Estimated • Encrypted"}</div></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-[10px] tracking-widest text-white/40 uppercase flex items-center gap-1"><Activity className="h-3 w-3" /> Systems</div><div className="mt-2 flex gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] mt-1" /><span className="text-[13px] font-bold text-white">All systems nominal • Telemetry live</span></div><div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${70+currentStageIdx*4}%` }} /></div></div>
              </div>
            </div>

            <StatsHolo project={selected} />

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
              <HoloWebsite status={selected.status} title={`${codename} • Live Build`} />
              <TimelineReactor status={selected.status} project={selected} />
            </div>

            <FileVaultUI projects={[selected]} />
            <ApprovalBay project={selected} />
            <HistoryMatrix project={selected} />

            {/* Full Specs Deck */}
            <div className="rounded-[28px] border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              <h3 className="text-[13px] font-black tracking-[0.18em] text-white uppercase flex items-center gap-2"><Zap className="h-4 w-4 text-amber-300" /> Full Mission Brief • Declassified</h3>
              <div className="mt-4 grid md:grid-cols-2 gap-6">
                <div className="space-y-3 text-[12px] leading-relaxed text-white/60">
                  <div><span className="text-white/40 uppercase tracking-widest text-[10px]">Project Details</span><p className="mt-1 whitespace-pre-line rounded-xl border border-white/10 bg-white/[0.02] p-3 text-white/70">{selected.project_details || "No additional briefing provided. Standard protocol initiated."}</p></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="text-[10px] text-white/40 uppercase">Website Type</div><div className="mt-1 font-bold text-white">{selected.website_type}</div></div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="text-[10px] text-white/40 uppercase">Deadline</div><div className="mt-1 font-bold text-white">{selected.deadline_option || selected.estimated_delivery || "—"}</div></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div><div className="text-[10px] uppercase tracking-widest text-white/40">Required Features</div><div className="mt-2 flex flex-wrap gap-1.5">{(selected.required_features||[]).map((f:string)=><span key={f} className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-bold text-violet-300">{f}</span>)}</div></div>
                  <div><div className="text-[10px] uppercase tracking-widest text-white/40">Design Preference</div><div className="mt-2 flex flex-wrap gap-1.5">{(selected.design_preference||[]).map((f:string)=><span key={f} className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300">{f}</span>)}</div></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-16 text-center backdrop-blur-xl">
            <Orbit className="mx-auto h-10 w-10 text-white/20" />
            <div className="mt-4 text-white/60">Select a mission from the dock to enter control room</div>
          </div>
        )}
      </div>

      <style>{`.thin-scrollbar::-webkit-scrollbar{width:4px} .thin-scrollbar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:999px}`}</style>
    </div>
  );
}
