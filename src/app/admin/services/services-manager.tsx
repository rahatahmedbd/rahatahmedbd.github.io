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
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createServiceAction, updateServiceAction, deleteServiceAction } from "@/app/actions/cms";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Service {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  icon: string;
  sort_order: number;
  is_enabled: boolean;
}

interface ServicesManagerProps {
  initialServices: Service[];
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Form & Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingFaq] = useState<Service | null>(null);

  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [icon, setIcon] = useState("Sparkles");
  const [sortOrder, setSortOrder] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter & Search
  const filteredServices = services.filter(
    (srv) =>
      srv.title_en.toLowerCase().includes(search.toLowerCase()) ||
      srv.title_bn.toLowerCase().includes(search.toLowerCase()) ||
      (srv.description_en && srv.description_en.toLowerCase().includes(search.toLowerCase())) ||
      (srv.description_bn && srv.description_bn.toLowerCase().includes(search.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingFaq(null);
    setTitleEn("");
    setTitleBn("");
    setDescriptionEn("");
    setDescriptionBn("");
    setIcon("Sparkles");
    setSortOrder(services.length + 1);
    setIsEnabled(true);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (srv: Service) => {
    setEditingFaq(srv);
    setTitleEn(srv.title_en);
    setTitleBn(srv.title_bn);
    setDescriptionEn(srv.description_en || "");
    setDescriptionBn(srv.description_bn || "");
    setIcon(srv.icon);
    setSortOrder(srv.sort_order);
    setIsEnabled(srv.is_enabled);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      if (editingService) {
        // Edit existing
        const res = await updateServiceAction(editingService.id, {
          title_en: titleEn,
          title_bn: titleBn,
          description_en: descriptionEn,
          description_bn: descriptionBn,
          icon,
          sort_order: sortOrder,
          is_enabled: isEnabled,
        });

        if (!res.success) {
          setError(res.error || "Failed to update service");
          return;
        }

        setServices((prev) =>
          prev
            .map((s) => (s.id === editingService.id ? (res.data as Service) : s))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Service updated successfully!");
      } else {
        // Create new
        const res = await createServiceAction({
          title_en: titleEn,
          title_bn: titleBn,
          description_en: descriptionEn,
          description_bn: descriptionBn,
          icon,
          sort_order: sortOrder,
          is_enabled: isEnabled,
        });

        if (!res.success) {
          setError(res.error || "Failed to create service");
          return;
        }

        setServices((prev) => [...prev, res.data as Service].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Service created successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    startTransition(async () => {
      const res = await deleteServiceAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete service");
        return;
      }
      setServices((prev) => prev.filter((s) => s.id !== id));
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newServices = [...services];
    const targetIdx = direction === "up" ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newServices.length) return;

    // Swap sort orders
    const currentService = newServices[index];
    const targetService = newServices[targetIdx];

    const tempOrder = currentService.sort_order;
    currentService.sort_order = targetService.sort_order;
    targetService.sort_order = tempOrder;

    // Re-sort local state
    const sorted = [...newServices].sort((a, b) => a.sort_order - b.sort_order);
    setServices(sorted);

    // Save in DB silently
    await updateServiceAction(currentService.id, currentService);
    await updateServiceAction(targetService.id, targetService);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">সার্ভিসেস ম্যানেজার (Services Manager)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              আপনার প্রদানকৃত সেবাসমূহ এবং বিবরণ কোনো কোড এডিট ছাড়াই এখান থেকে পরিচালনা করুন।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            {t({ bn: "নতুন সার্ভিস যুক্ত করুন", en: "Add New Service" })}
          </button>
        </div>
      </Reveal>

      {/* Search Bar */}
      <Reveal delay={60}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t({ bn: "সার্ভিস খুঁজুন...", en: "Search services by English or Bengali title..." })}
            className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
          />
        </div>
      </Reveal>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((srv, idx) => (
            <Reveal key={srv.id} delay={idx * 40} direction="scale">
              <div className="card-surface p-6 rounded-3xl border border-border/10 bg-surface/20 hover:bg-surface/30 backdrop-blur shadow-soft flex flex-col justify-between gap-5 h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-brand-500/10">
                      Icon: {srv.icon}
                    </span>
                    {!srv.is_enabled && (
                      <span className="inline-flex items-center gap-1 bg-fg-muted/10 text-fg-soft text-xs font-semibold px-2.5 py-1 rounded-full">
                        <EyeOff className="h-3 w-3" /> Disabled
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="border-b border-border/5 pb-2">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-fg-muted">English</p>
                      <h3 className="font-bold text-fg text-base">{srv.title_en}</h3>
                      <p className="text-xs text-fg-soft mt-1 leading-relaxed">{srv.description_en || "No description provided."}</p>
                    </div>

                    <div className="pt-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-fg-muted">Bengali</p>
                      <h3 className="font-bold text-fg text-base">{srv.title_bn}</h3>
                      <p className="text-xs text-fg-soft mt-1 leading-relaxed">{srv.description_bn || "কোনো বিবরণ প্রদান করা হয়নি।"}</p>
                    </div>
                  </div>
                </div>

                {/* Service Control buttons */}
                <div className="flex items-center justify-between border-t border-border/5 pt-4 mt-auto">
                  <span className="text-xs text-fg-muted">Sort Order: {srv.sort_order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === filteredServices.length - 1}
                      className="p-1.5 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => openEditModal(srv)}
                      className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
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
              কোনো সার্ভিস তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>

      {/* Add & Edit Service Modal Form */}
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
                {editingService ? "সার্ভিস এডিট করুন" : "নতুন সার্ভিস যুক্ত করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">
                {editingService ? "Edit existing service information." : "Create and publish a new custom service offering."}
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

              {/* Title (En & Bn) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="titleEn">
                    English Title
                  </label>
                  <input
                    id="titleEn"
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Web Development"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="titleBn">
                    Bengali Title
                  </label>
                  <input
                    id="titleBn"
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="ওয়েব ডেভেলপমেন্ট"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description English */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="descriptionEn">
                  English Description
                </label>
                <textarea
                  id="descriptionEn"
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Describe your service in English..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Description Bengali */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="descriptionBn">
                  Bengali Description
                </label>
                <textarea
                  id="descriptionBn"
                  rows={3}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="সেবাটির বিবরণ বাংলায় লিখুন..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Icon & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="icon">
                    Icon Name (Lucide Icon)
                  </label>
                  <input
                    id="icon"
                    type="text"
                    required
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Code, Heart, GraduationCap"
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

              {/* Is Enabled Toggle */}
              <div className="flex items-center gap-2.5 py-1 px-1">
                <input
                  id="isEnabled"
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="rounded border-border/20 text-brand-500 focus:ring-brand-500 h-4 w-4 bg-canvas/30"
                />
                <label htmlFor="isEnabled" className="text-xs text-fg-soft font-semibold cursor-pointer select-none">
                  Enable Service (Visible on public site)
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
                    "Save Service"
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
