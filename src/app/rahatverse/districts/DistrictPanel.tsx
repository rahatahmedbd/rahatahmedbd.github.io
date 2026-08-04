"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface DistrictPanelProps {
  title: string;
  icon: string;
  description: string;
  stats?: ReadonlyArray<{ label: string; value: string }>;
  onContinue: () => void;
  onExplore: () => void;
  onClose: () => void;
}

export function DistrictPanel({
  title,
  icon,
  description,
  stats = [],
  onContinue,
  onExplore,
  onClose,
}: DistrictPanelProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0f172a] border border-white/20 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{icon}</div>
            <div>
              <div className="text-sm text-[#22d3ee]">DISTRICT</div>
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close district panel"
            className="text-3xl text-white/50 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-white/80 leading-relaxed">{description}</p>

          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-4">
                  <div className="text-2xl font-semibold text-[#22d3ee]">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex flex-col gap-3">
          <Button onClick={onExplore} className="w-full bg-[#22d3ee] text-black hover:bg-[#67e8f9]">
            Explore This Area
          </Button>
          <div className="flex gap-3">
            <Button onClick={onContinue} variant="outline" className="flex-1 border-white/30">
              Continue Tour
            </Button>
            <Button onClick={onClose} variant="ghost" className="flex-1 text-white/70">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
