"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Volume2, VolumeX } from "lucide-react";

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
import { rahatVerseAudio } from "./audio/ambient-audio";
import { AutoTour } from "./vehicle/AutoTour";
import { InfoPanel } from "./ui/InfoPanel";
import { MiniMap } from "./ui/MiniMap";
import { Controls } from "./ui/Controls";
import { CameraController } from "./camera/CameraController";

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

  // Building interaction — hover/preview tooltip + click-to-focus.
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipStop, setTooltipStop] = useState<RahatVerseStop | null>(null);
  const [tooltipPreviewing, setTooltipPreviewing] = useState(false);
  const [focusStop, setFocusStop] = useState<RahatVerseStop | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<RahatVerseDistrict | null>(null);

  // Live vehicle position, written by AutoTour and read by the mini-map.
  const vehiclePositionRef = useRef<[number, number, number]>([0, 3, 0]);

  // Ambient audio: follows the settings toggle (muted by default) and the
  // lighting theme. The AudioContext is only created/resumed inside a user
  // gesture (toggle click), so nothing ever autoplays.
  const soundOn = settings.sound;
  useEffect(() => {
    rahatVerseAudio.setEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    rahatVerseAudio.setTheme(settings.timeOfDay);
  }, [settings.timeOfDay]);

  useEffect(() => () => rahatVerseAudio.dispose(), []);

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
  // the camera to the building. `soundKind` distinguishes the interaction
  // source so the click feedback matches (building tap vs mini-map tap).
  const handleBuildingSelect = (
    stop: RahatVerseStop,
    soundKind: "building" | "minimap" = "building",
  ) => {
    rahatVerseAudio.playSfx(soundKind);
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
      {/* Top Navigation — mode status + sound toggle live here */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="text-2xl">🏙️</div>
            <div className="min-w-0">
              <div className="truncate font-semibold tracking-tight">RahatVerse</div>
              <div className="-mt-0.5 truncate text-[10px] text-white/50">
                {tourProgress.mode === "auto"
                  ? tourProgress.isPlaying
                    ? "🚗 Auto Tour Active"
                    : "⏸️ Tour Paused"
                  : tourProgress.mode === "guide"
                    ? "🧭 Guided Tour"
                    : "🕹️ Explore Freely"}
              </div>
            </div>
          </div>

          <div className="flex flex-none items-center gap-2">
            <button
              type="button"
              onClick={() => updateSettings({ sound: !settings.sound })}
              aria-pressed={settings.sound}
              aria-label={settings.sound ? "Mute ambient sound" : "Unmute ambient sound"}
              title={settings.sound ? "Mute sound" : "Unmute sound"}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                settings.sound
                  ? "border-[#22d3ee]/60 bg-[#22d3ee]/20 text-[#22d3ee] hover:bg-[#22d3ee]/30"
                  : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {settings.sound ? (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <Link href="/portfolio" aria-label="Open Website Experience">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                <span className="hidden sm:inline">← Website Experience</span>
                <span className="sm:hidden" aria-hidden="true">
                  ←
                </span>
              </Button>
            </Link>
          </div>
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
              const canvas = gl.domElement;
              const handleContextLost = (event: Event) => {
                // Prevent the browser's default "restart GPU" dialog —
                // we show a branded recovery overlay instead.
                event.preventDefault();
                setWebglLost(true);
              };
              const handleContextRestored = () => {
                // R3F resumes rendering automatically on restore; the
                // recovery overlay dismisses itself.
                setWebglLost(false);
              };
              canvas.addEventListener("webglcontextlost", handleContextLost);
              canvas.addEventListener("webglcontextrestored", handleContextRestored);
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
              onTooltipChange={setTooltipStop}
              onPreviewChange={setTooltipPreviewing}
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

      {/* Building tooltip — positioned by Buildings each frame, floats
          gently, never blocks input, clamped to the viewport. */}
      <div
        ref={tooltipRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 opacity-0 transition-opacity duration-150 will-change-transform"
      >
        {tooltipStop ? (
          <div className="relative">
            <div className="rahatverse-tooltip-float flex items-center gap-2 whitespace-nowrap rounded-2xl border border-white/15 bg-black/85 px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[#22d3ee]/20 text-base">
                {tooltipDistrict?.icon ?? "🏙️"}
              </span>
              <span className="max-w-[220px] truncate">{tooltipStop.name}</span>
              {tooltipPreviewing ? (
                <span className="flex-none rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#67e8f9]">
                  Tap to visit
                </span>
              ) : null}
            </div>
            {/* Pointer arrow */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/15 bg-black/85"
            />
          </div>
        ) : null}
      </div>

      {/* Bottom controls are hidden while the district info panel is open
          so nothing overlaps the panel on small screens. */}
      {!isInfoOpen ? (
        <>
          <Controls
            isPlaying={tourProgress.isPlaying}
            onPauseResume={handlePauseResume}
            onRestart={handleRestart}
            onModeSwitch={handleModeSwitch}
            currentMode={tourProgress.mode}
          />

          <SmartGuideControls mode={tourProgress.mode} onModeChange={handleModeSwitch} />
        </>
      ) : null}

      <InfoPanel stop={isInfoOpen ? currentStop : null} onClose={() => setIsInfoOpen(false)} />

      <MiniMap
        positionRef={vehiclePositionRef}
        currentDistrict={currentStop.name}
        currentStopId={tourProgress.currentStopId}
        isCollapsed={miniMapCollapsed}
        onToggle={() => setMiniMapCollapsed((collapsed) => !collapsed)}
        onSelectStop={(stop) => handleBuildingSelect(stop, "minimap")}
      />

      {/* Camera-focus indicator — visible while the camera flies to a
          building; disappears when the district panel opens. */}
      {focusStop ? (
        <div className="pointer-events-none fixed bottom-44 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs text-white/85 shadow-[var(--shadow-lg)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22d3ee] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22d3ee]" />
            </span>
            Focusing on {focusStop.name}…
          </div>
        </div>
      ) : null}

      <AIAssistant />

      <DayNightToggle
        timeOfDay={settings.timeOfDay}
        onChange={(timeOfDay) => updateSettings({ timeOfDay })}
      />

      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="fixed left-2 top-[8.75rem] z-50 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs hover:bg-white/10 md:left-6 md:top-24"
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

      {/* Runtime context-loss overlay — branded and auto-recovering.
          Only shown while the GPU context is actually lost; it dismisses
          itself on webglcontextrestored (R3F resumes the scene). */}
      {webglLost ? (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-[#0a0c12]/95 px-6 text-center text-white backdrop-blur-sm">
          <div className="text-5xl" aria-hidden="true">
            🏙️
          </div>
          <p className="text-lg font-semibold tracking-tight">
            Reconnecting to your graphics processor…
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            The city will reappear in a moment. If it doesn&apos;t, try again below.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Try Again
          </button>
        </div>
      ) : null}
    </div>
  );
}
