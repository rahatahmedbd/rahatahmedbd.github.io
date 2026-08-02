"use client";
import { useState, useTransition, useEffect, useRef } from "react";
import { Send, Paperclip, Image as ImageIcon, FileText, Mic, Radio, Users, Shield, Zap, X } from "lucide-react";
import { sendProjectMessageAction } from "@/app/actions/chat";

export function CommHub({ projects, initialMessages, profile, selectedProjectIdProp }: { projects: any[]; initialMessages: any[]; profile: any; selectedProjectIdProp?: string }) {
  const [selectedProjectId, setSelectedProjectId] = useState(selectedProjectIdProp || projects[0]?.id || "");
  const [messages, setMessages] = useState(initialMessages);
  const [typed, setTyped] = useState("");
  const [isPending, start] = useTransition();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered = messages.filter(m=>m.order_id===selectedProjectId);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({ behavior: "smooth" }); },[filtered]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typed.trim() || !selectedProjectId) return;
    const txt = typed;
    setTyped("");
    const tempId = `tmp_${Date.now()}`;
    const optimistic = {
      id: tempId,
      order_id: selectedProjectId,
      sender_id: profile.id,
      message: txt,
      attachments: [],
      created_at: new Date().toISOString(),
      profiles: { full_name: profile.full_name, avatar_url: profile.avatar_url }
    };
    setMessages(prev=>[...prev, optimistic]);
    start(async()=>{
      const res = await sendProjectMessageAction({ orderId: selectedProjectId, message: txt });
      if (!res.success) {
        setMessages(prev=>prev.filter(m=>m.id!==tempId));
        alert(res.error||"Transmission failed");
      } else {
        setMessages(prev=>prev.map(m=>m.id===tempId ? { ...res.data as any, profiles: optimistic.profiles } : m));
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-[0_0_18px_rgba(34,211,238,0.4)]">
            <Radio className="h-5 w-5 animate-pulse" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-600/30 blur-[10px] -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-black tracking-[0.18em] text-white">COMMS HUB</span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[8px] font-bold tracking-widest text-emerald-300">ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/40"><Users className="h-3 w-3" /> SECURE CHANNEL • QUANTUM LINK</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-mono text-white/60"><Shield className="h-3 w-3 inline mr-1" /> E2E</span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-mono text-white/60">LAT 12ms</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] h-[560px] md:h-[640px]">
        {/* Mission threads */}
        <div className="border-r border-white/10 bg-black/20 p-3 space-y-3 overflow-y-auto hidden md:flex flex-col">
          <div className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase px-2">Mission Channels</div>
          <div className="space-y-1.5">
            {projects.map((p:any)=>{
              const active = p.id===selectedProjectId;
              const count = messages.filter(m=>m.order_id===p.id).length;
              return (
                <button key={p.id} onClick={()=>setSelectedProjectId(p.id)} className={`w-full text-left rounded-xl border p-3 transition-all ${active ? "border-cyan-400/30 bg-cyan-500/10 text-white shadow-[0_0_18px_rgba(34,211,238,0.18)]" : "border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]"}`}>
                  <div className="text-[11px] font-bold truncate">{p.website_type || p.reference}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[9px] font-mono opacity-60">{p.reference}</span>
                    <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px]">{count}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[9px] tracking-widest uppercase opacity-60"><div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" /> Online</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Chat viewport */}
        <div className="flex flex-col relative bg-[#080a12]">
          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3 scrollbar-thin">
            {filtered.length>0 ? filtered.map((msg:any)=>{
              const own = msg.sender_id===profile.id;
              return (
                <div key={msg.id} className={`group flex gap-2.5 max-w-[84%] ${own ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[10px] font-black ${own ? "bg-white text-black border-white" : "bg-[#11141f] border-white/10 text-white/70"}`}>
                    {msg.profiles?.full_name?.slice(0,2).toUpperCase() || "HQ"}
                  </div>
                  <div className="space-y-1">
                    {!own && <div className="text-[10px] font-bold tracking-wide text-white/50">{msg.profiles?.full_name || "Mission Control"}</div>}
                    <div className={`relative rounded-[18px] px-4 py-3 text-[13px] leading-relaxed backdrop-blur-md border transition-all ${own ? "bg-white text-black border-white rounded-tr-[6px] shadow-[0_4px_20px_rgba(255,255,255,0.15)]" : "bg-[#161a2a] border-white/10 text-white/85 rounded-tl-[6px] group-hover:border-white/20"}`}>
                      <div className="whitespace-pre-line">{msg.message}</div>
                      <div className="absolute -bottom-px right-3 left-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className={`text-[9px] font-mono ${own ? "text-right text-white/40" : "text-white/30"}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • ENCRYPTED</div>
                  </div>
                </div>
              )
            }) : (
              <div className="h-full grid place-items-center text-center p-8">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]"><Radio className="h-6 w-6 text-white/30" /></div>
                  <div className="mt-4 text-[13px] font-bold text-white/60">No transmissions on this channel</div>
                  <div className="mt-1 text-[11px] text-white/30">Initiate contact to establish quantum link</div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* composer */}
          <div className="border-t border-white/10 bg-black/40 p-3 md:p-4">
            {/* mobile project selector */}
            <div className="md:hidden mb-3 flex gap-2 overflow-x-auto pb-1">
              {projects.map((p:any)=>{
                const active=p.id===selectedProjectId;
                return <button key={p.id} onClick={()=>setSelectedProjectId(p.id)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold ${active?"border-white bg-white text-black":"border-white/10 bg-white/5 text-white/60"}`}>{p.reference}</button>
              })}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input value={typed} onChange={e=>setTyped(e.target.value)} placeholder="Transmit message to Mission Control..." className="h-12 w-full rounded-full border border-white/10 bg-[#11141f] pl-12 pr-4 text-[13px] text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all" />
                <div className="absolute left-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] border border-white/10"><Zap className="h-4 w-4 text-white/60" /></div>
              </div>
              <button type="button" onClick={()=>setShowFileUpload(!showFileUpload)} className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"><Paperclip className="h-5 w-5" /></button>
              <button type="submit" disabled={isPending || !typed.trim()} className="grid h-12 w-12 place-items-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:bg-white/90 disabled:opacity-40 transition-all">
                <Send className="h-5 w-5" />
              </button>
            </form>

            {showFileUpload && (
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 animate-in slide-in-from-bottom-2">
                <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70 hover:text-white"><ImageIcon className="h-4 w-4" /> Image</button>
                <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70 hover:text-white"><FileText className="h-4 w-4" /> PDF / Doc</button>
                <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70 hover:text-white"><Mic className="h-4 w-4" /> Voice (Future)</button>
                <button onClick={()=>setShowFileUpload(false)} className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/60"><X className="h-4 w-4" /></button>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between text-[9px] font-mono tracking-wide text-white/25">
              <span>QUANTUM ENCRYPTION ACTIVE • MESSAGE EXPIRY: NEVER • LINK: STABLE</span>
              <span className="hidden md:inline">Press Enter to transmit • Shift+Enter for newline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
