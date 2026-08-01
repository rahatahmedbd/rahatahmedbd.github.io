"use client";

import { useState, useTransition } from "react";
import {
  Target,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Phone,
  Building,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createLeadAction, updateLeadAction, deleteLeadAction } from "@/app/actions/business";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  status: string;
  notes: string | null;
  follow_up_at: string | null;
  created_at: string;
}

interface LeadsCRMProps {
  initialLeads: Lead[];
}

export function LeadsCRM({ initialLeads }: LeadsCRMProps) {
  const { t, lang } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Form & Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter & Search Logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company_name && lead.company_name.toLowerCase().includes(search.toLowerCase())) ||
      (lead.notes && lead.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingLead(null);
    setName("");
    setEmail("");
    setPhone("");
    setCompanyName("");
    setStatus("new");
    setNotes("");
    setFollowUpAt("");
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone || "");
    setCompanyName(lead.company_name || "");
    setStatus(lead.status);
    setNotes(lead.notes || "");
    setFollowUpAt(lead.follow_up_at ? lead.follow_up_at.slice(0, 16) : "");
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
        name,
        email,
        phone: phone || undefined,
        companyName: companyName || undefined,
        status,
        notes: notes || undefined,
        followUpAt: followUpAt || undefined,
      };

      if (editingLead) {
        // Edit
        const res = await updateLeadAction(editingLead.id, payload);

        if (!res.success) {
          setError(res.error || "Failed to update lead");
          return;
        }

        setLeads((prev) =>
          prev.map((l) => (l.id === editingLead.id ? (res.data as Lead) : l))
        );
        setSuccess("Lead updated successfully!");
      } else {
        // Create
        const res = await createLeadAction({
          ...payload,
          status: payload.status as any,
        });

        if (!res.success) {
          setError(res.error || "Failed to create lead");
          return;
        }

        setLeads((prev) => [res.data as Lead, ...prev]);
        setSuccess("Lead registered successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this lead from CRM?")) return;

    startTransition(async () => {
      const res = await deleteLeadAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete lead");
        return;
      }
      setLeads((prev) => prev.filter((l) => l.id !== id));
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not Scheduled";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const statuses = ["new", "contacted", "qualified", "proposal_sent", "won", "lost"];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">CRM কন্টাক্ট লিডস (Leads CRM)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              নতুন ক্লায়েন্ট কন্টাক্ট রিকুয়েস্ট, ফলো-আপ শিডিউল এবং প্রজেক্ট কনভার্সন ট্র্যাকিং টুলস পরিচালনা করুন।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            {t({ bn: "নতুন লিড যুক্ত করুন", en: "Add New Lead" })}
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
              placeholder="Search leads by name, email, company, notes..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Leads Status</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </Reveal>

      {/* Leads List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead, idx) => (
            <Reveal key={lead.id} delay={idx * 30} direction="scale">
              <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/10 bg-surface/20 hover:bg-surface/30 shadow-soft flex flex-col justify-between h-full gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-500/10">
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-fg-muted">
                      Registered: {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-fg text-base">{lead.name}</h3>
                    <p className="text-xs text-fg-muted flex items-center gap-1.5 font-medium">
                      <Phone className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                      {lead.email} {lead.phone ? `| ${lead.phone}` : ""}
                    </p>
                    {lead.company_name && (
                      <p className="text-xs text-fg-soft flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        Company: {lead.company_name}
                      </p>
                    )}
                    <p className="text-xs text-fg-soft leading-relaxed bg-canvas/30 p-3 rounded-xl border border-border/5">
                      {lead.notes || "No requirement notes recorded."}
                    </p>
                  </div>
                </div>

                {/* Footer status / Follow Up details */}
                <div className="flex items-center justify-between border-t border-border/5 pt-4 mt-auto">
                  <div className="text-[10px] text-fg-muted flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4 text-brand-500" />
                    Follow-up: <span className="font-bold text-fg-soft">{formatDate(lead.follow_up_at)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(lead)}
                      className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-sm text-fg-muted italic text-center py-10 card-surface border border-border/10 rounded-3xl bg-surface/10">
              CRM-এ কোনো লিড পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>

      {/* Add & Edit Lead Modal Form */}
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
                {editingLead ? "লিড বিবরণী পরিবর্তন করুন" : "নতুন CRM লিড যুক্ত করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">Register customer requirements, follow ups and business status tags.</p>
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

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="name">
                    Lead Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mominur Rahman"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mominur@example.com"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Phone & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="company">
                    Company Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Tech IT Solutions"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Status and Follow Up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="status">
                    Lead CRM Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st.replace(/_/g, " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="followUp">
                    Next Follow-up Reminder
                  </label>
                  <input
                    id="followUp"
                    type="datetime-local"
                    value={followUpAt}
                    onChange={(e) => setFollowUpAt(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                  />
                </div>
              </div>

              {/* Requirement Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="notes">
                  Lead Description / Discussion Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summarize client requirements, discussed ideas, budget restrictions or meeting details..."
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
                    "Save Lead"
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
