"use client";
import { useEffect, useState } from "react";
import { formatCountdown } from "./mission-utils";

function AnimatedCounter({ value, suffix="" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(()=>{
    let start = 0;
    const end = value;
    if (end===0) { setDisplay(0); return; }
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const prog = Math.min((now-startTime)/duration,1);
      const eased = 1 - Math.pow(1-prog,3);
      setDisplay(Math.floor(eased*end));
      if (prog<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },[value]);
  return <span>{display}{suffix}</span>;
}

export function StatsHolo({ project, projectCount, filesCount, revisionsCount }: { project?: any; projectCount?: number; filesCount?: number; revisionsCount?: number }) {
  const countdown = formatCountdown(project?.final_delivery || project?.estimated_delivery || null);
  const stagePct = project ? Math.round((( (project?.status ? 3 : 0)+1)/9)*100) : 72;
  // Allow both aggregated and single mission view

  const stats = [
    { label: "Mission Progress", bn: "অগ্রগতি", value: project ? stagePct : 0, suffix: "%", color: "from-rose-400 to-violet-400", sub: project?.status || "Operational" },
    { label: "Time Remaining", bn: "সময় বাকি", value: countdown.days, suffix: "D", color: "from-cyan-400 to-blue-400", sub: countdown.label },
    { label: "Files Uploaded", bn: "ফাইল", value: filesCount ?? (project?.uploaded_files?.length||0)+(project?.internal_files?.length||0), suffix: "", color: "from-amber-300 to-orange-400", sub: "Vault secured" },
    { label: "Revisions Used", bn: "রিভিশন", value: revisionsCount ?? 1, suffix: "", color: "from-emerald-400 to-teal-400", sub: "Approval bay" },
    { label: "Team Activity", bn: "টিম", value: 84, suffix: "%", color: "from-violet-400 to-fuchsia-400", sub: "Crew active" },
    { label: "Est. Launch", bn: "লঞ্চ", value: countdown.days>0?1:0, suffix: countdown.days<=0?" NOW":"", color: "from-white to-white/60", sub: project?.final_delivery || project?.estimated_delivery || "TBD" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {stats.map((s,i)=>(
        <div key={i} className="group relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-4 backdrop-blur-xl transition-all duration-500 hover:border-white/15 hover:-translate-y-0.5">
          <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)] blur-[8px] group-hover:bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_60%)] transition-all" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-[0.18em] text-white/40 uppercase">{s.label}</span>
              <span className="text-[8px] font-mono text-white/25">{s.bn}</span>
            </div>
            <div className={`mt-2 bg-gradient-to-br ${s.color} bg-clip-text text-[26px] font-black leading-none tracking-tight text-transparent`}>
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-[10px] font-medium text-white/50 truncate">{s.sub}</div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className={`h-full bg-gradient-to-r ${s.color} transition-all duration-1000`} style={{ width: `${Math.min(100, (s.value/(s.label.includes("Progress")?100: s.label.includes("Time")?30:20))*100 || 60)}%`, transitionDelay: `${i*90}ms` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HolographicChart({ title="Activity Pulse" }: { title?: string }) {
  const points = [18,34,22,48,38,62,55,78,64,88,72,90];
  return (
    <div className="relative rounded-[22px] border border-white/[0.08] bg-black/40 p-4 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black tracking-[0.2em] text-white uppercase">{title}</span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LIVE</span>
      </div>
      <div className="relative mt-4 h-[84px] w-full">
        <svg viewBox="0 0 200 80" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(244,63,94,0.5)" />
              <stop offset="100%" stopColor="rgba(244,63,94,0)" />
            </linearGradient>
            <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path d={`M0 ${80-points[0]} ${points.map((p,i)=>`L ${(i/ (points.length-1))*200} ${80-p}`).join(" ")} L 200 80 L 0 80 Z`} fill="url(#g1)" />
          <path d={`M0 ${80-points[0]} ${points.map((p,i)=>`L ${(i/(points.length-1))*200} ${80-p}`).join(" ")}`} fill="none" stroke="url(#line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p,i)=>(
            <circle key={i} cx={(i/(points.length-1))*200} cy={80-p} r={i===points.length-1?4:2.2} fill={i===points.length-1?"#22d3ee":"white"} className={i===points.length-1?"animate-pulse":""} />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[9px] font-mono text-white/30"><span>00:00</span><span>12:00</span><span>23:59</span></div>
    </div>
  );
}
