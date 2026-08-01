"use client";

import { useState, useTransition } from "react";
import {
  Star,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Check,
  Ban,
  User,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createTestimonialAction, updateTestimonialAction, deleteTestimonialAction } from "@/app/actions/cms";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  author_avatar_url: string | null;
  rating: number;
  content: string;
  status: "pending" | "approved" | "rejected";
}

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Form & Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter & Search
  const filteredTestimonials = testimonials.filter((tst) => {
    const matchesSearch =
      tst.author_name.toLowerCase().includes(search.toLowerCase()) ||
      (tst.author_title && tst.author_title.toLowerCase().includes(search.toLowerCase())) ||
      tst.content.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "all" || tst.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingTestimonial(null);
    setAuthorName("");
    setAuthorTitle("");
    setAuthorAvatarUrl("");
    setRating(5);
    setContent("");
    setStatus("approved"); // Direct addition from admin defaults to approved
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tst: Testimonial) => {
    setEditingTestimonial(tst);
    setAuthorName(tst.author_name);
    setAuthorTitle(tst.author_title || "");
    setAuthorAvatarUrl(tst.author_avatar_url || "");
    setRating(tst.rating);
    setContent(tst.content);
    setStatus(tst.status);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      if (editingTestimonial) {
        // Edit
        const res = await updateTestimonialAction(editingTestimonial.id, {
          author_name: authorName,
          author_title: authorTitle,
          author_avatar_url: authorAvatarUrl,
          rating,
          content,
          status,
        });

        if (!res.success) {
          setError(res.error || "Failed to update testimonial");
          return;
        }

        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingTestimonial.id ? (res.data as Testimonial) : t))
        );
        setSuccess("Testimonial updated successfully!");
      } else {
        // Create
        const res = await createTestimonialAction({
          author_name: authorName,
          author_title: authorTitle,
          author_avatar_url: authorAvatarUrl,
          rating,
          content,
          status,
        });

        if (!res.success) {
          setError(res.error || "Failed to create testimonial");
          return;
        }

        setTestimonials((prev) => [...prev, res.data as Testimonial]);
        setSuccess("Testimonial added successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    startTransition(async () => {
      const res = await deleteTestimonialAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete testimonial");
        return;
      }
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    });
  };

  const handleStatusChange = (tst: Testimonial, newStatus: "approved" | "rejected") => {
    startTransition(async () => {
      const res = await updateTestimonialAction(tst.id, {
        author_name: tst.author_name,
        author_title: tst.author_title || "",
        author_avatar_url: tst.author_avatar_url || "",
        rating: tst.rating,
        content: tst.content,
        status: newStatus,
      });

      if (!res.success) {
        alert(res.error || "Failed to change status");
        return;
      }

      setTestimonials((prev) =>
        prev.map((t) => (t.id === tst.id ? (res.data as Testimonial) : t))
      );
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">টেস্টিমোনিয়্যালস ম্যানেজার (Testimonials CMS)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              গ্রাহক এবং দর্শকদের প্রদানকৃত প্রশংসাপত্রসমূহ এখান থেকে অ্যাপ্রুভ, রিজেক্ট বা এডিট করুন।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            {t({ bn: "নতুন প্রশংসাপত্র যুক্ত করুন", en: "Add Testimonial" })}
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
              placeholder={t({ bn: " প্রশংসাপত্র খুঁজুন...", en: "Search by author name, content, title..." })}
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Reveal>

      {/* Testimonials list */}
      <div className="space-y-4">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((tst, idx) => (
            <Reveal key={tst.id} delay={idx * 30} direction="fade">
              <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/10 bg-surface/20 hover:bg-surface/30 backdrop-blur shadow-soft flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="space-y-4 flex-1">
                  {/* Status & Rating */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        tst.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                          : tst.status === "rejected"
                          ? "bg-brand-500/10 text-brand-500 border border-brand-500/10"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                      }`}
                    >
                      {tst.status}
                    </span>

                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, rIdx) => (
                        <Star
                          key={rIdx}
                          className={`h-3.5 w-3.5 ${
                            rIdx < tst.rating ? "text-gold-500 fill-gold-500" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Content & Author Info */}
                  <div className="space-y-3">
                    <p className="text-sm text-fg-soft leading-relaxed italic">&ldquo;{tst.content}&rdquo;</p>
                    
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-9 w-9 overflow-hidden rounded-full bg-canvas-muted border border-border/10 flex items-center justify-center">
                        {tst.author_avatar_url ? (
                          <img src={tst.author_avatar_url} alt={tst.author_name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-fg-muted" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-fg text-sm">{tst.author_name}</h4>
                        <p className="text-xs text-fg-muted">{tst.author_title || "Client"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                  {tst.status !== "approved" && (
                    <button
                      onClick={() => handleStatusChange(tst, "approved")}
                      disabled={isPending}
                      className="p-2 text-emerald-500 hover:bg-emerald-500/5 border border-border/10 rounded-full transition-all"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {tst.status !== "rejected" && (
                    <button
                      onClick={() => handleStatusChange(tst, "rejected")}
                      disabled={isPending}
                      className="p-2 text-brand-500 hover:bg-brand-500/5 border border-border/10 rounded-full transition-all"
                      title="Reject"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => openEditModal(tst)}
                    className="p-2 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tst.id)}
                    className="p-2 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-sm text-fg-muted italic text-center py-10 card-surface border border-border/10 rounded-3xl bg-surface/10">
              কোনো প্রশংসাপত্র পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>

      {/* Add & Edit Testimonial Modal Form */}
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
                {editingTestimonial ? "প্রশংসাপত্র এডিট করুন" : "নতুন প্রশংসাপত্র যুক্ত করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">
                {editingTestimonial ? "Edit custom client review or rating details." : "Directly append a new approved client review."}
              </p>
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

              {/* Author Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="authorName">
                    Author Name
                  </label>
                  <input
                    id="authorName"
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Mominur Rahman"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="authorTitle">
                    Author Title / Position
                  </label>
                  <input
                    id="authorTitle"
                    type="text"
                    value={authorTitle}
                    onChange={(e) => setAuthorTitle(e.target.value)}
                    placeholder="CEO at DevTech"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Avatar URL & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="authorAvatarUrl">
                    Avatar Image URL
                  </label>
                  <input
                    id="authorAvatarUrl"
                    type="text"
                    value={authorAvatarUrl}
                    onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="rating">
                    Rating Stars (1 - 5)
                  </label>
                  <input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="content">
                  Feedback / Review
                </label>
                <textarea
                  id="content"
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="The developer did an outstanding job on our platform..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="status">
                  Approval Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-fg"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
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
                    "Save Testimonial"
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
