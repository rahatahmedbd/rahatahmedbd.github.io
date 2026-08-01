"use client";

import { useState } from "react";
import {
  FileText,
  DollarSign,
  CheckCircle,
  CreditCard,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Reveal } from "@/components/ui/reveal";

interface ProjectBilling {
  id: string;
  reference: string;
  website_type: string | null;
  estimated_cost: number | null;
  final_price: number | null;
  status: string;
  created_at: string;
}

interface InvoicesListProps {
  projects: ProjectBilling[];
}

export function InvoicesList({ projects }: InvoicesListProps) {
  const { t, lang } = useLanguage();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return lang === "bn"
      ? d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
      : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const getPaymentStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed") return "paid";
    if (s === "cancelled") return "cancelled";
    return "pending";
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">ইনভয়েস ও পেমেন্ট (Invoices & Payments)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            আপনার প্রজেক্টের বাজেট বিবরণী, অতিরিক্ত ফিচার ফি এবং পেমেন্ট রসিদ এখানে দেখে নিন।
          </p>
        </div>
      </Reveal>

      {/* Invoice list card */}
      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((prj, idx) => {
            const payStatus = getPaymentStatus(prj.status);
            return (
              <Reveal key={prj.id} delay={idx * 30} direction="fade">
                <div className="card-surface p-5 sm:p-6 rounded-2xl border border-border/10 bg-surface/20 hover:bg-surface/30 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-fg text-sm">{prj.website_type}</h3>
                      <span className="font-mono text-[10px] text-fg-muted font-semibold block mt-0.5">
                        Invoice ID: INV-{prj.reference.slice(-6)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 text-xs">
                    {/* Price details */}
                    <div className="space-y-1">
                      <span className="text-fg-muted uppercase tracking-wider block font-bold text-[9px]">Amounts</span>
                      <p className="text-fg font-medium">Est Price: ${prj.estimated_cost || 0}</p>
                      <p className="text-fg font-bold">
                        Final Price:{" "}
                        <span className="text-brand-500 font-extrabold">
                          {prj.final_price ? `$${prj.final_price}` : "Awaiting Quote"}
                        </span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="space-y-1">
                      <span className="text-fg-muted uppercase tracking-wider block font-bold text-[9px]">Payment Status</span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          payStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                            : payStatus === "cancelled"
                            ? "bg-fg-muted/10 text-fg-soft border border-border/10"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                        }`}
                      >
                        {payStatus === "paid" ? (
                          <>
                            <CheckCircle className="h-3 w-3" /> Paid
                          </>
                        ) : payStatus === "cancelled" ? (
                          "Cancelled"
                        ) : (
                          <>
                            <Clock className="h-3 w-3 animate-pulse" /> Pending Gateway
                          </>
                        )}
                      </span>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1">
                      <span className="text-fg-muted uppercase tracking-wider block font-bold text-[9px]">Due Date</span>
                      <span className="font-semibold text-fg-soft">{formatDate(prj.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })
        ) : (
          <Reveal direction="fade">
            <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
              <FileText className="h-10 w-10 text-border mx-auto mb-3" />
              কোনো ইনভয়েস রেকর্ড পাওয়া যায়নি
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
