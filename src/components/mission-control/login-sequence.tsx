"use client";
import { useEffect, useState } from "react";
import { Shield, Radio, Cpu, Fingerprint, Lock, Zap, Activity, Orbit } from "lucide-react";
import { Starfield } from "./starfield";

export function LoginSequence({ children, onComplete }: { children: React.ReactNode; onComplete?: () => void }) {
  const [phase, setPhase] = useState<"scanning"|"decrypt"|"entering"|"done">("scanning");
  const [progress, setProgress] = useState(0);

  useEffect(()=>{
    const phases: Array<{ p: typeof phase, duration: number }> = [
      { p: "scanning", duration: 900 },
      { p: "decrypt", duration: 800 },
      { p: "entering", duration: 700 },
    ];
    let idx=0;
    const interval = setInterval(()=>{
      setProgress(prev=>{
        const next = prev+ (Math.random()*6+2);
        if (next>=100) {
          if (idx < phases.length-1) {
            idx++;
            setPhase(phases[idx].p);
            return 0;
          } else {
            setPhase("done");
            clearInterval(interval);
            setTimeout(()=>onComplete?.(), 420);
            return 100;
          }
        }
        return next;
      });
    }, 30);
    // auto phase changes fallback
    const t0 = setTimeout(()=>setPhase("decrypt"), 950);
    const t1 = setTimeout(()=>setPhase("entering"), 1850);
    const t2 = setTimeout(()=>{ setPhase("done"); onComplete?.(); }, 2700);
    return ()=>{ clearInterval(interval); clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); }
  },[onComplete]);

  if (phase==="done") return (
    <div className="animate-[fadeIn_0.6s_ease_both]">
      {children}
      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(10px) scale(0.98) } to { opacity:1; transform: translateY(0) scale(1) } }`}</style>
    </div>
  );

  return (
    <div className="relative min-h-[85vh] grid place-items-center overflow-hidden bg-[#05070d] py-12">
      <Starfield density={120} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(244,63,94,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(5,7,13,0.9)_80%)]" />

      <div className="relative w-full max-w-lg px-5">
        {/* Top HUD */}
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase"><Shield className="h-3.5 w-3.5 text-emerald-400" /> SECURE ACCESS • LEVEL 8</div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40"><Radio className="h-3 w-3 text-cyan-400 animate-pulse" /> QUANTUM LINK</div>
        </div>

        {/* Center capsule */}
        <div className="relative mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(99,102,241,0.18)]">
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.22),transparent_60%)] blur-[16px]" />
          
          <div className="relative">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[#0e101a] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="relative">
                <Orbit className="h-9 w-9 text-white animate-spin" style={{ animationDuration: "4s" }} />
                <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="text-[11px] font-black tracking-[0.3em] text-cyan-300">MISSION CONTROL • ACCESS NODE</div>
              <h1 className="mt-2 text-[26px] font-black tracking-tight text-white leading-none">
                {phase==="scanning" && "SCANNING BIOMETRICS..."}
                {phase==="decrypt" && "DECRYPTING VAULT..."}
                {phase==="entering" && "ENTERING COMMAND DECK..."}
              </h1>
              <div className="mt-2 text-[12px] font-mono text-white/40">
                {phase==="scanning" && "Fingerprint • Retinal • Quantum ID"}
                {phase==="decrypt" && "AES-256 • SHA-512 • Temporal key"}
                {phase==="entering" && "Docking clearance: GRANTED • Welcome Commander"}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40"><span>{phase.toUpperCase()} PHASE</span><span>{Math.round(progress)}%</span></div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-gradient-to-r from-rose-400 via-violet-400 to-cyan-400 transition-all duration-100" style={{ width: `${progress}%` }}>
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.2s_linear_infinite]" style={{ backgroundSize: "40px 100%" }} />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { icon: Fingerprint, label: "Identity", ok: phase!=="scanning" || progress>30 },
                  { icon: Lock, label: "Vault", ok: phase==="entering" || phase==="decrypt" && progress>50 },
                  { icon: Activity, label: "Link", ok: phase==="entering" },
                ].map((s,i)=>{
                  const Icon=s.icon;
                  return (
                    <div key={i} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-widest transition-all ${s.ok ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/[0.03] text-white/30"}`}>
                      <Icon className="h-3.5 w-3.5" /> {s.label} {s.ok?"✓":"•••"}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-mono text-white/30">
              <Cpu className="h-3 w-3 text-violet-400" /> NOVA AI • Analyzing secure enclave • No data leaves vault
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-white/20 uppercase"><Zap className="h-3 w-3" /> Cinematic transition • 2.7s • Premium immersive • Skip detectable</div>
      </div>

      <style>{`
        @keyframes shimmer { from { transform: translateX(-40px) } to { transform: translateX(40px) } }
      `}</style>
    </div>
  );
}
