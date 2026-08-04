'use client';

import React from 'react';

interface HotspotProps {
  position: [number, number, number];
  label: string;
  onClick: () => void;
}

export function Hotspot({ label, onClick }: HotspotProps) {
  return (
    <button
      onClick={onClick}
      className="fixed z-40 px-4 py-1.5 text-xs font-medium bg-black/70 border border-white/30 rounded-full hover:bg-[#22d3ee] hover:text-black hover:border-[#22d3ee] transition-all active:scale-95"
    >
      {label}
    </button>
  );
}
