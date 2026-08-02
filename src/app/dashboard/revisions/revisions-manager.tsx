"use client";

import { useState, useTransition } from "react";
import { ApprovalBay } from "@/components/mission-control/approval-bay";
import { createRevisionAction } from "@/app/actions/revisions";
import { RefreshCw, Plus, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export function RevisionsManager({ projects, initialRevisions }: { projects: any[]; initialRevisions: any[] }) {
  const [revisions, setRevisions] = useState(initialRevisions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [description, setDescription] = useState("");
  const [isPending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedProject = projects.find(p=>p.id===selectedProjectId) || projects[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    start(async()=>{
      const res = await createRevisionAction({ orderId: selectedProjectId, description });
      if (!res.success) { setError(res.error||"Failed"); return; }
      const current = projects.find(p=>p.id===selectedProjectId);
      const newRev = { ...(res.data as any), orders: { reference: current?.reference||"", website_type: current?.website_type||"" } };
      setRevisions(prev=>[newRev, ...prev]);
      setSuccess("Revision transmitted to Admin Tower • Sync active");
      setTimeout(()=>setIsModalOpen(false), 900);
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)]"><RefreshCw className="h-6 w-6" /></div>
            <div>
              <h1 className="text-[20px] font-black tracking-tight text-white leading-none">APPROVAL BAY • REVISION DECK</h1>
              <p className="mt-1 text-[11px] text-white/40 uppercase tracking-widest">Request changes • Approve milestones • Real-time sync to Admin Tower</p>
            </div>
          </div>
          {projects.length>0 && (
            <button onClick={()=>setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[12px] font-black tracking-widest text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:bg-white/90"><Plus className="h-4 w-4" /> TRANSMIT REVISION</button>
          )}
        </div>
      </div>

      <ApprovalBay project={selectedProject || projects[0]} onApprove={()=>{}} onRevision={()=>{}} />

      <div className="grid gap-3">
        <div className="text-[11px] font-black tracking-[0.2em] text-white uppercase px-1">Revision Transmissions Log • {revisions.length} records</div>
        {revisions.length>0 ? revisions.map((rev:any, idx:number)=>(
          <div key={rev.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-[13px] font-bold text-white">{rev.orders?.website_type}</span><span className="font-mono text-[10px] text-white/40">{rev.orders?.reference}</span></div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${rev.status==="completed" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}>{rev.status}</span>
            </div>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-[12px] text-white/60 leading-relaxed whitespace-pre-line">{rev.description}</div>
            {rev.admin_notes && <div className="mt-2 rounded-xl border border-violet-400/20 bg-violet-500/10 p-3 text-[11px] text-violet-300"><span className="font-bold">Engineer Notes:</span> {rev.admin_notes}</div>}
            <div className="mt-2 text-[10px] font-mono text-white/30">{new Date(rev.created_at).toLocaleString()}</div>
          </div>
        )) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-white/30"><RefreshCw className="mx-auto h-8 w-8 mb-3 opacity-30" /> No revision requests yet — Approval Bay is idle</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-5">
          <div onClick={()=>setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div className="relative w-full max-w-xl rounded-[28px] border border-white/15 bg-[#0d0f18] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            <button onClick={()=>setIsModalOpen(false)} className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white"><X className="h-4 w-4" /></button>
            <h3 className="text-[18px] font-black text-white">Transmit Revision to Mission Control</h3>
            <p className="mt-1 text-[11px] text-white/40">This instantly notifies Admin Tower • Activity logged • Supabase Realtime sync</p>
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              {error && <div className="flex gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[12px] text-rose-300"><AlertCircle className="h-4 w-4" />{error}</div>}
              {success && <div className="flex gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[12px] text-emerald-300"><CheckCircle className="h-4 w-4" />{success}</div>}
              <div>
                <label className="text-[10px] tracking-widest text-white/40 uppercase">Select Mission</label>
                <select value={selectedProjectId} onChange={e=>setSelectedProjectId(e.target.value)} className="mt-1 h-11 w-full rounded-full border border-white/10 bg-black/40 px-4 text-[13px] text-white outline-none">
                  {projects.map((p:any)=><option key={p.id} value={p.id} className="bg-black">{p.website_type} ({p.reference})</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-widest text-white/40 uppercase">Revision Details • Be specific</label>
                <textarea required rows={4} value={description} onChange={e=>setDescription(e.target.value)} placeholder="E.g., Change hero title, adjust footer color to #000, replace logo with uploaded asset..." className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-[13px] text-white placeholder:text-white/30 outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-[12px] text-white/60 hover:text-white">Cancel</button>
                <button type="submit" disabled={isPending || description.trim().length<5} className="rounded-full bg-white px-6 py-2.5 text-[12px] font-black text-black hover:bg-white/90 disabled:opacity-50 flex items-center gap-2">{isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Transmitting...</> : "Transmit Revision"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
