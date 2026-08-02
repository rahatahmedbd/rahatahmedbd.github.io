"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FactoryEngine } from "./factory-engine";
import { FactoryHud } from "./factory-hud";
import { HudState, initialHudState, ZoneId } from "./factory-config";

export function FactoryScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FactoryEngine | null>(null);
  const [hud, setHud] = useState<HudState>(initialHudState);
  const [webglOk, setWebglOk] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [buildSelections, setBuildSelections] = useState<Record<string, number>>({
    business: 0,
    style: 1,
    features: 2,
    pages: 2,
    animations: 1,
    admin: 1,
    ai: 2,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    let webglSupported = true;
    try {
      const probe = document.createElement("canvas");
      webglSupported = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      webglSupported = false;
    }
    setWebglOk(webglSupported);
    if (!webglSupported) {
      setIsLoading(false);
      return;
    }

    let engine: FactoryEngine | null = null;
    try {
      engine = new FactoryEngine({
        container: containerRef.current,
        callbacks: {
          onHud: (patch) => setHud((prev) => ({ ...prev, ...patch })),
          onZoneEnter: (zone) => {
            setHud((prev) => ({ ...prev, currentZone: zone }));
          },
          onMachineActivate: (machineId) => {
            // trigger simulator or cost panel if relevant
            if (machineId === "deploy") {
              setShowSimulator(true);
            }
          },
          onBuildProgress: (progress) => {
            setHud((prev) => ({ ...prev, buildProgress: progress }));
          },
        },
      });
      engineRef.current = engine;
    } catch (err) {
      console.error("Website Factory failed to start", err);
      setWebglOk(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    // auto-start ambient on interaction
    const startAudio = () => {
      // audio could be added later
    };
    window.addEventListener("pointerdown", startAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startAudio);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const toggleSimulator = () => setShowSimulator(!showSimulator);
  const toggleCost = () => setShowCost(!showCost);

  const updateSelection = (key: string, idx: number) => {
    const newSel = { ...buildSelections, [key]: idx };
    setBuildSelections(newSel);
    
    // live update the 3D model
    engineRef.current?.updateBuildModel(newSel);
    
    // update cost estimate
    const cost = calculateCost(newSel);
    setHud((prev) => ({ ...prev, estimatedCost: cost }));
  };

  const calculateCost = (selections: Record<string, number>) => {
    let multiplier = 1;
    Object.keys(selections).forEach((k, i) => {
      multiplier += (selections[k] * 0.18);
    });
    return Math.round(2400 * multiplier);
  };

  const estimatedPrice = calculateCost(buildSelections);
  const estimatedDays = Math.round(14 + (Object.values(buildSelections).reduce((a, b) => a + b, 0) * 1.8));

  if (!webglOk) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0b1526] p-6">
        <div className="max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-white">
          <div className="text-5xl mb-4">🏭</div>
          <h1 className="text-3xl font-bold">Website Factory</h1>
          <p className="mt-4 text-white/70">WebGL is required for the full 3D experience.</p>
          <a href="/rahatverse" className="mt-8 inline-block px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors">
            ← Back to RahatVerse
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#05070f] overflow-hidden">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top HUD */}
      <FactoryHud 
        hud={hud} 
        onToggleSimulator={toggleSimulator} 
        onToggleCost={toggleCost}
        onExit={() => window.location.href = "/rahatverse"}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#05070f] flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-pulse">🏭</div>
            <div className="text-xl text-white/80 font-medium tracking-[3px]">INITIALIZING WEBSITE FACTORY</div>
            <div className="mt-2 text-sm text-white/50">Loading production zones...</div>
          </div>
        </div>
      )}

      {/* Interactive Build Simulator Panel */}
      {showSimulator && (
        <div className="absolute right-6 top-20 w-[380px] bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-40">
          <div className="px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg text-white">Interactive Build Simulator</div>
              <div className="text-xs text-white/50">Watch your website assemble in real-time</div>
            </div>
            <button onClick={toggleSimulator} className="text-white/60 hover:text-white">✕</button>
          </div>

          <div className="p-5 space-y-6 max-h-[460px] overflow-auto text-sm">
            {[
              { key: "business", label: "Business Type" },
              { key: "style", label: "Website Style" },
              { key: "features", label: "Features" },
              { key: "pages", label: "Pages" },
              { key: "animations", label: "Animations" },
              { key: "admin", label: "Admin Panel" },
              { key: "ai", label: "AI Features" },
            ].map(({ key, label }) => {
              const opt = {
                business: ["E-commerce", "SaaS", "Agency", "Portfolio", "Restaurant", "Startup"],
                style: ["Modern", "Minimal", "Bold", "Premium", "Playful", "Corporate"],
                features: ["5", "8", "12", "16", "22"],
                pages: ["4", "7", "10", "14", "20"],
                animations: ["Subtle", "Medium", "Rich", "Cinematic"],
                admin: ["Basic", "Advanced", "Enterprise"],
                ai: ["None", "Chatbot", "AI Assistant", "Full AI Suite"],
              }[key] || [];

              return (
                <div key={key}>
                  <div className="flex justify-between text-white/70 text-xs mb-1.5">
                    <div>{label}</div>
                    <div className="font-mono text-[10px] text-white/40">{opt[buildSelections[key]]}</div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {opt.map((o, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateSelection(key, idx)}
                        className={`px-3 py-1 text-xs rounded-full transition-all border ${
                          buildSelections[key] === idx
                            ? "bg-[#22d3ee] text-black border-[#22d3ee]"
                            : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-black/40 p-4 border-t border-white/10 flex gap-3">
            <button
              onClick={() => {
                engineRef.current?.triggerFullBuild(buildSelections);
                setShowSimulator(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#67e8f9] text-black font-semibold text-sm active:scale-[0.985]"
            >
              BUILD WEBSITE
            </button>
            <button onClick={() => setShowCost(true)} className="px-5 py-2.5 text-xs border border-white/30 hover:bg-white/5 rounded-xl">View Cost</button>
          </div>
        </div>
      )}

      {/* Live Cost Estimator */}
      {showCost && (
        <div className="absolute left-6 bottom-6 w-80 bg-[#0a0f1c] border border-white/10 rounded-2xl p-5 z-40 text-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-semibold text-xl tracking-tight">Live Cost Estimator</div>
              <div className="text-[10px] text-white/40">Instant quote based on your build</div>
            </div>
            <button onClick={() => setShowCost(false)} className="text-white/50 hover:text-white">✕</button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="text-white/60">Estimated Price</div>
              <div className="text-3xl font-semibold tabular-nums tracking-tighter text-[#22d3ee]">${estimatedPrice}</div>
            </div>
            <div className="flex justify-between text-xs">
              <div>Timeline</div>
              <div className="font-mono text-white/70">{estimatedDays} days</div>
            </div>
            <div className="flex justify-between text-xs">
              <div>Recommended Package</div>
              <div className="font-medium text-[#67e8f9]">Pro Builder</div>
            </div>
            <div className="pt-2 border-t border-white/10 text-[10px] text-white/40">
              Includes: AI-assisted development • 6 months support • Performance guarantee
            </div>
          </div>

          <button 
            onClick={() => { window.location.href = "/order"; }}
            className="mt-5 w-full py-3 text-sm rounded-2xl bg-white text-black font-semibold hover:bg-[#f1f5f9]"
          >
            START PROJECT →
          </button>
        </div>
      )}

      {/* Factory Statistics (bottom right) */}
      <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 text-xs z-30">
        <div className="flex gap-6 text-white/70">
          {[
            { label: "Projects", val: "1,248" },
            { label: "Lines", val: "18.5M" },
            { label: "AI Hours", val: "87k" },
            { label: "Perf", val: "98%" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-mono tabular-nums text-[#22d3ee] text-sm font-semibold">{s.val}</div>
              <div className="text-[9px] tracking-widest mt-px">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Guide hint */}
      <div className="absolute top-[140px] left-1/2 -translate-x-1/2 text-xs px-4 py-1 bg-white/5 rounded-full text-white/60 flex items-center gap-2 z-30 pointer-events-none">
        <div className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full animate-pulse" /> AI GUIDE ACTIVE — Follow the robot or explore freely
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-6 left-6 text-[10px] px-3 py-1.5 rounded-xl bg-black/60 text-white/50 border border-white/10 z-30 font-mono tracking-[1px] text-xs">
        WASD / ARROWS • MOUSE LOOK • E INTERACT • SPACE JUMP
      </div>
    </div>
  );
}
