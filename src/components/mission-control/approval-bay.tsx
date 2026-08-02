"use client";
import { useState, useTransition } from "react";
import { CheckCircle2, MessageSquare, RotateCw, FileCheck, Shield, Zap, AlertTriangle } from "lucide-react";
import { clientApprovalAction } from "@/app/actions/orders";

interface Milestone {
  id: string;
  title: string;
  status: "pending_review" | "approved" | "revision_requested";
  previewUrl?: string;
  feedback?: string;
}

export function ApprovalBay({ project, onApprove, onRevision }: { project: any; onApprove?: (id:string)=>void; onRevision?: (id:string, note:string)=>void }) {
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [isPending, start] = useTransition();

  const milestones: Milestone[] = [
    { id: "m1", title: "UI/UX Design Concepts", status: project?.status?.includes("design") || project?.status?.includes("dev") ? "pending_review" : "approved", previewUrl: "#" },
    { id: "m2", title: "Frontend Development - Homepage", status: project?.status?.includes("dev") ? "pending_review" : "approved" },
    { id: "m3", title: "Backend Systems & API", status: project?.status?.includes("test") ? "pending_review" : project?.status==="completed" ? "approved" : "pending_review" },
    { id: "m4", title: "Final QA & Deployment", status: project?.status==="completed" ? "approved" : "pending_review" },
  ];

  const handleApprove = (id: string) => {
    start(async()=>{
      if (project?.id) {
        await clientApprovalAction(project.id, { milestoneId: id, action: "approve" });
      }
      onApprove?.(id);
    });
  };

  const handleRevision = (id: string, note: string) => {
    start(async()=>{
      if (project?.id) {
        await clientApprovalAction(project.id, { milestoneId: id, action: "revision", feedback: note });
      }
      onRevision?.(id, note);
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] p-5 md:p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-[0_0_18px_rgba(52,211,153,0.4)]"><FileCheck className="h-5 w-5" /></div>
          <div>
            <div className="text-[13px] font-black tracking-[0.18em] text-white">APPROVAL BAY</div>
            <div className="text-[10px] tracking-widest text-white/40 uppercase">Review • Approve • Request Revision</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-emerald-300">3 PENDING</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {milestones.map(m=>{
          const approved = m.status==="approved";
          const revision = m.status==="revision_requested";
          return (
            <div key={m.id} className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-500 ${approved ? "border-emerald-400/20 bg-emerald-400/10" : revision ? "border-amber-400/20 bg-amber-400/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl border ${approved ? "bg-emerald-500 border-emerald-400 text-white" : revision ? "bg-amber-500 border-amber-400 text-black" : "bg-white/[0.06] border-white/10 text-white/60"}`}>
                    {approved ? <CheckCircle2 className="h-5 w-5" /> : revision ? <RotateCw className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white">{m.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest ${approved ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : revision ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-white/10 text-white/50"}`}>{m.status.replace("_"," ")}</span>
                      <span>Ref: {project?.reference} • {m.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setSelected(selected===m.id?null:m.id)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors"><MessageSquare className="h-3.5 w-3.5 inline mr-1" /> Feedback</button>
                  {!approved && (
                    <button onClick={()=>handleApprove(m.id)} disabled={isPending} className="rounded-full bg-white px-4 py-1.5 text-[11px] font-black tracking-widest text-black hover:bg-white/90 transition-colors disabled:opacity-50">
                      {isPending ? "SYNC..." : "APPROVE"}
                    </button>
                  )}
                </div>
              </div>

              {selected===m.id && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/50 uppercase"><AlertTriangle className="h-3 w-3" /> Leave Feedback / Request Revision</div>
                  <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Describe required changes or approval notes — this will instantly sync with Admin Control Tower..." className="mt-2 min-h-[84px] w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[12px] text-white placeholder:text-white/30 focus:border-white/20 outline-none resize-none" />
                  <div className="mt-2 flex gap-2 justify-end">
                    <button onClick={()=>{ handleRevision(m.id, feedback); setFeedback(""); setSelected(null); }} className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-400/20"><RotateCw className="h-3.5 w-3.5 inline mr-1" /> Request Revision</button>
                    <button onClick={()=>{ handleApprove(m.id); setSelected(null); }} className="rounded-full bg-white px-4 py-1.5 text-[11px] font-black text-black">Approve & Continue</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-3 flex items-center gap-2 text-[10px] font-mono text-white/40">
        <Zap className="h-3.5 w-3.5 text-cyan-400" /> Every action here instantly updates the Admin Panel via Supabase Realtime. Approvals unlock next mission stage automatically.
      </div>
    </div>
  );
}
