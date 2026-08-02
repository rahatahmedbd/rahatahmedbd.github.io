"use client";
import { Bell, Radio, File, MessageSquare, CheckCircle, Rocket, Zap, Clock, X } from "lucide-react";
import { useState } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: "info"|"success"|"warning";
  created_at: string;
  link?: string;
  is_read?: boolean;
}

export function NotificationCore({ notifications }: { notifications: NotificationItem[] }) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter(n=>!n.is_read).length;

  const markRead = (id:string)=> setItems(prev=>prev.map(n=>n.id===id?{...n,is_read:true}:n));
  const dismiss = (id:string)=> setItems(prev=>prev.filter(n=>n.id!==id));

  const iconMap: Record<string, any> = {
    info: Radio,
    success: CheckCircle,
    warning: Bell,
    file: File,
    message: MessageSquare,
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-[0_0_18px_rgba(251,191,36,0.4)]">
            <Bell className="h-5 w-5" />
            {unread>0 && <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-[0_0_10px_rgba(244,63,94,0.6)]">{unread}</span>}
          </div>
          <div>
            <div className="text-[13px] font-black tracking-[0.18em] text-white">NOTIFICATION CORE</div>
            <div className="text-[10px] tracking-widest text-white/40 uppercase">Real-time • Supabase Sync • Live Telemetry</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono text-white/50">{items.length} SIGNALS</span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-300">{unread} NEW</span>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto p-3 space-y-2">
        {items.length>0 ? items.map(n=>{
          const Icon = n.type==="success" ? CheckCircle : n.title.toLowerCase().includes("file") ? File : n.title.toLowerCase().includes("message") ? MessageSquare : n.title.toLowerCase().includes("mission") ? Rocket : Bell;
          return (
            <div key={n.id} className={`group relative flex gap-3 rounded-2xl border p-4 transition-all ${!n.is_read ? "border-cyan-400/20 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.12)]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${!n.is_read ? "bg-[#0c1a20] border-cyan-400/30 text-cyan-300" : "bg-white/[0.04] border-white/10 text-white/40"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[13px] font-bold text-white leading-tight">{n.title}</div>
                  <button onClick={()=>dismiss(n.id)} className="grid h-6 w-6 place-items-center rounded-full bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-colors"><X className="h-3.5 w-3.5" /></button>
                </div>
                <div className="mt-1 text-[12px] leading-relaxed text-white/60">{n.body}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-mono text-white/30"><Clock className="h-3 w-3" /> {new Date(n.created_at).toLocaleTimeString()}</span>
                  {!n.is_read && <button onClick={()=>markRead(n.id)} className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-black hover:bg-white/90">MARK READ</button>}
                  {n.link && <a href={n.link} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-bold text-white/70 hover:text-white">VIEW</a>}
                </div>
              </div>
              {!n.is_read && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-violet-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />}
            </div>
          )
        }) : (
          <div className="py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]"><Zap className="h-6 w-6 text-white/30" /></div>
            <div className="mt-4 text-[13px] font-bold text-white/60">All clear • No new signals</div>
            <div className="mt-1 text-[11px] text-white/30">Mission Control is silent. We&apos;ll alert you instantly when subsystems update.</div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-black/20 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-white/30">
        <span>SYNC ENGINE: SUPABASE REALTIME • LATENCY 23ms</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Connected</span>
      </div>
    </div>
  );
}
