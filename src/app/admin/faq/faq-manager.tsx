"use client";

import { useState, useTransition } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createFaqAction, updateFaqAction, deleteFaqAction } from "@/app/actions/cms";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  published: boolean;
}

interface FaqManagerProps {
  initialFaqs: Faq[];
}

export function FaqManager({ initialFaqs }: FaqManagerProps) {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Form & Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter & Search
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setSortOrder(faqs.length + 1);
    setPublished(true);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: Faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setSortOrder(faq.sort_order);
    setPublished(faq.published);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      if (editingFaq) {
        // Edit existing
        const res = await updateFaqAction(editingFaq.id, {
          question,
          answer,
          category,
          sort_order: sortOrder,
          published,
        });

        if (!res.success) {
          setError(res.error || "Failed to update FAQ");
          return;
        }

        setFaqs((prev) =>
          prev
            .map((f) => (f.id === editingFaq.id ? (res.data as Faq) : f))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("FAQ updated successfully!");
      } else {
        // Create new
        const res = await createFaqAction({
          question,
          answer,
          category,
          sort_order: sortOrder,
          published,
        });

        if (!res.success) {
          setError(res.error || "Failed to create FAQ");
          return;
        }

        setFaqs((prev) => [...prev, res.data as Faq].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("FAQ created successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    startTransition(async () => {
      const res = await deleteFaqAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete FAQ");
        return;
      }
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newFaqs = [...faqs];
    const targetIdx = direction === "up" ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newFaqs.length) return;

    // Swap sort orders
    const currentFaq = newFaqs[index];
    const targetFaq = newFaqs[targetIdx];

    const tempOrder = currentFaq.sort_order;
    currentFaq.sort_order = targetFaq.sort_order;
    targetFaq.sort_order = tempOrder;

    // Re-sort local state
    const sorted = [...newFaqs].sort((a, b) => a.sort_order - b.sort_order);
    setFaqs(sorted);

    // Save in DB silently
    await updateFaqAction(currentFaq.id, currentFaq);
    await updateFaqAction(targetFaq.id, targetFaq);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">এফএকিউ ম্যানেজার (FAQ Manager)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              যেকোনো প্রশ্নের উত্তর এবং ক্যাটাগরি সম্পূর্ণ ডাইনামিকভাবে এখান থেকে ম্যানেজ করুন।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            {t({ bn: "নতুন এফএকিউ যুক্ত করুন", en: "Add New FAQ" })}
          </button>
        </div>
      </Reveal>

      {/* Filter and Search bar */}
      <Reveal delay={60}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t({ bn: "এফএকিউ খুঁজুন...", en: "Search FAQs by question, answer, category..." })}
            className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
          />
        </div>
      </Reveal>

      {/* FAQ list */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <Reveal key={faq.id} delay={idx * 30} direction="fade">
              <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/10 bg-surface/20 hover:bg-surface/30 backdrop-blur shadow-soft flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-brand-500/10">
                      {faq.category}
                    </span>
                    {!faq.published && (
                      <span className="inline-flex items-center gap-1 bg-fg-muted/10 text-fg-soft text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        <EyeOff className="h-3 w-3" /> Hidden
                      </span>
                    )}
                    <span className="text-xs text-fg-muted">Sort Order: {faq.sort_order}</span>
                  </div>

                  <h3 className="font-bold text-fg flex items-start gap-2 text-base leading-snug">
                    <HelpCircle className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-sm text-fg-soft pl-7 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                </div>

                {/* FAQ Control buttons */}
                <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                  {/* Reorder Buttons */}
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-2 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === filteredFaqs.length - 1}
                    className="p-2 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>

                  {/* Edit & Delete */}
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-2 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
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
          <Reveal direction="fade">
            <p className="text-sm text-fg-muted italic text-center py-10 card-surface border border-border/10 rounded-3xl bg-surface/10">
              কোনো প্রশ্নোত্তর পাওয়া যায়নি।
            </p>
          </Reveal>
        )}
      </div>

      {/* Add & Edit FAQ Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-fg">
                {editingFaq ? "এফএকিউ এডিট করুন" : "নতুন এফএকিউ যুক্ত করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">
                {editingFaq ? "Edit existing FAQ question and details." : "Create and append a new FAQ to the list."}
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

              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="question">
                  {t({ bn: "প্রশ্ন (Question)", en: "Question" })}
                </label>
                <input
                  id="question"
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What services do you provide?"
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Answer */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="answer">
                  {t({ bn: "উত্তর (Answer)", en: "Answer" })}
                </label>
                <textarea
                  id="answer"
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide a detailed, helpful response..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Category & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="category">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="General, Technical, Blood"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="sortOrder">
                    Sort Order
                  </label>
                  <input
                    id="sortOrder"
                    type="number"
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    placeholder="1"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-2.5 py-1 px-1">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-border/20 text-brand-500 focus:ring-brand-500 h-4 w-4 bg-canvas/30"
                />
                <label htmlFor="published" className="text-xs text-fg-soft font-semibold cursor-pointer select-none">
                  {t({ bn: "প্রকাশ করুন (Publish / Make Visible)", en: "Publish FAQ (Visible on Site)" })}
                </label>
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
                    "Save FAQ"
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
