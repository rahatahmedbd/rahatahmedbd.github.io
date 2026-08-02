"use client";

import { HudState } from "./factory-config";

interface FactoryHudProps {
  hud: HudState;
  onToggleSimulator: () => void;
  onToggleCost: () => void;
  onExit: () => void;
}

export function FactoryHud({ hud, onToggleSimulator, onToggleCost, onExit }: FactoryHudProps) {
  return (
    <>
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#67e8f9] flex items-center justify-center text-black font-bold text-xl">WF</div>
            <div>
              <div className="font-semibold text-xl tracking-[-0.5px] text-white">Website Factory</div>
              <div className="text-[10px] text-white/40 -mt-0.5">CHAPTER 6 • RAHATVERSE</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center gap-2 text-xs tracking-widest">
            <div className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full animate-pulse" /> LIVE PRODUCTION
          </div>

          <button
            onClick={onToggleSimulator}
            className="px-5 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/10 transition-all rounded-2xl flex items-center gap-2 font-medium"
          >
            <span>🛠️</span> BUILD SIMULATOR
          </button>

          <button
            onClick={onToggleCost}
            className="px-5 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/10 transition-all rounded-2xl flex items-center gap-2 font-medium"
          >
            💰 COST
          </button>

          <button
            onClick={onExit}
            className="px-6 py-2 text-sm hover:bg-white/10 rounded-2xl border border-white/10 transition-colors"
          >
            EXIT FACTORY →
          </button>
        </div>
      </div>

      {/* Current Zone HUD */}
      <div className="absolute top-20 left-6 z-40 px-5 py-2.5 rounded-2xl bg-black/70 backdrop-blur border border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-xs text-white/40 tracking-[1.5px]">CURRENT ZONE</div>
          <div className="font-semibold text-xl text-white tracking-tight">{hud.currentZone}</div>
        </div>
      </div>

      {/* AI Guide Status */}
      <div className="absolute top-20 right-6 z-40 px-4 py-2 rounded-2xl bg-[#0a0f1c] border border-[#22d3ee]/40 text-xs flex items-center gap-2">
        <div className="text-[#22d3ee]">🤖</div>
        <div>
          <div className="font-medium text-white/90">AI GUIDE — RAY</div>
          <div className="text-[10px] text-white/50">“Follow me or explore freely”</div>
        </div>
      </div>

      {/* Build Progress (if active) */}
      {hud.buildProgress > 0 && (
        <div className="absolute top-[92px] left-1/2 -translate-x-1/2 z-40 w-[280px]">
          <div className="bg-black/70 border border-white/10 px-5 py-3 rounded-2xl">
            <div className="flex justify-between text-xs mb-1.5">
              <div className="text-white/60">Website Assembly</div>
              <div className="font-mono text-[#22d3ee]">{Math.floor(hud.buildProgress)}%</div>
            </div>
            <div className="h-1 bg-white/10 rounded">
              <div 
                className="h-1 bg-gradient-to-r from-[#22d3ee] to-[#67e8f9] rounded transition-all" 
                style={{ width: `${hud.buildProgress}%` }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {hud.toast && (
        <div className="absolute top-[140px] left-1/2 -translate-x-1/2 z-50 px-8 py-3.5 rounded-3xl bg-[#0a0f1c] border border-white/20 shadow-xl text-center">
          <div className="font-semibold text-white tracking-tight">{hud.toast.title}</div>
          {hud.toast.sub && <div className="text-xs text-white/50 mt-0.5">{hud.toast.sub}</div>}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 px-6 py-5 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-3 text-sm pointer-events-auto">
        <button 
          onClick={onToggleSimulator}
          className="px-6 py-3 bg-[#22d3ee] hover:bg-[#67e8f9] active:bg-white transition-all text-black font-semibold rounded-2xl flex items-center gap-2 shadow-lg"
        >
          OPEN INTERACTIVE BUILD SIMULATOR
        </button>
        <button 
          onClick={onToggleCost}
          className="px-6 py-3 border border-white/30 hover:bg-white/5 text-white font-medium rounded-2xl"
        >
          VIEW LIVE COST
        </button>
      </div>

      {/* Mini Controls Legend */}
      <div className="absolute bottom-[72px] left-6 text-[10px] px-3 py-1 bg-black/40 rounded-xl text-white/40 border border-white/10 font-mono z-30">
        E = INTERACT • CLICK MACHINES • SCROLL ZOOM
      </div>
    </>
  );
}
