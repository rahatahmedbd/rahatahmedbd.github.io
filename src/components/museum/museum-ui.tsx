"use client";

import { X, ChevronLeft, ArrowRight, Monitor, LayoutDashboard, Search, Cpu, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const QUICK_FILTERS = ["NGO", "Business", "Portfolio", "E-commerce", "Dashboard", "Web App", "Landing Page", "Custom"];

export function MuseumUI({
  view,
  project,
  onBack,
  projects,
  onSelect,
}: {
  view: string;
  project: any;
  onBack: () => void;
  projects: any[];
  onSelect: (id: string) => void;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const hay = [
        p.title,
        p.summary,
        p.description,
        p.categories?.name,
        ...(Array.isArray(p.technologies) ? p.technologies : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [projects, query]);

  const openProject = (id: string) => {
    onSelect(id);
    setShowSearch(false);
    setQuery("");
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="pointer-events-auto flex min-w-0 items-center gap-3 sm:gap-4">
          <Link
            href="/rahatverse"
            aria-label="Back to RahatVerse"
            className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white sm:h-12 sm:w-12"
          >
            <X className="h-5 w-5" />
          </Link>
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-sm font-black uppercase tracking-widest text-white drop-shadow-md sm:text-xl">
              Portfolio Museum
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#22d3ee] sm:text-xs">
              {view === "lobby" ? "Main Lobby" : "Exhibition Room"}
            </p>
          </div>
        </div>

        {view === "lobby" && (
          <div className="pointer-events-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSearch(true)}
              aria-label="Search projects"
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white sm:h-12 sm:px-5"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search Projects</span>
            </button>
            <div className="hidden h-12 items-center gap-2 rounded-full border border-[#f43f5e]/50 bg-[#f43f5e]/20 px-5 text-sm font-bold text-[#f43f5e] backdrop-blur-md md:flex">
              <Cpu className="h-4 w-4" />
              <span>{projects.length} Artifacts Online</span>
            </div>
          </div>
        )}

        {view === "room" && (
          <button
            onClick={onBack}
            aria-label="Return to lobby"
            className="pointer-events-auto flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10 hover:scale-105 sm:h-12 sm:px-5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Return to Lobby</span>
          </button>
        )}
      </div>

      {/* Middle/Bottom — project detail card */}
      {view === "room" && project && (
        <div className="pointer-events-auto mb-2 w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 self-center overflow-y-auto rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl [max-height:min(60vh,34rem)] sm:mb-4 sm:self-end sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
            {project.featured && (
              <span className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-400">
                <Star className="h-3 w-3" />
                <span>FEATURED</span>
              </span>
            )}
            {project.categories?.name && (
              <span className="rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/20 px-3 py-1 text-xs font-bold text-[#22d3ee]">
                {project.categories.name}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black text-white sm:text-4xl">{project.title}</h2>
          <p className="mt-2 leading-relaxed text-white/70 [font-size:15px]">
            {project.summary || project.description || "No description provided."}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:scale-105"
              >
                <Monitor className="h-4 w-4" />
                <span>Launch Live</span>
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                <Cpu className="h-4 w-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Exit Guide */}
      {view === "lobby" && (
        <div className="pointer-events-auto w-full max-w-md animate-in fade-in slide-in-from-right-8 self-end rounded-2xl border border-[#f43f5e]/30 bg-black/60 p-4 backdrop-blur-xl sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f43f5e]/20 text-[#f43f5e] sm:h-12 sm:w-12">
              <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white sm:text-lg">AI Guide</h3>
              <p className="mt-1 text-sm text-white/70">
                &ldquo;You&rsquo;ve seen what I can build. Now let&rsquo;s build something for you.&rdquo;
              </p>
              <Link
                href="/rahatverse"
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#22d3ee] hover:underline sm:mt-4"
              >
                <span>Proceed to Website Factory</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search modal — live search across the real project list */}
      {showSearch && (
        <div
          className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xl sm:items-center sm:p-6"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="flex max-h-[88dvh] w-full max-w-2xl flex-col rounded-t-3xl border border-white/10 bg-[#0b1526] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Search Archives</h2>
              <button
                onClick={() => setShowSearch(false)}
                aria-label="Close search"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, tech, keywords..."
                autoFocus
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-white placeholder-white/40 focus:border-[#22d3ee] focus:outline-none"
              />
            </div>

            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
              {QUICK_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setQuery(f)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    query.toLowerCase() === f.toLowerCase()
                      ? "border-[#22d3ee]/60 bg-[#22d3ee]/20 text-[#22d3ee]"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-[#22d3ee]/50 hover:bg-[#22d3ee]/20 hover:text-[#22d3ee]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {results.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/40">
                  No projects match “{query}”. Try another keyword.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => openProject(p.id)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-[#22d3ee]/40 hover:bg-[#22d3ee]/10"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-white">{p.title}</span>
                          {p.categories?.name && (
                            <span className="block text-xs text-white/45">{p.categories.name}</span>
                          )}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#22d3ee]" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
