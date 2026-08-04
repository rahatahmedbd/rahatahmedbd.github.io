'use client';

import React from 'react';

interface MiniMapProps {
  currentPosition: [number, number, number];
  currentDistrict: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const districts = [
  { name: 'Website Store', x: 50, y: 50 },
  { name: 'About Me', x: 50, y: 25 },
  { name: 'Achievements', x: 75, y: 30 },
  { name: 'Portfolio', x: 80, y: 50 },
  { name: 'Blood Donation', x: 75, y: 75 },
  { name: 'Gallery', x: 50, y: 80 },
  { name: 'Education', x: 25, y: 75 },
  { name: 'Skills', x: 20, y: 50 },
  { name: 'Contact', x: 25, y: 25 },
];

export function MiniMap({ currentPosition, currentDistrict, isCollapsed = false, onToggle }: MiniMapProps) {
  const [x, , z] = currentPosition;
  const mapX = ((x + 130) / 260) * 100;
  const mapZ = ((z + 130) / 260) * 100;

  return (
    <div className="fixed top-24 right-6 z-50 bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden w-48">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-sm">
        <div className="font-medium">Mini Map</div>
        <button onClick={onToggle} className="text-white/60 hover:text-white text-xs">
          {isCollapsed ? 'Show' : 'Hide'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 relative h-48 bg-[#0a0c12]">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
          </div>

          {/* Districts */}
          {districts.map((district, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-white/60 rounded-full"
              style={{ left: `${district.x}%`, top: `${district.y}%`, transform: 'translate(-50%, -50%)' }}
            />
          ))}

          {/* Current Position */}
          <div
            className="absolute w-3 h-3 bg-[#22d3ee] rounded-full border-2 border-white z-10"
            style={{
              left: `${mapX}%`,
              top: `${mapZ}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />

          <div className="absolute bottom-2 left-4 text-[10px] text-white/50">
            {currentDistrict}
          </div>
        </div>
      )}
    </div>
  );
}
