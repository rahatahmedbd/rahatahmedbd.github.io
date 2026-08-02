"use client";
import { FileText, DollarSign, CheckCircle, Clock, CreditCard, Shield, Zap } from "lucide-react";

export function InvoicesList({ projects }: { projects: any[] }) {
  const getStatus = (s: string) => {
    const low = s.toLowerCase();
    if (low.includes("complet")) return "paid";
    if (low.includes("cancel")) return "cancelled";
    return "pending";
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black shadow-[0_0_20px_rgba(52,211,153,0.4)]"><CreditCard className="h-6 w-6" /></div>
          <div>
            <h1 className="text-[20px] font-black tracking-tight text-white leading-none">RESOURCE CORE • INVOICES & PAYMENTS</h1>
            <p className="mt-1 text-[11px] text-white/40 uppercase tracking-widest">Budget tracking • Settlement • Encrypted receipts • Live sync</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {projects.length>0 ? projects.map((prj:any)=>{
          const payStatus = getStatus(prj.status);
          return (
            <div key={prj.id} className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0c0e18] p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-white/20 transition-all">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(60%_60%_at_0%_0%,rgba(99,102,241,0.12),transparent_70%)]" />
              <div className="relative flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] border border-white/10 text-white"><FileText className="h-6 w-6" /></div>
                <div>
                  <div className="text-[14px] font-bold text-white">{prj.website_type}</div>
                  <div className="text-[11px] font-mono text-white/40">Invoice ID: INV-{prj.reference?.slice(-6)} • {prj.reference}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest border ${payStatus==="paid" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : payStatus==="cancelled" ? "border-white/10 bg-white/5 text-white/40" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}>
                      {payStatus==="paid" ? <><CheckCircle className="h-3 w-3" /> Settled</> : payStatus==="cancelled" ? "Cancelled" : <><Clock className="h-3 w-3 animate-pulse" /> Pending Gateway</>}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">{new Date(prj.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-8">
                <div><div className="text-[10px] tracking-widest text-white/40 uppercase">Estimated</div><div className="mt-1 text-[14px] font-bold text-white/70">${prj.estimated_cost||0}</div></div>
                <div><div className="text-[10px] tracking-widest text-white/40 uppercase">Final • Locked</div><div className="mt-1 text-[18px] font-black text-white">{prj.final_price ? `$${prj.final_price}` : "Awaiting Quote"}</div></div>
                <div className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10 text-white/40"><DollarSign className="h-5 w-5" /></div>
              </div>
            </div>
          )
        }) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-16 text-center backdrop-blur-xl">
            <FileText className="mx-auto h-10 w-10 text-white/20" />
            <div className="mt-4 text-white/50">No invoices yet • Resource Core idle</div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-2 text-[10px] font-mono text-white/30">
        <Shield className="h-4 w-4 text-emerald-400" /> All payments synced to Admin Tower • Receipts encrypted • Activity logged • Future: auto push notifications (queued)
      </div>
    </div>
  );
}
