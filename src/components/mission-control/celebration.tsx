"use client";
import { useEffect, useState } from "react";
import { Rocket, Sparkles, Trophy, Zap, Star } from "lucide-react";

export function MissionCompleteCelebration({ missionName = "MISSION ALPHA", onClose }: { missionName?: string; onClose?: () => void }) {
  const [show, setShow] = useState(true);
  const [confetti, setConfetti] = useState<{ x:number; y:number; r:number; c:string; delay:number }[]>([]);

  useEffect(()=>{
    setConfetti(Array.from({ length: 42 }, ()=>({
      x: Math.random()*100,
      y: Math.random()*100,
      r: Math.random()*8+4,
      c: ["#f43f5e","#8b5cf6","#22d3ee","#fbbf24","#34d399"][Math.floor(Math.random()*5)],
      delay: Math.random()*0.8,
    })));
    const timer = setTimeout(()=>setShow(false), 9000);
    return ()=>clearTimeout(timer);
  },[]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-[#05070d]/90 backdrop-blur-xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((p,i)=>(
          <div key={i} className="absolute rounded-full animate-[celePop_1.2s_ease-out_both]" style={{ left: `${p.x}%`, top: `${-10}%`, width: p.r, height: p.r, background: p.c, animationDelay: `${p.delay}s`, boxShadow: `0 0 12px ${p.c}` }} />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(244,63,94,0.22),transparent_70%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: "48px 48px", maskImage: "radial-gradient(60% 60% at 50% 50%, black, transparent 85%)" }} />
      </div>

      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/15 bg-[linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-8 text-center shadow-[0_0_80px_rgba(244,63,94,0.35)] backdrop-blur-2xl animate-[scaleIn_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.35),transparent_60%)] blur-[30px]" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.35),transparent_60%)] blur-[30px]" />

        <div className="relative">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 text-black shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-[floatSlow_3s_ease-in-out_infinite]">
            <Trophy className="h-10 w-10" />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-[11px] font-black tracking-[0.2em] text-amber-300">
            <Star className="h-3.5 w-3.5" /> MISSION COMPLETE • 100% SUCCESS
          </div>

          <h2 className="mt-5 text-[32px] font-black leading-none tracking-tight text-white">{missionName} • ARCHIVED</h2>
          <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-white/60">Your spacecraft has successfully docked at Launch Station. Website deployed, Black Box sealed, and mission archived into permanent history. Commander, you are cleared for next launch.</p>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/30 p-3">
            {[{k:"Build Time",v:"25 Days"},{k:"Components",v:"84 Live"},{k:"Status",v:"Deployed ✓"}].map(i=>(
              <div key={i.k} className="rounded-xl bg-white/[0.04] px-3 py-2"><div className="text-[9px] tracking-widest text-white/40 uppercase">{i.k}</div><div className="mt-1 text-[13px] font-bold text-white">{i.v}</div></div>
            ))}
          </div>

          <div className="mt-6 flex gap-2 justify-center">
            <a href="/service-district" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-black tracking-widest text-black hover:bg-white/90 transition-colors"><Rocket className="h-4 w-4" /> LAUNCH NEW MISSION</a>
            <button onClick={()=>{ setShow(false); onClose?.(); }} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-[12px] font-bold tracking-widest text-white hover:bg-white/[0.10] transition-colors"><Sparkles className="h-4 w-4" /> Enter History</button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-white/30"><Zap className="h-3 w-3 text-amber-300" /> Mission archived • Fuel replenishing • Ready for immediate relaunch</div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn { 0% { opacity:0; transform:scale(0.92) translateY(12px) } 100% { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes celePop { 0% { transform: translateY(0) rotate(0) scale(0); opacity:0 } 10% { opacity:1 } 100% { transform: translateY(110vh) rotate(720deg) scale(1.2); opacity:0 } }
        @keyframes floatSlow { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
      `}</style>
    </div>
  );
}
