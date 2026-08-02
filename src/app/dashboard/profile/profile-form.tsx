"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Lock, Camera, CheckCircle, AlertCircle, Loader2, KeyRound, Shield, Orbit, Zap } from "lucide-react";
import { updateClientDetailsAction, updateClientAvatarAction } from "@/app/actions/profile";
import { changePasswordAction } from "@/app/actions/auth";

export function ClientProfileForm({ profile, email }: { profile: any; email: string }) {
  const router = useRouter();
  const [pendingDetails, startDetails] = useTransition();
  const [pendingPw, startPw] = useTransition();
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [detailsSuccess, setDetailsSuccess] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsSuccess(null); setDetailsError(null);
    startDetails(async()=>{
      const resName = await updateClientDetailsAction({ fullName, phone: phone||undefined });
      if (!resName.success) { setDetailsError(resName.error||"Failed"); return; }
      if (avatarUrl!==profile.avatar_url) {
        const resAvatar = await updateClientAvatarAction(avatarUrl);
        if (!resAvatar.success) { setDetailsError(resAvatar.error||"Avatar failed"); return; }
      }
      setDetailsSuccess("Crew profile updated • Synced with Mission Control tower");
      router.refresh();
    });
  };

  const handlePw = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSuccess(null); setPwError(null);
    startPw(async()=>{
      const res = await changePasswordAction({ currentPassword, newPassword, confirmPassword });
      if (!res.success) { setPwError(res.error||"Failed"); return; }
      setPwSuccess("Quantum passkey rotated successfully • All sessions re-encrypted");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"><User className="h-6 w-6" /></div>
          <div><h1 className="text-[20px] font-black tracking-tight text-white leading-none">CREW PROFILE • IDENTITY NODE</h1><p className="mt-1 text-[11px] text-white/40 uppercase tracking-widest">Biometric • Contact • Quantum passkey • Encrypted vault</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <div className="space-y-4 lg:sticky top-6">
          <div className="rounded-[24px] border border-white/10 bg-[#0c0e18] p-6 text-center">
            <div className="relative mx-auto h-24 w-24 group">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-black border-2 border-white/15 grid place-items-center">
                {avatarUrl ? <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" /> : <User className="h-10 w-10 text-white/30" />}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 grid place-items-center transition-opacity"><Camera className="h-5 w-5 text-white" /></div>
              <div className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 border-2 border-[#0c0e18]"><div className="h-2 w-2 rounded-full bg-black animate-pulse" /></div>
            </div>
            <h3 className="mt-4 text-[16px] font-black text-white">{fullName}</h3>
            <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-violet-300 uppercase">Commander • Level 8 Clearance</p>
            <div className="mt-5 space-y-2 text-left rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex justify-between text-[11px]"><span className="text-white/40">Email</span><span className="text-white font-medium truncate max-w-[140px]">{email}</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-white/40">Status</span><span className="text-emerald-300 font-bold">Active • Verified</span></div>
              <div className="flex justify-between text-[11px]"><span className="text-white/40">Vessel</span><span className="text-white/70">RAHAT.SYS Client</span></div>
              <div className="mt-3 h-px bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/30"><Shield className="h-3 w-3 text-emerald-400" /> Identity secured • E2E encrypted</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3"><Orbit className="h-4 w-4 text-cyan-400" /><h3 className="text-[13px] font-black tracking-widest text-white uppercase">Contact Details • Transmit Update</h3></div>
            <form onSubmit={handleDetails} className="mt-5 space-y-4">
              {detailsError && <div className="flex gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[12px] text-rose-300"><AlertCircle className="h-4 w-4 shrink-0" />{detailsError}</div>}
              {detailsSuccess && <div className="flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[12px] text-emerald-300"><CheckCircle className="h-4 w-4 shrink-0" />{detailsSuccess}</div>}
              <div>
                <label className="text-[10px] tracking-widest text-white/40 uppercase">Full Name • Commander Identity</label>
                <div className="relative mt-1"><User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" /><input value={fullName} onChange={e=>setFullName(e.target.value)} required className="h-11 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[13px] text-white focus:border-white/20 outline-none" /></div>
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-white/40 uppercase">Phone • Quantum Link</label>
                <div className="relative mt-1"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" /><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" className="h-11 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[13px] text-white placeholder:text-white/20 focus:border-white/20 outline-none" /></div>
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-white/40 uppercase">Avatar URL • Visual Identity</label>
                <input value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://..." className="mt-1 h-11 w-full rounded-full border border-white/10 bg-black/40 px-4 text-[13px] text-white placeholder:text-white/20 focus:border-white/20 outline-none" />
              </div>
              <button type="submit" disabled={pendingDetails} className="rounded-full bg-white px-6 py-3 text-[12px] font-black tracking-widest text-black hover:bg-white/90 disabled:opacity-50 flex items-center gap-2">{pendingDetails ? <><Loader2 className="h-4 w-4 animate-spin" /> Syncing...</> : <><Zap className="h-4 w-4" /> Save Identity</>}</button>
            </form>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3"><KeyRound className="h-4 w-4 text-amber-300" /><h3 className="text-[13px] font-black tracking-widest text-white uppercase">Quantum Passkey • Rotate</h3></div>
            <form onSubmit={handlePw} className="mt-5 space-y-4">
              {pwError && <div className="flex gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[12px] text-rose-300"><AlertCircle className="h-4 w-4 shrink-0" />{pwError}</div>}
              {pwSuccess && <div className="flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[12px] text-emerald-300"><CheckCircle className="h-4 w-4 shrink-0" />{pwSuccess}</div>}
              <div>
                <label className="text-[10px] tracking-widest text-white/40 uppercase">Current Quantum Key</label>
                <div className="relative mt-1"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" /><input type="password" required value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[13px] text-white outline-none" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-[10px] tracking-widest text-white/40 uppercase">New Passkey</label><div className="relative mt-1"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" /><input type="password" required value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[13px] text-white outline-none" /></div></div>
                <div><label className="text-[10px] tracking-widest text-white/40 uppercase">Confirm New</label><div className="relative mt-1"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" /><input type="password" required value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-full border border-white/10 bg-black/40 pl-11 pr-4 text-[13px] text-white outline-none" /></div></div>
              </div>
              <button type="submit" disabled={pendingPw} className="rounded-full bg-white px-6 py-3 text-[12px] font-black tracking-widest text-black hover:bg-white/90 disabled:opacity-50 flex items-center gap-2">{pendingPw ? <><Loader2 className="h-4 w-4 animate-spin" /> Rotating...</> : "Rotate Passkey"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
