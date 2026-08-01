"use client";

import { useState } from "react";
import {
  Briefcase,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  X,
  FileText,
  User,
  Info,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Reveal } from "@/components/ui/reveal";

interface Project {
  id: string;
  reference: string;
  client_id: string | null;
  status: string;
  total_amount: number;
  currency: string;
  notes: string | null;
  client_info: any;
  website_type: string | null;
  required_features: string[] | null;
  design_preference: string[] | null;
  budget_option: string | null;
  deadline_option: string | null;
  project_details: string | null;
  uploaded_files: any[] | null;
  estimated_cost: number | null;
  estimated_delivery: string | null;
  final_price: number | null;
  final_delivery: string | null;
  is_priority: boolean;
  internal_notes: string | null;
  internal_files: any[] | null;
  created_at: string;
}

interface ProjectsListProps {
  initialProjects: Project[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const { t, lang } = useLanguage();
  const [projects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((prj) => {
    const matchesSearch =
      prj.reference.toLowerCase().includes(search.toLowerCase()) ||
      (prj.website_type && prj.website_type.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === "all" || prj.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return lang === "bn"
      ? d.toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
      : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // Maps status to timeline stage index (0-8)
  const getTimelineStage = (status: string): number => {
    const s = status.toLowerCase();
    if (s === "pending") return 0; // Project Received
    if (s === "contacted") return 1; // Requirement Review
    if (s === "waiting for client" || s === "quote sent") return 2; // Quote Approved
    if (s === "quote accepted" || s === "project started" || s === "ui/ux design") return 3; // UI/UX Design
    if (s === "development") return 4; // Development
    if (s === "testing") return 5; // Testing
    if (s === "revision") return 6; // Revision
    if (s === "completed") return 8; // Completed
    // default/deployment:
    return 7; // Deployment
  };

  const stages = [
    { title: "Project Received", bn: "প্রজেক্ট প্রাপ্ত" },
    { title: "Requirement Review", bn: "রিকোয়ারমেন্ট রিভিউ" },
    { title: "Quote Approved", bn: "বাজেট অনুমোদিত" },
    { title: "UI/UX Design", bn: "ইউআই/ইউএক্স ডিজাইন" },
    { title: "Development", bn: "ডেভেলপমেন্ট" },
    { title: "Testing", bn: "টেস্টিং ও নিরীক্ষা" },
    { title: "Revision", bn: "সংশোধন (Revision)" },
    { title: "Deployment", bn: "ডেপ্লয়মেন্ট" },
    { title: "Completed", bn: "প্রজেক্ট সম্পন্ন" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">আমার প্রজেক্ট সমূহ (My Projects)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            আপনার প্রজেক্টের লাইভ কাজের অগ্রগতি, বিবরণী এবং ডেলিভারি ডিটেইলস এখান থেকে তদারকি করুন।
          </p>
        </div>
      </Reveal>

      {/* Filter & Search */}
      <Reveal delay={60}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by reference or type..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </Reveal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((prj) => {
            const currentStageIdx = getTimelineStage(prj.status);
            return (
              <Reveal key={prj.id} direction="scale">
                <div className="card-surface p-6 rounded-3xl border border-border/10 bg-surface/20 hover:bg-surface/30 shadow-soft flex flex-col justify-between h-full gap-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-fg text-sm">{prj.reference}</span>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/10">
                        {prj.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-fg text-base">{prj.website_type}</h3>
                      <p className="text-xs text-fg-soft leading-relaxed line-clamp-2">{prj.project_details || "No description."}</p>
                    </div>

                    {/* Simple Mini-Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-fg-muted font-bold uppercase tracking-wider">
                        <span>Progress stage</span>
                        <span>{stages[currentStageIdx].title}</span>
                      </div>
                      <div className="w-full bg-canvas rounded-full h-2 overflow-hidden border border-border/5">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${((currentStageIdx + 1) / stages.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/5 pt-4">
                    <span className="text-xs text-fg-muted">Price: {prj.final_price ? `$${prj.final_price}` : `$${prj.estimated_cost} (Est)`}</span>
                    <button
                      onClick={() => setSelectedProject(prj)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })
        ) : (
          <p className="text-sm text-fg-muted italic text-center py-10 card-surface border border-border/10 rounded-3xl bg-surface/10 col-span-full">
            কোনো প্রজেক্ট পাওয়া যায়নি।
          </p>
        )}
      </div>

      {/* Expanded Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div className="relative w-full max-w-4xl bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-8">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-fg">
                  {selectedProject.website_type}
                </h3>
                <span className="font-mono text-brand-500 text-xs font-semibold px-2.5 py-0.5 rounded border border-border/10">
                  {selectedProject.reference}
                </span>
              </div>
              <p className="text-xs text-fg-soft mt-1">Submitted on {formatDate(selectedProject.created_at)}</p>
            </div>

            {/* PROGRESS TIMELINE STAGE */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Project Progress Timeline</h4>
              
              <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
                {stages.map((stage, sIdx) => {
                  const currentStageIdx = getTimelineStage(selectedProject.status);
                  const active = sIdx <= currentStageIdx;
                  return (
                    <div key={sIdx} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative text-center">
                      {/* Connection bar - Desktop */}
                      {sIdx !== stages.length - 1 && (
                        <div
                          className={`hidden md:block absolute top-4 left-[50%] right-[-50%] h-0.5 -z-10 ${
                            sIdx < currentStageIdx ? "bg-brand-500" : "bg-border/10"
                          }`}
                        />
                      )}

                      {/* Dot icon */}
                      <div
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold border transition-all ${
                          active
                            ? "bg-brand-500 text-white border-brand-500 shadow-soft"
                            : "bg-canvas text-fg-muted border-border/10"
                        }`}
                      >
                        {active ? <CheckCircle className="h-4 w-4" /> : sIdx + 1}
                      </div>

                      <div className="text-left md:text-center">
                        <p className={`text-xs font-bold leading-tight ${active ? "text-fg" : "text-fg-muted"}`}>
                          {stage.title}
                        </p>
                        <p className="text-[10px] text-fg-muted mt-0.5">{stage.bn}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Specifications Details columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/5 pt-6">
              {/* Left specifications */}
              <div className="space-y-4 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-2">Specifications</h4>
                
                <div className="flex justify-between py-1.5 border-b border-border/5">
                  <span className="text-fg-soft font-medium flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-brand-500" />
                    Estimated Price:
                  </span>
                  <span className="font-semibold text-fg">${selectedProject.estimated_cost}</span>
                </div>

                {selectedProject.final_price && (
                  <div className="flex justify-between py-1.5 border-b border-border/5">
                    <span className="text-fg-soft font-medium flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                      Final Price:
                    </span>
                    <span className="font-extrabold text-gradient text-sm">${selectedProject.final_price}</span>
                  </div>
                )}

                <div className="flex justify-between py-1.5 border-b border-border/5">
                  <span className="text-fg-soft font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-500" />
                    Target Timeline:
                  </span>
                  <span className="font-semibold text-fg">{selectedProject.estimated_delivery}</span>
                </div>

                {selectedProject.final_delivery && (
                  <div className="flex justify-between py-1.5 border-b border-border/5">
                    <span className="text-fg-soft font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                      Final Delivery:
                    </span>
                    <span className="font-bold text-fg">{selectedProject.final_delivery}</span>
                  </div>
                )}
              </div>

              {/* Right lists */}
              <div className="space-y-4 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-2">Required Features</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.required_features && selectedProject.required_features.map((f) => (
                    <span key={f} className="bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded border border-brand-500/10">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Note details */}
            <div className="border-t border-border/5 pt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-fg-muted">Project Brief / Details</h4>
              <p className="text-xs text-fg-soft leading-relaxed whitespace-pre-line bg-canvas-muted p-4 rounded-2xl border border-border/5">
                {selectedProject.project_details}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
