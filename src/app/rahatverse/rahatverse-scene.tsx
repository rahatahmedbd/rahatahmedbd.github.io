"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import { PlatformErrorBoundary } from "@/components/platform/platform-error-boundary";
import { detectWebGLSupport } from "@/lib/webgl";
import {
  rahatVerseDistricts,
  rahatVerseTourStops,
  type RahatVerseDistrict,
  type RahatVerseStop,
} from "@/data/platform";
import { usePlatform } from "@/state/platform-context";
import type { TourMode } from "@/types/platform";
import { AutoTour } from "./vehicle/AutoTour";
import { InfoPanel } from "./ui/InfoPanel";
import { MiniMap } from "./ui/MiniMap";
import { Controls } from "./ui/Controls";
import { CameraController } from "./camera/CameraController";
import { SmartDistricts } from "./districts/SmartDistricts";
import { DistrictPanel } from "./districts/DistrictPanel";
import { AIAssistant } from "./ai/AIAssistant";
import { SmartGuideControls } from "./ui/SmartGuideControls";
import { DayNightToggle } from "./ui/DayNightToggle";
import { LivingWorld } from "./world/LivingWorld";
import { Buildings } from "./world/Buildings";
import { SettingsPanel } from "./settings/SettingsPanel";
import { RahatVerseFallback } from "./rahatverse-fallback";

// RahatVerse - Core platform integration

/** Builds a district panel payload for stops that have no dedicated district. */
function synthesizedDistrict(stop: RahatVerseStop): RahatVerseDistrict {
  const exploreRoute =
    stop.id === "website-store"
      ? "/order"
      : stop.id === "ai"
        ? "/portfolio"
        : `/portfolio#${stop.id}`;
  return {
    id: stop.id,
    title: stop.name,
    icon: stop.id === "ai" ? "🤖" : "🏙️",
    description: stop.description,
    stats: [],
    exploreRoute,
  };
}

export default function RahatVerseExperience() {
  const router = useRouter();
  const { tourProgress, settings, updateSettings, updateTourProgress, setExperience } =
    usePlatform();
  const [miniMapCollapsed, setMiniMapCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [restartToken, setRestartToken] = useState(0);

  // Rendering health — pre-flight WebGL check + runtime context-loss.
  const [webglSupported] = useState<boolean>(detectWebGLSupport);
  const [webglLost, setWebglLost] = useState(false);

  // Building interaction — hover tooltip + click-to-focus.
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipStop, setTooltipStop] = useState<RahatVerseStop | null>(null);
  const [focusStop, setFocusStop] = useState<RahatVerseStop | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<RahatVerseDistrict | null>(null);

  // Live vehicle position, written by AutoTour and read by the mini-map.
  const vehiclePositionRef = useRef<[number, number, number]>([0, 3, 0]);

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

  // Building clicked/tapped: pause the tour, switch to explore, and fly
  // the camera to the building.
  const handleBuildingSelect = (stop: RahatVerseStop) => {
    const stopIndex = rahatVerseTourStops.findIndex((tourStop) => tourStop.id === stop.id);
    updateTourProgress({
      currentStopId: stop.id,
      currentStopIndex: stopIndex >= 0 ? stopIndex : 0,
      mode: "explore",
      isPlaying: false,
      completed: false,
    });
    setIsInfoOpen(false);
    setActiveDistrict(null);
    setFocusStop(stop);
  };

  // Camera flight finished — reveal the building's section content.
  const handleFocusComplete = () => {
    const stop = focusStop;
    setFocusStop(null);
    if (!stop) return;
    const district =
      rahatVerseDistricts.find((item) => item.id === stop.id) ?? synthesizedDistrict(stop);
    setActiveDistrict(district);
  };

  const handleDistrictExplore = () => {
    if (!activeDistrict) return;
    setExperience("website");
    router.push(activeDistrict.exploreRoute);
    setActiveDistrict(null);
  };

  const tooltipDistrict = tooltipStop
    ? rahatVerseDistricts.find((item) => item.id === tooltipStop.id)
    : null;

  if (!webglSupported) {
    return (
      <div className="min-h-screen bg-[#0a0c12]">
        <RahatVerseFallback className="min-h-screen" onRetry={() => window.location.reload()} />
      </div>
    );
  }

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
      <PlatformErrorBoundary>
        <div className="fixed inset-0 pt-16">
          <Canvas
            camera={{ position: [0, 65, 95], fov: 42 }}
            style={{ background: "#0a0c12" }}
            dpr={[1, 1.75]}
            gl={{
              antialias: true,
              powerPreference: "default",
              failIfMajorPerformanceCaveat: false,
            }}
            fallback={<RahatVerseFallback onRetry={() => window.location.reload()} />}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (event) => {
                event.preventDefault();
                setWebglLost(true);
              });
            }}
          >
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

            {/* Buildings for every tour stop (incl. the central store) */}
            <Buildings
              tooltipRef={tooltipRef}
              onHoverChange={setTooltipStop}
              onSelect={handleBuildingSelect}
            />

            <AutoTour
              isPlaying={tourProgress.isPlaying}
              initialStopIndex={tourProgress.currentStopIndex}
              resetToken={restartToken}
              onStopChange={handleStopChange}
              onProgressChange={handleTourProgress}
              onTourComplete={handleTourComplete}
              positionRef={vehiclePositionRef}
            />

            <CameraController
              mode={tourProgress.mode === "explore" ? "free" : "follow"}
              targetPosition={currentPosition}
              enabled={tourProgress.mode !== "explore"}
              focusPosition={focusStop ? focusStop.position : null}
              onFocusComplete={handleFocusComplete}
            />

            <LivingWorld timeOfDay={settings.timeOfDay} weather={settings.weather} />

            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minDistance={25}
              maxDistance={220}
              enabled={tourProgress.mode === "explore" && focusStop === null}
            />
          </Canvas>
        </div>
      </PlatformErrorBoundary>

      {/* Building tooltip (moved by Buildings each frame; never blocks input) */}
      <div
        ref={tooltipRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 opacity-0 transition-opacity duration-150 will-change-transform"
      >
        {tooltipStop ? (
          <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-black/85 px-3 py-1.5 text-xs font-medium text-white shadow-[var(--shadow-lg)] backdrop-blur-md">
            <span aria-hidden="true">{tooltipDistrict?.icon ?? "🏙️"}</span>
            {tooltipStop.name}
          </div>
        ) : null}
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
        positionRef={vehiclePositionRef}
        currentDistrict={currentStop.name}
        currentStopId={tourProgress.currentStopId}
        isCollapsed={miniMapCollapsed}
        onToggle={() => setMiniMapCollapsed((collapsed) => !collapsed)}
        onSelectStop={handleBuildingSelect}
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

      {/* District content revealed after the camera flight lands */}
      {activeDistrict ? (
        <DistrictPanel
          title={activeDistrict.title}
          icon={activeDistrict.icon}
          description={activeDistrict.description}
          stats={activeDistrict.stats}
          onContinue={() => setActiveDistrict(null)}
          onExplore={handleDistrictExplore}
          onClose={() => setActiveDistrict(null)}
        />
      ) : null}

      {/* Runtime context-loss fallback */}
      {webglLost ? (
        <div className="fixed inset-0 z-[80]">
          <RahatVerseFallback onRetry={() => window.location.reload()} />
        </div>
      ) : null}
    </div>
  );
}
