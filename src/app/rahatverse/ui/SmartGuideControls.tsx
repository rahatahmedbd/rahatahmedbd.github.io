"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface SmartGuideControlsProps {
  mode: "auto" | "explore" | "guide";
  onModeChange: (mode: "auto" | "explore" | "guide") => void;
}

export function SmartGuideControls({ mode, onModeChange }: SmartGuideControlsProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
      <Button
        variant={mode === "auto" ? "primary" : "outline"}
        size="sm"
        onClick={() => onModeChange("auto")}
      >
        Auto Tour
      </Button>
      <Button
        variant={mode === "explore" ? "primary" : "outline"}
        size="sm"
        onClick={() => onModeChange("explore")}
      >
        Explore Freely
      </Button>
      <Button
        variant={mode === "guide" ? "primary" : "outline"}
        size="sm"
        onClick={() => onModeChange("guide")}
      >
        Guided Tour
      </Button>
    </div>
  );
}
