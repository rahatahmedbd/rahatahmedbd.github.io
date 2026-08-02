"use client";
import { useState } from "react";
import { Bot, Send, Sparkles, FileDown, Calendar, HelpCircle, Zap, MessageSquare } from "lucide-react";
import { clientMeetingRequestAction } from "@/app/actions/orders";

const QUICK_ACTIONS = [
  { icon: HelpCircle, label: "Explain current stage", prompt: "Explain my current mission stage in simple terms" },
  { icon: FileDown, label: "Download all files", prompt: "How do I download all my project files?" },
  { icon: Calendar, label: "Schedule meeting", prompt: "I want to schedule a meeting with Mission Control" },
  { icon: MessageSquare, label: "Contact human support", prompt: "Connect me to human support engineer" },
];

export function SupportAI() {
  const [messages, setMessages] = useState<{ role: "user"|"ai"; text: string }[]>([
    { role: "ai", text: "Greetings, Commander. I'm NOVA — your Mission Control AI. I can explain mission stages, guide file downloads, schedule meetings, or route you to human engineers. How can I assist your mission today?" }
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    setMessages(prev=>[...prev, { role: "user", text }, { role: "ai", text: getAiReply(text) }]);
    setInput("");
    // Auto sync meeting/support requests to Admin Tower
    if (lower.includes("meeting") || lower.includes("schedule")) {
      clientMeetingRequestAction({ type: "meeting", notes: text }).catch(()=>{});
    } else if (lower.includes("human") || lower.includes("support")) {
      clientMeetingRequestAction({ type: "support", notes: text }).catch(()=>{});
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(99,102,241,0.12),rgba(0,0,0,0.8))] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.5)]">
            <Bot className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black tracking-[0.18em] text-white">NOVA • AI MISSION GUIDE</span>
              <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-[9px] font-bold tracking-widest text-violet-300">AI • GEMINI CORE</span>
            </div>
            <div className="text-[10px] tracking-widest text-white/40 uppercase">Guides, doesn&apos;t replace human • Always online</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1"><Sparkles className="h-3 w-3 text-violet-300" /><span className="text-[10px] font-mono text-white/50">Lat 42ms</span></div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] h-[440px]">
        <div className="hidden md:flex flex-col gap-2 border-r border-white/10 bg-black/20 p-3">
          <div className="text-[10px] font-bold tracking-widest text-white/30 uppercase px-2">Quick Directives</div>
          {QUICK_ACTIONS.map((a,i)=>{
            const Icon=a.icon;
            return <button key={i} onClick={()=>send(a.prompt)} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-[11px] font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"><Icon className="h-4 w-4" />{a.label}</button>
          })}
          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-[10px] tracking-widest text-white/40 uppercase">Future Expansion</div>
            <div className="mt-1.5 grid gap-1 text-[10px] text-white/30">
              <span>• Team collaboration (soon)</span>
              <span>• Video meetings (soon)</span>
              <span>• AI code review (soon)</span>
              <span>• Push notifications</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#0a0c14]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m,i)=>(
              <div key={i} className={`flex gap-2.5 max-w-[88%] ${m.role==="user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[11px] font-black ${m.role==="user" ? "bg-white text-black border-white" : "bg-[#1a1e30] border-violet-500/30 text-violet-300"}`}>{m.role==="user" ? "YOU" : "N"}</div>
                <div className={`rounded-[18px] px-4 py-3 text-[13px] leading-relaxed border ${m.role==="user" ? "bg-white text-black border-white rounded-tr-[6px]" : "bg-[#151a2b] border-violet-500/20 text-white/80 rounded-tl-[6px]"}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 bg-black/40 p-3">
            <div className="flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") send(input); }} placeholder="Ask NOVA anything about your mission..." className="h-11 flex-1 rounded-full border border-white/10 bg-[#12151f] px-5 text-[13px] text-white placeholder:text-white/30 focus:border-violet-400/50 outline-none" />
              <button onClick={()=>send(input)} className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform"><Send className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-white/25">
              <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-violet-400" /> AI guides, human builds — escalation to Mission Commander anytime</span>
              <span>NOVA v8 • Quantum Consciousness</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAiReply(input: string): string {
  const s = input.toLowerCase();
  if (s.includes("stage") || s.includes("explain")) return "Your mission progresses through 9 automated stages. Each stage lights up systems in your holographic website model. Currently you're in Development — where we build responsive, production-grade code. You’ll be notified for review in Approval Bay when ready. Estimated 4-6 days to next milestone.";
  if (s.includes("download") || s.includes("file")) return "Open File Vault → Select your mission → Downloads appear under 'Final Delivery' when deployment is ready. You can also grab requirement files from 'Your Uploads'. Every download is logged and synced with Admin Tower for security audit.";
  if (s.includes("meeting") || s.includes("schedule")) return "I can queue a meeting request to Mission Commander. Your request instantly creates an admin notification + activity log. Choose: Voice sync, Live review, or Emergency protocol. Human engineer will confirm within 2 hours (mission time).";
  if (s.includes("support") || s.includes("human")) return "Routing you to Human Mission Commander (Rahat). This creates a priority transmission in Comms Hub. Average response: 1.3 hours. Meanwhile, I can answer any technical questions about files, timelines, or approvals.";
  if (s.includes("price") || s.includes("invoice")) return "Resource Core shows all invoices. Your current mission billing is encrypted and synced with Admin. Payments create instant notifications to finance subsystem. No hidden fees — pure transparency.";
  return "Acknowledged, Commander. I've logged your transmission to Black Box. For this mission: Timeline is live, Holographic preview shows real build progress, Approval Bay unlocks review gates, and every action syncs instantly with Admin Control Tower via Supabase Realtime. What specific subsystem needs analysis?";
}
