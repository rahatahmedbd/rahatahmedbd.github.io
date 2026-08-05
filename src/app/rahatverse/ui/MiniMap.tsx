"use client";

import React, { useEffect, useState } from "react";

import { rahatVerseTourStops, type RahatVerseStop } from "@/data/platform";

interface MiniMapProps {
  /** Live vehicle position, written by the 3D frame loop. */
  positionRef: React.RefObject<[number, number, number]>;
  currentDistrict: string;
  currentStopId: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onSelectStop?: (stop: RahatVerseStop) => void;
}

const WORLD_EXTENT = 260; // matches the road/grid extent (-130..130)

function toMapPercent(x: number, z: number): { x: number; y: number } {
  return {
    x: ((x + WORLD_EXTENT / 2) / WORLD_EXTENT) * 100,
    y: ((z + WORLD_EXTENT / 2) / WORLD_EXTENT) * 100,
  };
}

/**
 * Mini map — district dots are derived from the same tour-stop data as
 * the 3D city (so they always match building positions), the player dot
 * follows the vehicle in real time (ref polled at ~10Hz, decoupled from
 * the render loop), and tapping a dot flies the camera to that building
 * (reusing the phase-21 focus transition).
 */
export function MiniMap({
  positionRef,
  currentDistrict,
  currentStopId,
  isCollapsed = false,
  onToggle,
  onSelectStop,
}: MiniMapProps) {
  const [position, setPosition] = useState<[number, number, number]>([0, 3, 0]);

  useEffect(() => {
    if (isCollapsed) return;
    const id = window.setInterval(() => {
      const current = positionRef.current;
      if (current) setPosition([current[0], current[1], current[2]]);
    }, 100);
    return () => window.clearInterval(id);
  }, [isCollapsed, positionRef]);

  const dot = toMapPercent(position[0], position[2]);

  return (
    <div className="fixed right-2 top-[8.75rem] z-50 w-40 bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden md:right-6 md:top-24 md:w-48">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-sm">
        <div className="font-medium">Mini Map</div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Show mini map" : "Hide mini map"}
          className="text-white/60 hover:text-white text-xs"
        >
          {isCollapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 relative h-48 bg-[#0a0c12]">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
          </div>

          {/* Districts — derived from the real tour-stop positions */}
          {rahatVerseTourStops.map((stop) => {
            const coords = toMapPercent(stop.position[0], stop.position[2]);
            const isCurrent = stop.id === currentStopId;
            return (
              <button
                key={stop.id}
                type="button"
                aria-label={stop.name}
                title={stop.name}
                onClick={() => onSelectStop?.(stop)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-colors ${
                    isCurrent ? "bg-[#22d3ee] ring-2 ring-white/70" : "bg-white/60 hover:bg-white"
                  }`}
                />
              </button>
            );
          })}

          {/* Real-time vehicle position — left/top transitions smooth the
              10Hz position updates into a continuous glide */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-[left,top] duration-200 ease-linear"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          >
            <div className="relative h-3 w-3">
              <div className="absolute inset-0 animate-ping rounded-full bg-[#22d3ee]/50" />
              <div className="absolute inset-0 rounded-full border-2 border-white bg-[#22d3ee]" />
            </div>
          </div>

          <div className="absolute bottom-2 left-4 text-[10px] text-white/50">
            {currentDistrict}
          </div>
        </div>
      )}
    </div>
  );
}
