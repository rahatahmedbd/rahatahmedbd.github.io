"use client";

import React, { useEffect, useState } from "react";
import { useGameStore } from "./store";
import { Settings, Map as MapIcon, X, Building2 } from "lucide-react";
import { EcctrlJoystick } from "ecctrl";
import { AgencyHeadquarters } from "../verse/agency-headquarters";

export function GameUI() {
  const {
    interactionText,
    showSettings,
    setShowSettings,
    showHqModal,
    setShowHqModal,
    playerPosition,
    settings,
    updateSettings,
  } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      {/* Top Bar: Minimap, Agency HQ & Settings Toggle */}
      <div className="flex justify-between items-start w-full">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl flex flex-col gap-2 pointer-events-auto shadow-xl">
          <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
            <MapIcon size={18} className="text-cyan-400" />
            <span>MINI MAP</span>
          </div>
          <div className="relative w-32 h-32 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            {/* Center dot (Player) */}
            <div
              className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            {/* Map elements based on player position */}
            <div
              className="absolute w-4 h-4 bg-rose-500 rounded-sm"
              style={{
                left: `${50 + (5 - playerPosition[0]) * 2}%`,
                top: `${50 + (5 - playerPosition[2]) * 2}%`,
              }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            X: {Math.round(playerPosition[0])} Z: {Math.round(playerPosition[2])}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowHqModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600/90 border border-rose-500/50 rounded-xl text-white font-bold hover:bg-rose-500 transition-all shadow-xl"
          >
            <Building2 size={18} />
            <span>Agency HQ</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-xl"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Center: Interaction Text */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        {interactionText && (
          <div className="bg-black/80 backdrop-blur-md border border-rose-500/50 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]">
            {interactionText}
          </div>
        )}
      </div>

      {/* Bottom: Mobile Joystick & Hint */}
      <div className="w-full flex justify-between items-end">
        {!isMobile ? (
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 pointer-events-auto text-sm text-slate-300 shadow-xl">
            <p className="font-bold text-white mb-2">CONTROLS</p>
            <ul className="space-y-1">
              <li>
                <kbd className="bg-slate-800 px-1 rounded text-cyan-400">W A S D</kbd> Move
              </li>
              <li>
                <kbd className="bg-slate-800 px-1 rounded text-cyan-400">Shift</kbd> Sprint
              </li>
              <li>
                <kbd className="bg-slate-800 px-1 rounded text-cyan-400">Space</kbd> Jump
              </li>
              <li>
                <kbd className="bg-slate-800 px-1 rounded text-cyan-400">Click</kbd> Interact
              </li>
            </ul>
          </div>
        ) : (
          <div className="pointer-events-auto">
            <EcctrlJoystick />
          </div>
        )}
      </div>

      {/* Agency Headquarters Modal Overlay */}
      {showHqModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-5xl">
            <AgencyHeadquarters onClose={() => setShowHqModal(false)} />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Player Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Camera Sensitivity</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={settings.sensitivity}
                  onChange={(e) => updateSettings({ sensitivity: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Master Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Graphics Quality</label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((q) => (
                    <button
                      key={q}
                      onClick={() => updateSettings({ graphics: q as any })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                        settings.graphics === q
                          ? "bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
