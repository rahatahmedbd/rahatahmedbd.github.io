"use client";

import { Pause, Play, RotateCcw, Compass, Car } from "lucide-react";
import type { TourMode } from "@/types/platform";

interface ControlsProps {
  isPlaying: boolean;
  onPauseResume: () => void;
  onRestart: () => void;
  onModeSwitch: (mode: TourMode) => void;
  currentMode: TourMode;
}

export function Controls({
  isPlaying,
  onPauseResume,
  onRestart,
  onModeSwitch,
  currentMode,
}: ControlsProps) {
  const isExplore = currentMode === "explore";

  return (
    <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-black/70 px-2 py-2 backdrop-blur-2xl shadow-2xl">
        
        {/* Play / Pause */}
        <button
          onClick={onPauseResume}
          className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 active:scale-95"
          aria-label={isPlaying ? "Pause tour" : "Resume tour"}
        >
          {isPlaying ? (
            <Pause className="h-4.5 w-4.5" />
          ) : (
            <Play className="h-4.5 w-4.5 ml-0.5" />
          )}
        </button>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 active:scale-95"
          aria-label="Restart tour"
        >
          <RotateCcw className="h-4.5 w-4.5" />
        </button>

        {/* Mode Switch — Premium segmented control */}
        <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => onModeSwitch("auto")}
            className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
              !isExplore 
                ? "bg-white text-[#0a0c12] shadow-sm" 
                : "text-white/70 hover:text-white"
            }`}
          >
            <Car className="h-4 w-4" />
            <span>Auto</span>
          </button>
          <button
            onClick={() => onModeSwitch("explore")}
            className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
              isExplore 
                ? "bg-white text-[#0a0c12] shadow-sm" 
                : "text-white/70 hover:text-white"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Explore</span>
          </button>
        </div>
      </div>
    </div>
  );
}
