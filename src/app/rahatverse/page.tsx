"use client";

import { useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import { rahatVerseTourStops } from "@/data/platform";
import { usePlatform } from "@/state/platform-context";
import type { RahatVerseStop } from "@/data/platform";
import type { TourMode } from "@/types/platform";
import { AutoTour } from "./vehicle/AutoTour";
import { InfoPanel } from "./ui/InfoPanel";
import { MiniMap } from "./ui/MiniMap";
import { Controls } from "./ui/Controls";
import { CameraController } from "./camera/CameraController";
import { SmartDistricts } from "./districts/SmartDistricts";
import { AIAssistant } from "./ai/AIAssistant";
import { SmartGuideControls } from "./ui/SmartGuideControls";
import { DayNightToggle } from "./ui/DayNightToggle";
import { LivingWorld } from "./world/LivingWorld";
import { SettingsPanel } from "./settings/SettingsPanel";

// RahatVerse - Core platform integration

export default function RahatVerseExperience() {
  const { tourProgress, settings, updateSettings, updateTourProgress } = usePlatform();
  const [miniMapCollapsed, setMiniMapCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [restartToken, setRestartToken] = useState(0);

  const currentStop =
    rahatVerseTourStops.find((stop) => stop.id === tourProgress.currentStopId) ??
    rahatVerseTourStops[0];
  const currentPosition: [number, number, number] = [
    currentStop.position[0],
    3,
    currentStop.position[2],
  ];

  const handleStopChange = (stop: RahatVerseStop) => {
    const stopIndex = rahatVerseTourStops.findIndex((tourStop) => tourStop.id === stop.id);
    updateTourProgress({
      currentStopId: stop.id,
      currentStopIndex: stopIndex >= 0 ? stopIndex : 0,
      completed: false,
    });
    setIsInfoOpen(true);
  };

  const handleTourProgress = ({ stopId, stopIndex }: { stopId: string; stopIndex: number }) => {
    updateTourProgress({ currentStopId: stopId, currentStopIndex: stopIndex });
  };

  const handleTourComplete = () => {
    updateTourProgress({ isPlaying: false, completed: true });
  };

  const handlePauseResume = () => {
    updateTourProgress({ isPlaying: !tourProgress.isPlaying });
  };

  const handleRestart = () => {
    setRestartToken((token) => token + 1);
    setIsInfoOpen(false);
    updateTourProgress({
      currentStopId: "website-store",
      currentStopIndex: 0,
      mode: "auto",
      isPlaying: true,
      completed: false,
    });
  };

  const handleModeSwitch = (mode: TourMode) => {
    updateTourProgress({
      mode,
      isPlaying: mode !== "explore",
      completed: false,
    });
  };

  const handleSettingsChange = (nextSettings: {
    graphics: "low" | "medium" | "high";
    sound: boolean;
    music: boolean;
    motion: boolean;
  }) => {
    updateSettings(nextSettings);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0c12] text-white">
      {/* Top Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏙️</div>
            <div>
              <div className="font-semibold tracking-tight">RahatVerse</div>
              <div className="-mt-0.5 text-[10px] text-white/50">Interactive Experience</div>
            </div>
          </div>

          <Link href="/portfolio">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              ← Website Experience
            </Button>
          </Link>
        </div>
      </nav>

      {/* 3D Scene */}
      <div className="fixed inset-0 pt-16">
        <Canvas
          camera={{ position: [0, 65, 95], fov: 42 }}
          style={{ background: "#0a0c12" }}
          fallback={
            <div className="flex h-full items-center justify-center bg-[#0a0c12] p-8 text-center text-white/70">
              3D rendering is unavailable in this browser. Use the Website Experience above to
              continue exploring.
            </div>
          }
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[90, 140, 70]} intensity={1.6} castShadow />

          {/* Ground */}
          <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
            <planeGeometry args={[320, 320]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>

          {/* Roads */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[260, 0.4, 6]} />
            <meshLambertMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[260, 0.4, 6]} />
            <meshLambertMaterial color="#475569" />
          </mesh>

          {/* Central Website Store landmark */}
          <mesh position={[0, 16, 0]} castShadow>
            <boxGeometry args={[24, 32, 24]} />
            <meshLambertMaterial color="#1e40af" />
          </mesh>

          <AutoTour
            isPlaying={tourProgress.isPlaying}
            initialStopIndex={tourProgress.currentStopIndex}
            resetToken={restartToken}
            onStopChange={handleStopChange}
            onProgressChange={handleTourProgress}
            onTourComplete={handleTourComplete}
          />

          <CameraController
            mode={tourProgress.mode === "explore" ? "free" : "follow"}
            targetPosition={currentPosition}
            enabled={tourProgress.mode !== "explore"}
          />

          <LivingWorld timeOfDay={settings.timeOfDay} weather={settings.weather} />

          <Stars radius={450} depth={90} count={1500} factor={3.5} fade speed={0.25} />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={25}
            maxDistance={220}
            enabled={tourProgress.mode === "explore"}
          />
        </Canvas>
      </div>

      <Controls
        isPlaying={tourProgress.isPlaying}
        onPauseResume={handlePauseResume}
        onRestart={handleRestart}
        onModeSwitch={handleModeSwitch}
        currentMode={tourProgress.mode}
      />

      <SmartGuideControls mode={tourProgress.mode} onModeChange={handleModeSwitch} />

      <InfoPanel stop={isInfoOpen ? currentStop : null} onClose={() => setIsInfoOpen(false)} />

      <MiniMap
        currentPosition={currentPosition}
        currentDistrict={currentStop.name}
        isCollapsed={miniMapCollapsed}
        onToggle={() => setMiniMapCollapsed((collapsed) => !collapsed)}
      />

      <SmartDistricts />

      <div className="fixed right-6 top-24 z-50 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs">
        {tourProgress.mode === "auto"
          ? tourProgress.isPlaying
            ? "🚗 Auto Tour Active"
            : "⏸️ Tour Paused"
          : tourProgress.mode === "guide"
            ? "🧭 Guided Tour"
            : "🕹️ Explore Mode"}
      </div>

      <AIAssistant />

      <DayNightToggle
        timeOfDay={settings.timeOfDay}
        onChange={(timeOfDay) => updateSettings({ timeOfDay })}
      />

      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="fixed left-6 top-24 z-50 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs hover:bg-white/10"
      >
        ⚙️ Settings
      </button>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={{
          graphics: settings.graphics,
          sound: settings.sound,
          music: settings.music,
          motion: settings.motion,
        }}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}
