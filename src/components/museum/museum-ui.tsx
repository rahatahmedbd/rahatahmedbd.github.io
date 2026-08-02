"use client";

import { X, ChevronLeft, ArrowRight, Download, Monitor, Smartphone, LayoutDashboard, Search, Filter, Cpu, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MuseumUI({ 
  view, 
  project, 
  onBack,
  projectsCount
}: { 
  view: string, 
  project: any, 
  onBack: () => void,
  projectsCount: number
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex items-start justify-between">
        <div className="pointer-events-auto flex items-center space-x-4">
          <Link href="/rahatverse" className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-widest text-white shadow-black drop-shadow-md">Portfolio Museum</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#22d3ee]">{view === "lobby" ? "Main Lobby" : "Exhibition Room"}</p>
          </div>
        </div>

        {view === "lobby" && (
          <div className="pointer-events-auto flex space-x-3">
            <button 
              onClick={() => alert("Download Center: Feature launching soon, syncing with Admin Panel Media Manager.")}
              className="flex h-12 items-center justify-center space-x-2 rounded-full bg-white/5 border border-white/10 px-5 text-sm font-semibold text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              <Download className="h-4 w-4" />
              <span>Download Center</span>
            </button>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="flex h-12 items-center justify-center space-x-2 rounded-full bg-white/5 border border-white/10 px-5 text-sm font-semibold text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            >
              <Search className="h-4 w-4" />
              <span>Search Projects</span>
            </button>
            <div className="flex h-12 items-center justify-center space-x-2 rounded-full bg-[#f43f5e]/20 border border-[#f43f5e]/50 px-5 text-sm font-bold text-[#f43f5e] backdrop-blur-md">
              <Cpu className="h-4 w-4" />
              <span>{projectsCount} Artifacts Online</span>
            </div>
          </div>
        )}

        {view === "room" && (
          <button 
            onClick={onBack}
            className="pointer-events-auto flex h-12 items-center justify-center space-x-2 rounded-full bg-white/5 border border-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10 hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Return to Lobby</span>
          </button>
        )}
      </div>

      {/* Middle/Bottom */}
      {view === "room" && project && (
        <div className="pointer-events-auto max-w-xl rounded-3xl bg-black/60 border border-white/10 p-8 backdrop-blur-xl mb-4 self-end animate-in fade-in slide-in-from-bottom-8">
          <div className="mb-4 flex items-center space-x-3">
            {project.featured && (
              <span className="flex items-center space-x-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-400 border border-yellow-500/30">
                <Star className="h-3 w-3" />
                <span>FEATURED</span>
              </span>
            )}
            {project.categories?.name && (
              <span className="rounded-full bg-[#22d3ee]/20 px-3 py-1 text-xs font-bold text-[#22d3ee] border border-[#22d3ee]/30">
                {project.categories.name}
              </span>
            )}
          </div>
          
          <h2 className="text-4xl font-black text-white mb-2">{project.title}</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            {project.summary || project.description || "No description provided."}
          </p>

          <div className="flex flex-wrap gap-3">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center space-x-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-105">
                <Monitor className="h-4 w-4" />
                <span>Launch Live</span>
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noreferrer" className="flex items-center space-x-2 rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20">
                <Cpu className="h-4 w-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Exit Guide */}
      {view === "lobby" && (
        <div className="pointer-events-auto self-end rounded-2xl bg-black/60 border border-[#f43f5e]/30 p-6 backdrop-blur-xl max-w-md animate-in fade-in slide-in-from-right-8">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f43f5e]/20 text-[#f43f5e]">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Guide</h3>
              <p className="mt-1 text-sm text-white/70">"You've seen what I can build. Now let's build something for you."</p>
              <Link href="/rahatverse" className="mt-4 flex items-center space-x-2 text-sm font-bold text-[#22d3ee] hover:underline">
                <span>Proceed to Website Factory</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search/Filter Modal Overlay */}
      {showSearch && (
        <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b1526] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Search Archives</h2>
              <button onClick={() => setShowSearch(false)} className="text-white/50 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input 
                type="text" 
                placeholder="Search technologies, industries, or keywords..." 
                className="w-full rounded-xl bg-white/5 border border-white/10 py-4 pl-12 pr-4 text-white placeholder-white/40 focus:border-[#22d3ee] focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["NGO", "Business", "Portfolio", "E-commerce", "Dashboard", "Web App", "Landing Page", "Custom"].map(f => (
                <button key={f} className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white/70 hover:bg-[#22d3ee]/20 hover:text-[#22d3ee] hover:border-[#22d3ee]/50 transition">
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
