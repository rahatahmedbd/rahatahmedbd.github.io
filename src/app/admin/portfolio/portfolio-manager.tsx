"use client";

import { useState, useTransition } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  ExternalLink,
  Github,
  Star,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { createProjectAction, updateProjectAction, deleteProjectAction } from "@/app/actions/cms";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  cover_image_url: string | null;
  gallery_urls: string | string[] | null;
  category_id: string | null;
  live_url: string | null;
  repo_url: string | null;
  status: "draft" | "active" | "archived";
  featured: boolean;
  sort_order: number;
  tags: string[] | null;
  categories?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

interface PortfolioManagerProps {
  initialProjects: Project[];
  categories: Category[];
}

export function PortfolioManager({ initialProjects, categories }: PortfolioManagerProps) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Form & Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [galleryUrlsText, setGalleryUrlsText] = useState(""); // comma separated
  const [tagsText, setTagsText] = useState(""); // comma separated
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "active" | "archived">("active");
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter & Search
  const filteredProjects = projects.filter((prj) => {
    const matchesSearch =
      prj.title.toLowerCase().includes(search.toLowerCase()) ||
      prj.slug.toLowerCase().includes(search.toLowerCase()) ||
      (prj.summary && prj.summary.toLowerCase().includes(search.toLowerCase())) ||
      (prj.tags && prj.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));

    const matchesStatus = filterStatus === "all" || prj.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject) {
      setSlug(generateSlug(val));
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setDescription("");
    setCategoryId(categories[0]?.id || "");
    setCoverImageUrl("");
    setGalleryUrlsText("");
    setTagsText("");
    setLiveUrl("");
    setRepoUrl("");
    setStatus("active");
    setFeatured(false);
    setSortOrder(projects.length + 1);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prj: Project) => {
    setEditingProject(prj);
    setTitle(prj.title);
    setSlug(prj.slug);
    setSummary(prj.summary || "");
    setDescription(prj.description || "");
    setCategoryId(prj.category_id || "");
    setCoverImageUrl(prj.cover_image_url || "");
    
    // Parse gallery urls
    let gallery = "";
    if (prj.gallery_urls) {
      try {
        const parsed = typeof prj.gallery_urls === "string" ? JSON.parse(prj.gallery_urls) : prj.gallery_urls;
        if (Array.isArray(parsed)) {
          gallery = parsed.join(", ");
        }
      } catch {
        gallery = "";
      }
    }
    setGalleryUrlsText(gallery);

    setTagsText(prj.tags ? prj.tags.join(", ") : "");
    setLiveUrl(prj.live_url || "");
    setRepoUrl(prj.repo_url || "");
    setStatus(prj.status);
    setFeatured(prj.featured);
    setSortOrder(prj.sort_order);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Prepare arrays
    const gallery_urls = galleryUrlsText
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    startTransition(async () => {
      const payload = {
        slug,
        title,
        summary,
        description,
        cover_image_url: coverImageUrl,
        gallery_urls,
        category_id: categoryId || undefined,
        live_url: liveUrl,
        repo_url: repoUrl,
        status,
        featured,
        sort_order: sortOrder,
        tags,
      };

      if (editingProject) {
        // Update
        const res = await updateProjectAction(editingProject.id, payload);

        if (!res.success) {
          setError(res.error || "Failed to update project");
          return;
        }

        // Add category name for display
        const categoryName = categories.find((c) => c.id === categoryId)?.name || "";
        const updatedProject = {
          ...(res.data as Project),
          categories: { name: categoryName },
        };

        setProjects((prev) =>
          prev
            .map((p) => (p.id === editingProject.id ? updatedProject : p))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Project updated successfully!");
      } else {
        // Create
        const res = await createProjectAction(payload);

        if (!res.success) {
          setError(res.error || "Failed to create project");
          return;
        }

        const categoryName = categories.find((c) => c.id === categoryId)?.name || "";
        const newProject = {
          ...(res.data as Project),
          categories: { name: categoryName },
        };

        setProjects((prev) => [...prev, newProject].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Project created successfully!");
      }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    startTransition(async () => {
      const res = await deleteProjectAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete project");
        return;
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
    });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newProjects = [...projects];
    const targetIdx = direction === "up" ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newProjects.length) return;

    // Swap sort orders
    const currentProject = newProjects[index];
    const targetProject = newProjects[targetIdx];

    const tempOrder = currentProject.sort_order;
    currentProject.sort_order = targetProject.sort_order;
    targetProject.sort_order = tempOrder;

    // Re-sort local state
    const sorted = [...newProjects].sort((a, b) => a.sort_order - b.sort_order);
    setProjects(sorted);

    // Save in DB silently
    await updateProjectAction(currentProject.id, currentProject);
    await updateProjectAction(targetProject.id, targetProject);
  };

  const handleFeatureToggle = (prj: Project) => {
    startTransition(async () => {
      const res = await updateProjectAction(prj.id, {
        ...prj,
        featured: !prj.featured,
      });

      if (!res.success) {
        alert(res.error || "Failed to feature project");
        return;
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === prj.id ? { ...p, featured: !prj.featured } : p))
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
              <span className="text-gradient">পোর্টফোলিও ক্যাবিনেট (Portfolio CMS)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              আপনার সমস্ত প্রজেক্ট বিবরণ, লিংক, ইমেজ এবং ট্যাগ কোনো কোড ছাড়াই এখান থেকে ম্যানেজ করুন।
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-brand-600 text-white px-5 h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 self-start"
          >
            <Plus className="h-4 w-4" />
            {t({ bn: "নতুন প্রজেক্ট যুক্ত করুন", en: "Add New Project" })}
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
              placeholder={t({ bn: "প্রজেক্ট খুঁজুন...", en: "Search projects by title, summary, technologies..." })}
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </Reveal>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((prj, idx) => (
            <Reveal key={prj.id} delay={idx * 30} direction="scale">
              <div className="card-surface rounded-3xl border border-border/10 bg-surface/20 hover:bg-surface/30 backdrop-blur shadow-lift overflow-hidden flex flex-col justify-between h-full">
                {/* Image & tags */}
                <div className="relative aspect-video bg-canvas-muted overflow-hidden border-b border-border/10">
                  {prj.cover_image_url ? (
                    <img src={prj.cover_image_url} alt={prj.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-fg-muted" />
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10">
                      {prj.categories?.name || "Uncategorized"}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        prj.status === "active"
                          ? "bg-emerald-500/80 text-white border-emerald-500/20"
                          : prj.status === "draft"
                          ? "bg-amber-500/80 text-white border-amber-500/20"
                          : "bg-red-500/80 text-white border-red-500/20"
                      }`}
                    >
                      {prj.status}
                    </span>
                  </div>

                  <button
                    onClick={() => handleFeatureToggle(prj)}
                    className={`absolute top-4 right-4 p-1.5 rounded-full border backdrop-blur transition-all ${
                      prj.featured
                        ? "bg-gold-500 text-white border-gold-500"
                        : "bg-black/70 text-fg-soft border-white/10 hover:text-white"
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-fg text-lg">{prj.title}</h3>
                    <p className="text-xs text-brand-500 font-mono">Slug: /{prj.slug}</p>
                    <p className="text-xs text-fg-soft leading-relaxed line-clamp-2">{prj.summary || "No description provided."}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {prj.tags && prj.tags.length > 0 ? (
                      prj.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-canvas-muted px-2 py-0.5 rounded font-semibold text-fg-soft">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] italic text-fg-muted">No technologies added</span>
                    )}
                  </div>
                </div>

                {/* Control Footer */}
                <div className="p-5 pt-0 border-t border-border/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    {prj.live_url && (
                      <a href={prj.live_url} target="_blank" rel="noopener noreferrer" className="text-fg-soft hover:text-brand-500 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {prj.repo_url && (
                      <a href={prj.repo_url} target="_blank" rel="noopener noreferrer" className="text-fg-soft hover:text-brand-500 transition-colors">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === filteredProjects.length - 1}
                      className="p-1.5 text-fg-soft hover:text-fg border border-border/10 rounded-full hover:bg-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => openEditModal(prj)}
                      className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prj.id)}
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
              কোনো প্রজেক্ট পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>

      {/* Add & Edit Project Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-fg">
                {editingProject ? "প্রজেক্ট এডিট করুন" : "নতুন প্রজেক্ট যুক্ত করুন"}
              </h3>
              <p className="text-xs text-fg-soft mt-1">
                {editingProject ? "Edit current project description, links, technologies, and images." : "Create and publish a new portfolio project."}
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

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="title">
                    Project Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="E-Commerce Web Application"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="slug">
                    URL Slug (unique)
                  </label>
                  <input
                    id="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="e-commerce-web-application"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="summary">
                  Short Summary
                </label>
                <input
                  id="summary"
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A premium, full-featured web shop with dynamic checkout..."
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="description">
                  Full Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the full story of your project, technologies used, challenges overcome, and solutions..."
                  className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Category, Status, Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-fg"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="status">
                    Visibility / Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors text-fg"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived (Legacy)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="sortOrder">
                    Sort Order
                  </label>
                  <input
                    id="sortOrder"
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image & Gallery Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="coverImageUrl">
                    Thumbnail Cover URL
                  </label>
                  <input
                    id="coverImageUrl"
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://cloudinary.com/.../img.jpg"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="galleryUrlsText">
                    Gallery URLs (comma-separated)
                  </label>
                  <input
                    id="galleryUrlsText"
                    type="text"
                    value={galleryUrlsText}
                    onChange={(e) => setGalleryUrlsText(e.target.value)}
                    placeholder="http://url1.jpg, http://url2.jpg"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Live URL & Repo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="liveUrl">
                    Live Demo Link
                  </label>
                  <input
                    id="liveUrl"
                    type="text"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://myproject.com"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="repoUrl">
                    GitHub Repo Link
                  </label>
                  <input
                    id="repoUrl"
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/user/project"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Technologies / Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="tagsText">
                  Technologies / Tags (comma-separated)
                </label>
                <input
                  id="tagsText"
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="React, Next.js, TailwindCSS, Supabase"
                  className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>

              {/* Featured Project Toggle */}
              <div className="flex items-center gap-2.5 py-1 px-1">
                <input
                  id="featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border/20 text-brand-500 focus:ring-brand-500 h-4 w-4 bg-canvas/30"
                />
                <label htmlFor="featured" className="text-xs text-fg-soft font-semibold cursor-pointer select-none">
                  Feature Project (Pin to home section)
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
                    "Save Project"
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
