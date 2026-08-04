"use client";

import React from "react";

interface DayNightToggleProps {
  timeOfDay: "morning" | "day" | "evening" | "night";
  onChange: (time: "morning" | "day" | "evening" | "night") => void;
}

export function DayNightToggle({ timeOfDay, onChange }: DayNightToggleProps) {
  const times = ["morning", "day", "evening", "night"] as const;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-1">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => onChange(time)}
          className={`px-4 py-1.5 text-xs rounded-xl capitalize transition-all ${
            timeOfDay === time
              ? "bg-[#22d3ee] text-black font-medium"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
