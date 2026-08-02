"use client";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Rocket, Database, MessageSquareMore, CheckCircle2, 
  FileStack, Bell, User, LogOut, Sparkles, Globe, Orbit
} from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

interface NavItem {
  href: string;
  label: string;
  bn: string;
  icon: any;
  badge?: number;
}

export function OrbitalNav({ unread = 0, missionCount = 0 }: { unread?: number; missionCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Command Deck", bn: "কমান্ড ডেক", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Mission Hangar", bn: "মিশন হ্যাঙ্গার", icon: Rocket, badge: missionCount },
    { href: "/dashboard/files", label: "File Vault", bn: "ফাইল ভল্ট", icon: Database },
    { href: "/dashboard/messages", label: "Comms Hub", bn: "যোগাযোগ", icon: MessageSquareMore },
    { href: "/dashboard/revisions", label: "Approval Bay", bn: "অনুমোদন", icon: CheckCircle2 },
    { href: "/dashboard/invoices", label: "Resource Core", bn: "রিসোর্স", icon: FileStack },
  ];

  const handleLogout = () => start(async () => {
    const r = await logoutAction();
    if (r.success) { router.refresh(); router.push("/login"); }
  });

  const NavLink = (item: NavItem) => {
    const active = pathname === item.href;
    const Icon = item.icon;
    return (
      <a
        key={item.href}
        href={item.href}
        onClick={()=>setMobileOpen(false)}
        className={`group relative flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-[13px] font-medium tracking-wide transition-all duration-500
          ${active 
            ? "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(244,63,94,0.18),rgba(99,102,241,0.12))] border border-rose-500/30 text-white shadow-[0_0_20px_rgba(244,63,94,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "border border-white/[0.06] bg-white/[0.02] text-white/55 hover:text-white hover:bg-white/[0.06] hover:border-white/10 hover:translate-x-1"
          }`}
      >
        {active && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-full bg-gradient-to-b from-rose-400 to-violet-400 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500/0 via-violet-500/0 to-cyan-500/0 opacity-60 group-hover:opacity-100 transition-opacity" />
          </>
        )}
        <div className={`relative grid h-9 w-9 place-items-center rounded-xl border text-[14px] transition-all duration-500
          ${active ? "bg-white/10 border-white/15 text-white shadow-inner" : "bg-white/[0.03] border-white/[0.06] text-white/60 group-hover:text-white"}`}>
          <Icon className="h-4.5 w-4.5" />
          {item.badge && item.badge>0 ? (
            <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]">{item.badge}</span>
          ) : null}
        </div>
        <div className="relative flex flex-col leading-none">
          <span className={`${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
          <span className="mt-1 text-[10px] font-medium tracking-widest opacity-60 uppercase">{item.bn}</span>
        </div>
        {active && <div className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />}
      </a>
    );
  };

  return (
    <>
      {/* Desktop Orbital Dock */}
      <aside className="hidden md:flex w-[310px] shrink-0 flex-col gap-5 p-4 pr-2">
        {/* Brand Capsule */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 backdrop-blur-xl">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.22),transparent_70%)] blur-[20px]" />
          <div className="relative flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-violet-600 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.4)]">
              <Orbit className="h-6 w-6" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-rose-500/30 to-violet-600/30 blur-[8px] -z-10" />
            </div>
            <div>
              <div className="text-[13px] font-black tracking-[0.14em] text-white">RAHAT.SYS</div>
              <div className="text-[10px] font-bold tracking-[0.22em] text-rose-300">MISSION CONTROL v8</div>
            </div>
            <div className="ml-auto flex flex-col items-end gap-1">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[8px] font-bold tracking-widest text-emerald-300">ONLINE</span>
              <span className="text-[9px] font-mono text-white/30">LVL 8 CLEARANCE</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="text-[9px] tracking-widest text-white/40 uppercase">Active Missions</div>
              <div className="text-[18px] font-black text-white">{missionCount || "—"}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="text-[9px] tracking-widest text-white/40 uppercase">System Sync</div>
              <div className="flex items-center gap-1 text-[12px] font-bold text-cyan-300"><span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" /> 100%</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1 thin-scrollbar">
          {nav.map(NavLink)}
        </nav>

        <div className="space-y-2">
          <a href="/dashboard/notifications" className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-[13px] transition-all ${pathname==="/dashboard/notifications" ? "border-rose-500/30 bg-white/5 text-white" : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"}`}>
            <span className="flex items-center gap-3"><Bell className="h-4 w-4" /> Notifications</span>
            {unread>0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">{unread}</span>}
          </a>
          <a href="/dashboard/profile" className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-[13px] transition-all ${pathname==="/dashboard/profile" ? "border-white/20 bg-white/5 text-white" : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"}`}>
            <User className="h-4 w-4" /> Crew Profile
          </a>
          <button onClick={handleLogout} disabled={pending} className="flex w-full items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] font-medium text-rose-300 hover:bg-rose-500/20 transition-colors">
            <LogOut className="h-4 w-4" /> {pending ? "Disconnecting..." : "Abort Session"}
          </button>
          <a href="/" className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-2.5 text-[11px] font-bold tracking-widest text-white/50 hover:text-white uppercase"><Globe className="h-3.5 w-3.5" /> Exit to Surface • Website</a>
        </div>
      </aside>

      {/* Mobile Bottom Orbital Dock */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3">
        <div className="relative flex items-center justify-between gap-1 rounded-[24px] border border-white/10 bg-[#0a0d15]/90 p-2 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {nav.slice(0,5).map(item=>{
            const active = pathname===item.href;
            const Icon=item.icon;
            return (
              <a key={item.href} href={item.href} className={`relative grid h-12 w-12 place-items-center rounded-2xl transition-all ${active ? "bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.4)] scale-110" : "bg-white/[0.06] text-white/60"}`}>
                <Icon className="h-5 w-5" />
                {item.badge && item.badge>0 && <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{item.badge}</span>}
              </a>
            )
          })}
          <button onClick={()=>setMobileOpen(!mobileOpen)} className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-violet-600 text-white shadow-[0_0_18px_rgba(244,63,94,0.4)]">
            <Sparkles className="h-5 w-5" />
          </button>
        </div>
        {mobileOpen && (
          <div className="mt-3 rounded-[28px] border border-white/10 bg-[#0f111a]/95 p-4 backdrop-blur-2xl animate-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-2">
              {nav.map(item=>{
                const active=pathname===item.href;
                const Icon=item.icon;
                return <a key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-[11px] ${active ? "border-rose-500/40 bg-rose-500/15 text-white" : "border-white/10 bg-white/[0.03] text-white/60"}`}><Icon className="h-5 w-5" />{item.label}</a>
              })}
              <a href="/dashboard/notifications" onClick={()=>setMobileOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center text-[11px] text-white/60"><Bell className="h-5 w-5" />Alerts {unread>0 && `(${unread})`}</a>
              <a href="/dashboard/profile" onClick={()=>setMobileOpen(false)} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center text-[11px] text-white/60"><User className="h-5 w-5" />Profile</a>
              <button onClick={handleLogout} className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-bold text-rose-300"><LogOut className="h-4 w-4" /> Abort Session</button>
            </div>
          </div>
        )}
      </div>
      <style>{`.thin-scrollbar::-webkit-scrollbar{width:4px} .thin-scrollbar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:999px}`}</style>
    </>
  );
}
