"use client";
import { Starfield, NebulaGlow } from "./starfield";
import { HudBar } from "./hud-bar";
import { OrbitalNav } from "./orbital-nav";
import React from "react";

export function MissionShell({ 
  children, 
  unread = 0, 
  missionCount = 0,
}: { 
  children: React.ReactNode; 
  unread?: number; 
  missionCount?: number;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05070d] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <Starfield density={180} />
        <NebulaGlow />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(5,7,13,0.8)_90%)]" />
      </div>

      {/* Grid accent */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(90% 70% at 50% 0%, black, transparent 85%)"
      }} />

      <div className="relative z-10 flex min-h-screen flex-col">
        <HudBar missionCount={missionCount} />
        <div className="flex flex-1">
          <OrbitalNav unread={unread} missionCount={missionCount} />
          <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-7 pb-[92px] md:pb-6">
            <div className="mx-auto max-w-[1600px]">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Ambient scanning line */}
      <div className="pointer-events-none absolute inset-x-0 top-[52px] h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse" />
      <div className="pointer-events-none fixed inset-x-0 top-[52px] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[6px]" style={{ animation: "scan 8s linear infinite" }} />
      <style>{`
        @keyframes scan { 0% { transform: translateY(-50vh); opacity:0 } 10% { opacity:1 } 90% { opacity:1 } 100% { transform: translateY(100vh); opacity:0 } }
        @keyframes floatSlow { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes pulseGlow { 0%,100% { opacity:0.6; transform:scale(1) } 50% { opacity:1; transform:scale(1.08) } }
        @keyframes shimmerMove { 0% { transform: translateX(-100%) } 100% { transform: translateX(200%) } }
      `}</style>
    </div>
  );
}
