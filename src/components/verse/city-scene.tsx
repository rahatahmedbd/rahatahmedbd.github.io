"use client";

import { useEffect, useRef, useState } from "react";
import { VerseEngine } from "./engine/engine";
import { VerseAudio } from "./engine/audio";
import { VerseHud } from "./hud";
import { HudState, initialHudState, TimePhase } from "./engine/world-config";

export function CityScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<VerseEngine | null>(null);
  const audioRef = useRef<VerseAudio | null>(null);
  const toastTimer = useRef<number | null>(null);

  const [hud, setHud] = useState<HudState>(initialHudState);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !minimapRef.current) return;
    let webglSupported = true;
    try {
      const probe = document.createElement("canvas");
      webglSupported = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      webglSupported = false;
    }
    setWebglOk(webglSupported);
    if (!webglSupported) return;

    const audio = new VerseAudio();
    audioRef.current = audio;
    let engine: VerseEngine | null = null;
    try {
      engine = new VerseEngine({
        container: containerRef.current,
        minimapCanvas: minimapRef.current,
        audio,
        callbacks: {
          onHud: (patch) => setHud((prev) => ({ ...prev, ...patch })),
          onCollect: (found, total, label) => {
            setHud((prev) => ({
              ...prev,
              toast: { id: Date.now(), title: "💎 Crystal found!", sub: `${label} · ${found}/${total}` },
            }));
            if (toastTimer.current) window.clearTimeout(toastTimer.current);
            toastTimer.current = window.setTimeout(() => {
              setHud((prev) => ({ ...prev, toast: null }));
            }, 2600);
          },
        },
      });
      engineRef.current = engine;
    } catch (err) {
      console.error("RahatVerse failed to start", err);
      setWebglOk(false);
      return;
    }

    // start ambient audio on first interaction (autoplay policy)
    const startAudio = () => audio.start();
    window.addEventListener("pointerdown", startAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startAudio);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      engineRef.current?.dispose();
      engineRef.current = null;
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  const setPhase = (p: TimePhase) => {
    engineRef.current?.setPhase(p);
    setHud((prev) => ({ ...prev, timePhase: p }));
  };
  const toggleMute = () => {
    const m = !hud.muted;
    audioRef.current?.setMuted(m);
    setHud((prev) => ({ ...prev, muted: m }));
  };

  if (!webglOk) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0b1526] p-6">
        <div className="max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-white">
          <div className="text-3xl">🏙️</div>
          <h1 className="mt-3 text-2xl font-extrabold">The Digital City</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            RahatVerse needs WebGL (3D graphics) to render. Your browser or
            device does not support it right now. Try the latest Chrome, Edge,
            Firefox or Safari — or enable hardware acceleration.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-6 font-semibold text-white"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0b1526]">
      <div ref={containerRef} className="absolute inset-0" />
      <VerseHud
        state={hud}
        minimapRef={minimapRef}
        onSetPhase={setPhase}
        onToggleMute={toggleMute}
        onDismissWelcome={() => setHud((p) => ({ ...p, welcomeShown: false }))}
        onCloseInfo={() => setHud((p) => ({ ...p, infoPanel: null }))}
        onCloseMap={() => setHud((p) => ({ ...p, mapOpen: false }))}
        onJoystick={(x, y) => engineRef.current?.setJoystick(x, y)}
      />
    </div>
  );
}
