"use client";

import { Button } from "@/components/ui/button";
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
  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-wrap justify-center gap-3">
      <Button
        onClick={onPauseResume}
        variant="outline"
        className="border-white/30 px-6 text-white hover:bg-white/10"
      >
        {isPlaying ? "Pause Tour" : "Resume Tour"}
      </Button>

      <Button
        onClick={onRestart}
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10"
      >
        Restart Tour
      </Button>

      <Button
        onClick={() => onModeSwitch(currentMode === "explore" ? "auto" : "explore")}
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10"
      >
        {currentMode === "explore" ? "Auto Tour" : "Explore Mode"}
      </Button>
    </div>
  );
}
