"use client";

import { Car, Compass, Map } from "lucide-react";

interface SmartGuideControlsProps {
  mode: "auto" | "explore" | "guide";
  onModeChange: (mode: "auto" | "explore" | "guide") => void;
}

export function SmartGuideControls({ mode, onModeChange }: SmartGuideControlsProps) {
  return (
    <div className="fixed bottom-[92px] left-1/2 z-[75] -translate-x-1/2 flex items-center gap-1 rounded-2xl border border-white/10 bg-black/70 px-1.5 py-1.5 backdrop-blur-2xl shadow-xl">
      {[
        { value: "auto" as const, label: "Auto", icon: Car },
        { value: "explore" as const, label: "Explore", icon: Compass },
        { value: "guide" as const, label: "Guide", icon: Map },
      ].map(({ value, label, icon: Icon }) => {
        const isActive = mode === value;
        return (
          <button
            key={value}
            onClick={() => onModeChange(value)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "bg-white text-[#0a0c12] shadow-sm"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
