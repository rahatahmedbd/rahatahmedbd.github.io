"use client";

import React from "react";
import Link from "next/link";

interface InfoPanelProps {
  stop: {
    id: string;
    name: string;
    description: string;
  } | null;
  onClose: () => void;
}

export function InfoPanel({ stop, onClose }: InfoPanelProps) {
  if (!stop) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[90] w-full max-w-[340px] -translate-x-1/2 px-4">
      <div className="rounded-3xl border border-white/10 bg-black/85 backdrop-blur-2xl p-5 shadow-2xl">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[1.5px] text-[#67e8f9]/80 font-medium">DISTRICT</div>
            <h3 className="text-[21px] font-semibold tracking-[-0.3px] text-white leading-tight mt-1">{stop.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close district info panel"
            className="text-white/40 hover:text-white text-2xl leading-none -mt-1 -mr-1"
          >
            ×
          </button>
        </div>

        <p className="text-white/75 text-[13.5px] leading-relaxed mb-5">{stop.description}</p>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/15 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/5 active:bg-white/10"
          >
            Continue Tour
          </button>
          <Link href="/portfolio" className="flex-1">
            <button className="w-full rounded-2xl bg-white py-2.5 text-sm font-semibold text-[#0a0c12] transition hover:bg-[#f4f4f5] active:bg-white">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
