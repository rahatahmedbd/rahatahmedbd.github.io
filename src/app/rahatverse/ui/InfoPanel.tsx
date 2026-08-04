"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-[#0f172a] border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-[#22d3ee] font-medium tracking-widest">DISTRICT</div>
            <h3 className="text-2xl font-semibold mt-1 text-white">{stop.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close district info panel"
            className="text-white/50 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-white/70 text-sm leading-relaxed mb-6">{stop.description}</p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/30 text-white hover:bg-white/10"
          >
            Continue Tour
          </Button>
          <Link href="/portfolio" className="flex-1">
            <Button className="w-full bg-[#22d3ee] text-black hover:bg-[#67e8f9]">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
