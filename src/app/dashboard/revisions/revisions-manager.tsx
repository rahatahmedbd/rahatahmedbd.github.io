"use client";

import { useState, useTransition, useRef } from "react";
import {
  RefreshCw,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  DollarSign,
  User,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createRevisionAction } from "@/app/actions/revisions";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Revision {
  id: string;
  order_id: string;
  client_id: string;
  description: string;
  attachments: any[];
  status: string;
  admin_notes: string | null;
  created_at: string;
  orders?: { reference: string; website_type: string | null } | null;
}

interface Project {
  id: string;
  reference: string;
  website_type: string | null;
}

interface RevisionsManagerProps {
  projects: Project[];
  initialRevisions: Revision[];
}

export function RevisionsManager({ projects, initialRevisions }: RevisionsManagerProps) {
  const { t, lang } = useLanguage();
  const [revisions, setRevisions] = useState<Revision[]>(initialRevisions);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const openModal = () => {
    setSelectedProjectId(projects[0]?.id || "");
    setDescription("");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await createRevisionAction({
        orderId: selectedProjectId,
        description,
      });

      if (!res.success) {
        setError(res.error || "Failed to submit revision request");
        return;
      }

      // Add category name for display
      const currentPrj = projects.find((p) => p.id === selectedProjectId);
      const newRev = {
        ...(res.data as Revision),
        orders: {
          reference: currentPrj?.reference || "",
          website_type: currentPrj?.website_type || "",
        },
      };

      setRevisions((prev) => [newRev, ...prev]);
      setSuccess("Revision request submitted successfully!");

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return lang === "bn"
      ? d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
      : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">রিভিশন রিকুয়েস্ট (Project Revisions)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              উন্নয়নশীল বা টেস্টিং পর্যায়ে থাকা প্রজেক্টের যেকোনো নকশা বা কন্টেন্ট সংশোধনের জন্য রিকুয়েস্ট জমা দিন।
            </p>
          </div>
          {projects.length > 0 && (
            <button
              onClick={openModal}
              className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
            >
              <Plus className="h-4 w-4" />
              Request Revision
            </button>
          )}
        </div>
      </Reveal>

      {/* Historical List */}
      <div className="space-y-4">
        {revisions.length > 0 ? (
          revisions.map((rev, idx) => (
            <Reveal key={rev.id} delay={idx * 30} direction="fade">
              <div className="card-surface p-5 sm:p-6 rounded-2xl border border-border/10 bg-surface/20 hover:bg-surface/30 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-fg text-sm">{rev.orders?.website_type}</span>
                    <span className="font-mono text-[10px] text-fg-muted font-semibold px-2 py-0.5 rounded border border-border/10">
                      {rev.orders?.reference}
                    </span>
                  </div>

                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      rev.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                        : rev.status === "rejected"
                        ? "bg-brand-500/10 text-brand-500 border border-brand-500/10"
                        : rev.status === "approved"
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/10"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-canvas/30 rounded-xl border border-border/5 text-xs text-fg-soft leading-relaxed whitespace-pre-line">
                    {rev.description}
                  </div>

                  {rev.admin_notes && (
                    <div className="p-3 bg-brand-500/5 rounded-xl border border-brand-500/10 text-xs space-y-1">
                      <p className="font-bold text-brand-500">Developer Notes:</p>
                      <p className="text-fg-soft leading-relaxed whitespace-pre-line">{rev.admin_notes}</p>
                    </div>
                  )}

                  <p className="text-[10px] text-fg-muted">Requested on {formatDate(rev.created_at)}</p>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <Reveal direction="fade">
            <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
              <RefreshCw className="h-10 w-10 text-border mx-auto mb-3" />
              কোনো সংশোধনী রিকুয়েস্ট রেকর্ড পাওয়া যায়নি
            </div>
          </Reveal>
        )}
      </div>

      {/* Submit Revision Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div className="relative w-full max-w-xl bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-fg">Request Project Revision</h3>
              <p className="text-xs text-fg-soft mt-1">Describe exactly what updates, copy edits or layout revisions you want performed.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{success}</p>
                </div>
              )}

              {/* Select project */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Select Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.website_type} ({p.reference})
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="desc">
                  Describe Changes / Revisions Required
                </label>
                <textarea
                  id="desc"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., Please change the hero background title from 'Hello World' to 'Welcome Home', and set the cover image to the uploaded asset..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || description.trim().length < 5} className="px-6 h-11">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Revision"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
