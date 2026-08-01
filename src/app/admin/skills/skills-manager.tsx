"use client";

import { useState, useTransition } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createSkillAction, updateSkillAction, deleteSkillAction } from "@/app/actions/business";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  sort_order: number;
}

interface SkillsManagerProps {
  initialSkills: Skill[];
}

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Form & Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [proficiency, setProficiency] = useState(80);
  const [sortOrder, setSortOrder] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter & Search
  const filteredSkills = skills.filter(
    (sk) =>
      sk.name.toLowerCase().includes(search.toLowerCase()) ||
      sk.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingSkill(null);
    setName("");
    setCategory("Frontend");
    setProficiency(80);
    setSortOrder(skills.length + 1);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sk: Skill) => {
    setEditingSkill(sk);
    setName(sk.name);
    setCategory(sk.category);
    setProficiency(sk.proficiency);
    setSortOrder(sk.sort_order);
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
        category,
        proficiency,
        sortOrder,
      };

      if (editingSkill) {
        // Edit
        const res = await updateSkillAction(editingSkill.id, payload);

        if (!res.success) {
          setError(res.error || "Failed to update skill");
          return;
        }

        setSkills((prev) =>
          prev
            .map((s) => (s.id === editingSkill.id ? (res.data as Skill) : s))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Skill updated successfully!");
      } else {
        // Create
        const res = await createSkillAction(payload);

        if (!res.success) {
          setError(res.error || "Failed to create skill");
          return;
        }

        setSkills((prev) => [...prev, res.data as Skill].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Skill created successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    startTransition(async () => {
      const res = await deleteSkillAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete skill");
        return;
      }
      setSkills((prev) => prev.filter((s) => s.id !== id));
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newSkills = [...skills];
    const targetIdx = direction === "up" ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newSkills.length) return;

    // Swap sort orders
    const currentSkill = newSkills[index];
    const targetSkill = newSkills[targetIdx];

    const tempOrder = currentSkill.sort_order;
    currentSkill.sort_order = targetSkill.sort_order;
    targetSkill.sort_order = tempOrder;

    // Re-sort local state
    const sorted = [...newSkills].sort((a, b) => a.sort_order - b.sort_order);
    setSkills(sorted);

    // Save in DB silently
    await updateSkillAction(currentSkill.id, currentSkill);
    await updateSkillAction(targetSkill.id, targetSkill);
  };

  const categories = ["Frontend", "Backend", "Database", "Other"];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">দক্ষতা ও স্কিলস ম্যানেজার (Skills CMS)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              আপনার প্রোগ্রামিং ভাষা, ফ্রেমওয়ার্ক এবং প্রযুক্তিগত দক্ষতা কন্টেন্ট কোনো কোড চেঞ্জ ছাড়াই ম্যানেজ করুন।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            {t({ bn: "নতুন দক্ষতা যুক্ত করুন", en: "Add New Skill" })}
          </button>
        </div>
      </Reveal>

      {/* Filter and Search */}
      <Reveal delay={60}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name or category..."
            className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
          />
        </div>
      </Reveal>

      {/* Skills list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((sk, idx) => (
            <Reveal key={sk.id} delay={idx * 30} direction="scale">
              <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/10 bg-surface/20 hover:bg-surface/30 shadow-soft flex flex-col justify-between h-full gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-500/10">
                      {sk.category}
                    </span>
                    <span className="text-[10px] text-fg-muted">Sort Order: {sk.sort_order}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-fg text-base">{sk.name}</h3>
                    
                    {/* Proficiency progress bar */}
                    <div className="space-y-1.5 mt-3">
                      <div className="flex justify-between text-[10px] text-fg-soft font-bold uppercase">
                        <span>Proficiency</span>
                        <span>{sk.proficiency}%</span>
                      </div>
                      <div className="w-full bg-canvas rounded-full h-2 overflow-hidden border border-border/5">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${sk.proficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-2 border-t border-border/5 pt-4">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === filteredSkills.length - 1}
                    className="p-1.5 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => openEditModal(sk)}
                    className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sk.id)}
                    className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-sm text-fg-muted italic text-center py-10 card-surface border border-border/10 rounded-3xl bg-surface/10">
              কোনো স্কিল তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>

      {/* Add & Edit Skill Modal Form */}
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
                {editingSkill ? "দক্ষতা পরিবর্তন করুন" : "নতুন দক্ষতা যুক্ত করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">Register dynamic programming language or tech stack skills.</p>
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

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="name">
                  Skill Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="React.js"
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                />
              </div>

              {/* Category and Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="sort">
                    Sort Order
                  </label>
                  <input
                    id="sort"
                    type="number"
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Proficiency (Slider / Input) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Proficiency ({proficiency}%)
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-canvas border border-border/10 accent-brand-500"
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
                    "Save Skill"
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
