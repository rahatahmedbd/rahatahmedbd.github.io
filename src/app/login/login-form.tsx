"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, Loader2, Info, Shield, Radio, Orbit, Fingerprint, Zap, Cpu } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { Starfield, NebulaGlow } from "@/components/mission-control/starfield";
import { LoginSequence } from "@/components/mission-control/login-sequence";

interface LoginFormProps {
  adminExists: boolean;
}

export function LoginForm({ adminExists }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [cinemaDone, setCinemaDone] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false); // after successful auth
  const [accessPhase, setAccessPhase] = useState<"idle"|"verifying"|"granted">("idle");

  const nextDestination = searchParams.get("next") || "/dashboard";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setAccessPhase("verifying");

    startTransition(async () => {
      const res = await loginAction({ email, password, rememberMe });
      if (!res.success) {
        setAccessPhase("idle");
        if ((res as any).errors) setFieldErrors((res as any).errors);
        else setError((res as any).error || "Invalid email or password");
        return;
      }
      setAccessPhase("granted");
      setShowCinematic(true);
      // delay then redirect with cinematic transition
      setTimeout(()=>{
        router.refresh();
        router.push(nextDestination);
      }, 2600);
    });
  };

  if (showCinematic) {
    return (
      <div className="relative min-h-screen bg-[#05070d] overflow-hidden">
        <Starfield density={160} />
        <NebulaGlow />
        <div className="relative z-10 min-h-screen grid place-items-center p-6">
          <div className="w-full max-w-lg rounded-[32px] border border-white/15 bg-[linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))] p-8 backdrop-blur-2xl shadow-[0_0_80px_rgba(99,102,241,0.35)] text-center animate-[scaleIn_0.7s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-[0_0_30px_rgba(52,211,153,0.6)]">
              <Shield className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-[28px] font-black tracking-tight text-white">ACCESS GRANTED</h2>
            <p className="mt-2 text-[13px] text-white/60 leading-relaxed">Identity verified • Quantum encryption locked • Warp gate to Mission Control opening...</p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 animate-[shimmer_1.2s_linear_infinite]" style={{ backgroundSize: "60px 100%" }} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-white/40 uppercase">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" /> Transporting to Command Deck...
            </div>
          </div>
        </div>
        <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(0.94) translateY(12px) } to { opacity:1; transform:scale(1) translateY(0) } } @keyframes shimmer { from { transform: translateX(-60px) } to { transform: translateX(60px) } }`}</style>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070d]">
      <Starfield density={180} />
      <NebulaGlow />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(5,7,13,0.85)_85%)]" />

      {/* Top subtle HUD */}
      <div className="relative z-10 flex h-[52px] items-center justify-between border-b border-white/[0.06] bg-black/20 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-black font-black text-[12px] shadow-[0_0_18px_rgba(255,255,255,0.3)]"><Orbit className="h-4 w-4" /></div>
          <span className="text-[11px] font-black tracking-[0.22em] text-white/80">RAHAT.SYS • MISSION CONTROL</span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-emerald-300">SECURE NODE</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-white/40">
          <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> LINK STABLE</span>
          <span>QUANTUM ENCRYPTION: ACTIVE</span>
        </div>
      </div>

      <div className="relative z-10 min-h-[calc(100vh-52px)] grid place-items-center px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] gap-10 max-w-6xl mx-auto">
        {/* Left Hero */}
        <div className="hidden lg:block space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase"><Zap className="h-3.5 w-3.5 text-amber-300" /> Level 8 Clearance Required • Client Universe</div>
          <h1 className="text-[52px] font-black leading-[0.92] tracking-[-0.03em] text-white">
            ENTER<br />
            <span className="bg-gradient-to-r from-rose-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">MISSION</span><br />
            CONTROL
          </h1>
          <p className="max-w-md text-[14px] leading-relaxed text-white/55">This is not a normal dashboard. A living command center where your website mission comes alive. Track holographic builds, approve milestones, chat via quantum link, and watch your digital spacecraft launch.</p>
          
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {[
              { k: "Missions", v: "Live Holograms", icon: Orbit },
              { k: "Vault", v: "AES-256 Secured", icon: Shield },
              { k: "Comms", v: "Real-time Sync", icon: Radio },
              { k: "Engine", v: "Supabase", icon: Cpu },
            ].map(item=>{
              const Icon=item.icon;
              return (
                <div key={item.k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-white/60" />
                  <div className="mt-2 text-[12px] font-bold text-white">{item.k}</div>
                  <div className="text-[11px] text-white/40">{item.v}</div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 w-fit">
            <Fingerprint className="h-4 w-4 text-violet-400" />
            <span className="text-[11px] font-mono text-white/50">Biometric + Quantum ID • Session encrypted • Activity logged</span>
          </div>
        </div>

        {/* Right Login Card — cinematic wrapper */}
        <div className="w-full max-w-[420px]">
          {!adminExists && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-[12px] text-amber-200 backdrop-blur">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <div><p className="font-bold">No Super Admin Configured</p><p className="mt-1 text-[11px] text-amber-200/70">System needs initial super admin to orchestrate Mission Control tower.</p><a href="/init-super-admin" className="mt-2 inline-block text-[11px] font-bold underline">Initialize Super Admin →</a></div>
            </div>
          )}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.25),transparent_60%)] blur-[18px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_60%)] blur-[18px]" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-black shadow-[0_0_22px_rgba(255,255,255,0.35)]"><LogIn className="h-6 w-6" /></div>
                <div>
                  <h2 className="text-[18px] font-black tracking-tight text-white leading-none">SECURE ENTRY</h2>
                  <p className="mt-1 text-[11px] font-mono tracking-widest text-white/40 uppercase">Encrypted tunnel • Mission Control v8</p>
                </div>
                <div className="ml-auto rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-bold tracking-widest text-white/50">ID VERIFY</div>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-[12px] text-rose-300">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /><p>{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase" htmlFor="email">Commander Email • Access ID</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                    <input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="commander@mission.control" className="h-12 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[14px] text-white placeholder:text-white/25 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all" />
                  </div>
                  {fieldErrors.email && <p className="text-[11px] text-rose-400 pl-3">{fieldErrors.email[0]}</p>}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase" htmlFor="password">Quantum Passkey</label>
                    <a href="/forgot-password" className="text-[11px] font-medium text-violet-300 hover:text-violet-200 transition-colors">Forgot?</a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
                    <input id="password" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••••••" className="h-12 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[14px] text-white placeholder:text-white/25 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-400/20 outline-none transition-all" />
                  </div>
                  {fieldErrors.password && <p className="text-[11px] text-rose-400 pl-3">{fieldErrors.password[0]}</p>}
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-black/40 text-white focus:ring-0" />
                  <span className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors">Maintain quantum link • Remember this vessel</span>
                </label>

                <button type="submit" disabled={isPending} className="relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black font-black tracking-[0.12em] text-[13px] shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:bg-white/90 disabled:opacity-60 transition-all">
                  {accessPhase==="verifying" && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-[shimmer_1s_linear_infinite]" style={{ backgroundSize: "80px 100%" }} />}
                  {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> {accessPhase==="verifying" ? "VERIFYING QUANTUM ID..." : "AUTHORIZING..."}</> : <><Orbit className="h-4 w-4" /> ENTER MISSION CONTROL</>}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/25">
                  <Shield className="h-3 w-3" /> Protected by AES-256 • Role-locked routes • Activity logged
                </div>
              </form>
            </div>
          </div>

          <div className="mt-4 text-center text-[11px] text-white/30">New commander? Launch a project in <a href="/service-district" className="text-white/70 underline hover:text-white">Service District</a> to auto-generate access.</div>
        </div>
      </div>

      <style>{`@keyframes shimmer { from { transform: translateX(-80px) } to { transform: translateX(80px) } }`}</style>
    </div>
  );
}
