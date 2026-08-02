"use client";
import { useMemo, useState } from "react";
import { MissionCard, MissionHangarEmpty } from "./mission-card";
import { TimelineReactor } from "./timeline-reactor";
import { HoloWebsite } from "./holo-website";
import { StatsHolo, HolographicChart } from "./stats-holo";
import { CommHub } from "./comm-hub";
import { NotificationCore } from "./notification-core";
import { HistoryMatrix } from "./history-matrix";
import { SupportAI } from "./support-ai";
import { FileVaultUI } from "./file-vault-ui";
import { ApprovalBay } from "./approval-bay";
import { MissionCompleteCelebration } from "./celebration";
import { getMissionCode, mapStatusToStageIndex } from "./mission-utils";
import { useSwipe } from "./use-swipe";
import { Rocket, LayoutGrid, Map, Radio, Database, Shield, Orbit, Zap, Globe, Activity, Sparkles } from "lucide-react";

export function MissionControlOverview({ 
  profile, 
  projects = [], 
  messages = [], 
  notifications = [],
  stats,
}: { 
  profile: any; 
  projects: any[]; 
  messages: any[]; 
  notifications: any[]; 
  stats?: any;
}) {
  const [selectedMissionIdx, setSelectedMissionIdx] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const selectedProject = projects[selectedMissionIdx] || projects[0];

  const activeStage = useMemo(()=> selectedProject ? mapStatusToStageIndex(selectedProject.status) : 3, [selectedProject]);
  const isComplete = selectedProject?.status?.toLowerCase?.().includes("complet");

  const swipe = useSwipe(
    ()=> setSelectedMissionIdx(i => Math.min(i+1, projects.length-1)),
    ()=> setSelectedMissionIdx(i => Math.max(i-1, 0))
  );

  // auto celebration if completed
  // useEffect in parent could trigger, but simple check:
  if (isComplete && !showCelebration && typeof window !== "undefined") {
    // only show once per session
    const key = `celebrated_${selectedProject?.id}`;
    if (!sessionStorage.getItem(key)) {
      // delay
      setTimeout(()=>setShowCelebration(true), 800);
      sessionStorage.setItem(key, "1");
    }
  }

  const codename = selectedProject ? getMissionCode(selectedMissionIdx, selectedProject.reference) : "MISSION ALPHA";

  return (
    <div className="space-y-6 touch-pan-y" {...swipe}>
      {showCelebration && <MissionCompleteCelebration missionName={codename} onClose={()=>setShowCelebration(false)} />}

      {/* Welcome Command Bar */}
      <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 md:p-7 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.22),transparent_60%)] blur-[20px]" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_60%)] blur-[24px]" />
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-rose-500 to-violet-600 text-white font-black text-[20px] shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                {profile?.full_name?.slice(0,2).toUpperCase() || "CM"}
              </div>
              <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 border-2 border-[#0e101a]"><div className="h-2 w-2 rounded-full bg-black animate-ping absolute" /><div className="h-2 w-2 rounded-full bg-black relative" /></div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] md:text-[26px] font-black tracking-tight text-white leading-none">Welcome back, Commander {profile?.full_name?.split(" ")[0] || ""}</h1>
                <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-emerald-300"><Activity className="h-3 w-3" /> SYSTEMS NOMINAL</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-white/50">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Orbit className="h-3 w-3 text-cyan-400" /> CLEARANCE: LEVEL 8</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Shield className="h-3 w-3 text-violet-400" /> {projects.length} MISSIONS • {notifications.filter((n:any)=>!n.is_read).length} ALERTS</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Radio className="h-3 w-3 text-rose-400" /> QUANTUM LINK STABLE</span>
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/55">You are inside Mission Control — your living digital command center. Watch your project come alive in real-time. Every transmission is encrypted and synced with Admin Tower via Supabase Realtime.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href="/service-district" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-black tracking-widest text-black shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:bg-white/90 transition-colors"><Rocket className="h-4 w-4" /> LAUNCH NEW MISSION</a>
            <a href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-[12px] font-bold tracking-widest text-white hover:bg-white/[0.10] transition-colors"><Globe className="h-4 w-4" /> Surface Link</a>
          </div>
        </div>
      </div>

      {projects.length===0 ? (
        <MissionHangarEmpty onLaunch={()=>{}} />
      ) : (
        <>
          {/* Mission Selector + Stats */}
          <div className="grid lg:grid-cols-[380px_1fr] gap-5 items-start">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-white uppercase"><LayoutGrid className="h-4 w-4 text-white/60" /> Active Missions</span>
                <span className="text-[10px] font-mono text-white/30">{projects.length} vessels docked</span>
              </div>
              <div className="grid gap-3">
                {projects.map((p:any, idx:number)=><MissionCard key={p.id} project={p} index={idx} isSelected={idx===selectedMissionIdx} onEnter={()=>setSelectedMissionIdx(idx)} />)}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <HolographicChart title={`${codename} • Activity Pulse`} />
              </div>
            </div>

            <div className="space-y-5">
              {/* Stats */}
              <StatsHolo project={selectedProject} filesCount={ (selectedProject?.uploaded_files?.length||0)+(selectedProject?.internal_files?.length||0)} projectCount={projects.length} />

              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5">
                <HoloWebsite status={selectedProject?.status || "development"} title={`${codename} • ${selectedProject?.website_type || "Web Protocol"}`} />
                <TimelineReactor status={selectedProject?.status || "development"} project={selectedProject} />
              </div>
            </div>
          </div>

          {/* Secondary Decks */}
          <div className="grid lg:grid-cols-2 gap-5">
            <FileVaultUI projects={projects} />
            <ApprovalBay project={selectedProject} />
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
            <CommHub projects={projects} initialMessages={messages} profile={profile} selectedProjectIdProp={selectedProject?.id} />
            <div className="space-y-5">
              <NotificationCore notifications={notifications.length? notifications : mockNotifications(selectedProject)} />
              <HistoryMatrix project={selectedProject} />
            </div>
          </div>

          <SupportAI />

          {/* Footer Mission Meta */}
          <div className="rounded-[22px] border border-white/10 bg-black/30 px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-white/30">
            <span className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-amber-300" /> Mission Control v8 • Client Universe • Architect: Rahat Ahmed • Supabase Realtime • Encrypted Vault • Future-ready: Team collab, Video, AI code review, Mobile push (queued)</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-violet-400" /> Built for daily return — holograms evolve as your project grows</span>
          </div>
        </>
      )}
    </div>
  );
}

function mockNotifications(project: any): any[] {
  if (!project) return [];
  return [
    { id: "n1", title: `New Design Concept for ${project.reference}`, body: "Mission Control uploaded 2 new UI concepts to Approval Bay. Review required to unlock Development thrust.", type: "info", created_at: new Date(Date.now()-1000*60*30).toISOString(), link: "/dashboard/revisions", is_read: false },
    { id: "n2", title: "File Vault Secured", body: "Your requirement files have been encrypted and sealed. Check File Vault for integrity hash.", type: "success", created_at: new Date(Date.now()-1000*60*120).toISOString(), is_read: false },
    { id: "n3", title: `Transmission from Engineer`, body: "We’ve completed Planning phase and are moving to UI/UX. Expect live holographic growth soon.", type: "info", created_at: new Date(Date.now()-1000*60*240).toISOString(), is_read: true },
  ];
}
