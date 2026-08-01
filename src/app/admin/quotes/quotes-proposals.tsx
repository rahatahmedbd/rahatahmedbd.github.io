"use client";

import { useState, useTransition } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createQuoteAction, updateQuoteAction, deleteQuoteAction, convertQuoteToProjectAction } from "@/app/actions/business";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Quote {
  id: string;
  order_id: string | null;
  client_id: string;
  title: string;
  services: any[];
  timeline: string | null;
  pricing: number;
  notes: string | null;
  terms: string | null;
  status: string;
  created_at: string;
  orders?: { reference: string; website_type: string | null } | null;
  profiles?: { full_name: string | null; email: string } | null;
}

interface ClientProfile {
  id: string;
  full_name: string | null;
  email: string;
}

interface OrderReference {
  id: string;
  reference: string;
  website_type: string | null;
}

interface QuotesProposalsProps {
  initialQuotes: Quote[];
  clients: ClientProfile[];
  orders: OrderReference[];
}

export function QuotesProposals({ initialQuotes, clients, orders }: QuotesProposalsProps) {
  const { t, lang } = useLanguage();
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [orderId, setOrderId] = useState("");
  const [title, setTitle] = useState("");
  const [pricing, setPricing] = useState(0);
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"draft" | "sent" | "accepted" | "converted">("sent");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      (q.profiles?.full_name && q.profiles.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (q.notes && q.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === "all" || q.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingQuote(null);
    setClientId(clients[0]?.id || "");
    setOrderId("");
    setTitle("");
    setPricing(150);
    setTimeline("2 Weeks");
    setNotes("");
    setStatus("sent");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (q: Quote) => {
    setEditingQuote(q);
    setClientId(q.client_id);
    setOrderId(q.order_id || "");
    setTitle(q.title);
    setPricing(q.pricing);
    setTimeline(q.timeline || "");
    setNotes(q.notes || "");
    setStatus(q.status as any);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const payload = {
        orderId: orderId || undefined,
        clientId,
        title,
        services: [], // can be extended, default empty list satisfies schema
        timeline,
        pricing,
        notes,
        status,
      };

      if (editingQuote) {
        // Edit
        const res = await updateQuoteAction(editingQuote.id, payload);
        if (!res.success) {
          setError(res.error || "Failed to update Quote");
          return;
        }

        const updated = {
          ...(res.data as Quote),
          profiles: clients.find((c) => c.id === clientId) as any,
          orders: orders.find((o) => o.id === orderId) as any,
        };

        setQuotes((prev) => prev.map((q) => (q.id === editingQuote.id ? updated : q)));
        setSuccess("Proposal quote saved successfully!");
      } else {
        // Create
        const res = await createQuoteAction(payload as any);
        if (!res.success) {
          setError(res.error || "Failed to create Quote");
          return;
        }

        const newQuote = {
          ...(res.data as Quote),
          profiles: clients.find((c) => c.id === clientId) as any,
          orders: orders.find((o) => o.id === orderId) as any,
        };

        setQuotes((prev) => [newQuote, ...prev]);
        setSuccess("Proposal quote generated successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleConvertQuote = (id: string) => {
    if (!confirm("Are you sure you want to approve this quote and convert it to a project started? This will automatically update the linked website order status.")) return;

    startTransition(async () => {
      const res = await convertQuoteToProjectAction(id);
      if (!res.success) {
        alert(res.error || "Failed to convert quote");
        return;
      }

      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: "converted" } : q))
      );
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this proposal quote?")) return;

    startTransition(async () => {
      const res = await deleteQuoteAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete quote");
        return;
      }
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">প্রপোজাল ও কোটেশন (Quotes & Proposals)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              নতুন প্রজেক্টের বাজেট কোটেশন, টাইমলাইন এবং অফার বিবরণী তৈরি করে ক্লায়েন্ট পোর্টালে সরাসরি পাঠান।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            Generate Quote
          </button>
        </div>
      </Reveal>

      {/* Filter and Search */}
      <Reveal delay={60}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotes by proposal title, client name..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Quote Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </Reveal>

      {/* Table view */}
      <Reveal delay={120}>
        <div className="card-surface rounded-3xl border border-border/10 bg-surface/20 shadow-lift overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/10 bg-canvas/30 text-fg-muted uppercase tracking-wider font-semibold text-xs">
                  <th className="p-4 pl-6">Proposal Details</th>
                  <th className="p-4">Associated Client</th>
                  <th className="p-4">Assigned Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5 text-fg-soft">
                {filteredQuotes.length > 0 ? (
                  filteredQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-canvas-muted/10 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-fg">{q.title}</p>
                        {q.orders && (
                          <span className="inline-block text-[10px] font-mono bg-canvas px-1.5 py-0.5 rounded text-fg-muted block mt-1 w-fit">
                            Ref: {q.orders.reference}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-fg">{q.profiles?.full_name || "Guest Client"}</p>
                        <p className="text-xs text-fg-muted">{q.profiles?.email}</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-fg">
                        ${q.pricing}
                        <span className="text-[10px] text-fg-muted font-normal block">Timeline: {q.timeline || "Flexible"}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface/60 border border-border/10 text-fg-soft">
                          {q.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        {q.status === "sent" && (
                          <button
                            onClick={() => handleConvertQuote(q.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:underline"
                            title="Convert quote to active accepted project started"
                          >
                            <TrendingUp className="h-3.5 w-3.5" />
                            Convert
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(q)}
                          className="inline-flex p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg hover:bg-brand-500/5"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="inline-flex p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg hover:bg-brand-500/5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center italic text-fg-muted">
                      কোনো প্রপোজাল কোটেশন পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Add & Edit Quote Modal Form */}
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
              <h3 className="text-xl font-bold text-fg">
                {editingQuote ? "কোটেশন এডিট করুন" : "নতুন কোটেশন প্রপোজাল তৈরি করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">Create agency-grade commercial proposals linked directly to active projects.</p>
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

              {/* Select Client */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Target Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name || "Guest Client"} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Associated Order */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Associated Website Order (Optional)</label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                >
                  <option value="">No linked order</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.website_type} ({o.reference})
                    </option>
                  ))}
                </select>
              </div>

              {/* Proposal Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="title">
                  Proposal Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Website Development Agreement Proposal"
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                />
              </div>

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="price">
                    Quote Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    required
                    value={pricing}
                    onChange={(e) => setPricing(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="timeline">
                    Assigned Timeline
                  </label>
                  <input
                    id="timeline"
                    type="text"
                    required
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="2 Weeks"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="status">
                  Proposal Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="sent">Sent (Awaiting review)</option>
                  <option value="accepted">Accepted (Approved)</option>
                  <option value="converted">Converted (Project Started)</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="notes">
                  Proposal Offer Notes & Details
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summarize the full scope of services, features, packages, timeline phases, and notes..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="px-6 h-11">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Proposal"
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
