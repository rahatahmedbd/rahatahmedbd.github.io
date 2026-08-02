"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Home, Volume2, VolumeX, X, Map as MapIcon, Sparkles, Building2 } from "lucide-react";
import type { HudState, TimePhase } from "./engine/world-config";
import { AgencyHeadquarters } from "./agency-headquarters";

interface HudProps {
  state: HudState;
  minimapRef: React.RefObject<HTMLCanvasElement>;
  onSetPhase: (p: TimePhase) => void;
  onToggleMute: () => void;
  onDismissWelcome: () => void;
  onCloseInfo: () => void;
  onCloseMap: () => void;
  onCloseHq?: () => void;
  onOpenHq?: () => void;
  onJoystick: (x: number, y: number) => void;
}

const PHASES: Array<{ id: TimePhase; label: string }> = [
  { id: "morning", label: "Morning" },
  { id: "day", label: "Day" },
  { id: "sunset", label: "Sunset" },
  { id: "night", label: "Night" },
];

function Joystick({ onJoystick }: { onJoystick: HudProps["onJoystick"] }) {
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [vec, setVec] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);
  const R = 44;

  const update = (clientX: number, clientY: number) => {
    if (!origin || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    setVec({ x: dx, y: dy });
    onJoystick(dx / R, -dy / R);
  };

  return (
    <div
      ref={baseRef}
      className="pointer-events-auto relative h-28 w-28 touch-none select-none"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setOrigin({ x: e.clientX, y: e.clientY });
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (origin) update(e.clientX, e.clientY);
      }}
      onPointerUp={() => {
        setOrigin(null);
        setVec({ x: 0, y: 0 });
        onJoystick(0, 0);
      }}
      onPointerCancel={() => {
        setOrigin(null);
        setVec({ x: 0, y: 0 });
        onJoystick(0, 0);
      }}
    >
      <div className="absolute inset-0 rounded-full border border-white/25 bg-black/25 backdrop-blur-sm" />
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/50 bg-cyan-400/30 shadow-glow"
        style={{
          transform: `translate(calc(-50% + ${vec.x}px), calc(-50% + ${vec.y}px))`,
        }}
      />
    </div>
  );
}

export function VerseHud({
  state,
  minimapRef,
  onSetPhase,
  onToggleMute,
  onDismissWelcome,
  onCloseInfo,
  onCloseMap,
  onCloseHq,
  onOpenHq,
  onJoystick,
}: HudProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 font-sans text-white">
      {/* ---------- Top bar ---------- */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex flex-col gap-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-semibold backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/50"
          >
            <Home className="h-4 w-4" />
            Exit RahatVerse
          </Link>
          <span className="px-2 text-[11px] font-medium tracking-widest text-cyan-200/80">
            RAHATVERSE · CH.4 AGENCY HEADQUARTERS
          </span>
        </div>

        {/* district chip */}
        <div className="rounded-2xl border border-white/15 bg-black/30 px-4 py-1.5 text-center backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-widest text-white/50">District</div>
          <div className="text-sm font-bold sm:text-base">{state.district}</div>
          <div className="text-[11px] text-white/60">{state.districtBn}</div>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          {onOpenHq && (
            <button
              onClick={onOpenHq}
              className="flex items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-500/20 px-3.5 py-1.5 text-xs font-bold text-brand-200 backdrop-blur-md transition-all hover:bg-brand-500/40 hover:scale-105 shadow-glow"
            >
              <Building2 className="h-4 w-4" />
              <span>Agency HQ</span>
            </button>
          )}

          {/* time phases */}
          <div className="hidden items-center gap-0.5 rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur-md sm:flex">
            {PHASES.map((p) => (
              <button
                key={p.id}
                onClick={() => onSetPhase(p.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  state.timePhase === p.id
                    ? "bg-cyan-400/30 text-cyan-100"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={onToggleMute}
            aria-label={state.muted ? "Unmute" : "Mute"}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-md transition-colors hover:bg-black/50"
          >
            {state.muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-black/30 px-3 py-2 text-sm font-bold text-amber-200 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-300" />
            {state.collectibles.found}/{state.collectibles.total}
          </div>
        </div>
      </div>

      {/* ---------- Interaction hint ---------- */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 sm:bottom-6">
        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition-all duration-300 ${
            state.hint
              ? "border-cyan-300/40 bg-cyan-500/20 text-cyan-50 opacity-100"
              : "border-white/10 bg-black/20 text-white/40 opacity-60"
          }`}
        >
          <MapIcon className="h-4 w-4" />
          {state.hint ?? "Drag to look · Click ground to move · Click Agency HQ to enter"}
        </div>
      </div>

      {/* ---------- Bottom-left: joystick + hints ---------- */}
      <div className="absolute bottom-4 left-4 flex items-end gap-3">
        <Joystick onJoystick={onJoystick} />
        <div className="hidden flex-col gap-1 text-[11px] leading-tight text-white/50 md:flex">
          <span>WASD / Arrows — move</span>
          <span>Drag — rotate view</span>
          <span>Scroll — zoom</span>
          <span>Click Agency HQ — enter rooms</span>
        </div>
      </div>

      {/* ---------- Bottom-right: minimap ---------- */}
      <div className="absolute bottom-4 right-4">
        <canvas ref={minimapRef} width={180} height={180} className="h-40 w-40 sm:h-44 sm:w-44" />
      </div>

      {/* ---------- Toast ---------- */}
      {state.toast && (
        <div className="absolute left-1/2 top-24 -translate-x-1/2 animate-pulse rounded-2xl border border-amber-300/40 bg-black/60 px-5 py-3 text-center shadow-lift backdrop-blur-md">
          <div className="text-sm font-bold text-amber-200">{state.toast.title}</div>
          {state.toast.sub && <div className="text-xs text-white/70">{state.toast.sub}</div>}
        </div>
      )}

      {/* ---------- Welcome overlay ---------- */}
      {state.welcomeShown && (
        <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-b from-black/70 via-black/50 to-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-black/50 p-6 text-center shadow-lift backdrop-blur-xl sm:p-8">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-brand-300/40 bg-brand-500/15 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-200">
              RAHATVERSE · CHAPTER 4
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Agency Headquarters
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Welcome to the city's command post — Agency Headquarters. Explore 10 interactive
              rooms, experience Rahat's digital avatar, test live tech stations, and discover
              who Rahat is and how he builds world-class web applications.
            </p>
            <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-2 text-left text-xs text-white/70">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">🏢 Tallest Glass Tower</div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">🤖 AI Avatar Guide</div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">⚡ Interactive Skills Lab</div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">🔮 10 Interactive Rooms</div>
            </div>
            <button
              onClick={onDismissWelcome}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-pink-500 px-8 font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              Enter RahatVerse
            </button>
          </div>
        </div>
      )}

      {/* ---------- Agency Headquarters Modal ---------- */}
      {state.hqModalOpen && (
        <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-2 sm:p-6 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl">
            <AgencyHeadquarters onClose={onCloseHq} />
          </div>
        </div>
      )}

      {/* ---------- Info panel ---------- */}
      {state.infoPanel && (
        <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0b1526]/95 p-6 shadow-lift">
            <button
              onClick={onCloseInfo}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              className="mb-3 h-1.5 w-12 rounded-full"
              style={{ background: "#" + state.infoPanel.accent.toString(16).padStart(6, "0") }}
            />
            <h2 className="text-xl font-extrabold">{state.infoPanel.title}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/75">
              {state.infoPanel.body}
            </p>
            {state.infoPanel.link && (
              <Link
                href={state.infoPanel.link}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-white text-black py-3 font-semibold transition hover:scale-[1.02]"
              >
                Enter {state.infoPanel.title}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ---------- Map panel ---------- */}
      {state.mapOpen && (
        <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0b1526]/95 p-6 shadow-lift">
            <button
              onClick={onCloseMap}
              aria-label="Close map"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-extrabold">City Map</h2>
            <p className="mt-1 text-sm text-white/60">Districts & reserved locations of RahatVerse</p>
            <ul className="mt-4 grid max-h-[50vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {[
                { name: "Central Plaza", note: "The heart of the city" },
                { name: "Agency Headquarters", note: "Chapter 4 · OPEN NOW 🏢" },
                { name: "Portfolio Museum", note: "Chapter 5" },
                { name: "Website Factory", note: "Chapter 6" },
                { name: "AI Laboratory", note: "Chapter 7" },
                { name: "Service District", note: "Chapter 8" },
                { name: "Order Center", note: "Chapter 8" },
                { name: "Client Hub", note: "Chapter 8" },
                { name: "Innovation Tower", note: "Chapter 9" },
                { name: "Agency Headquarters", note: "Chapter 3" },
                { name: "Portfolio Museum", note: "Chapter 5 (Open)" },
                { name: "Website Factory", note: "Chapter 6" },
                { name: "AI Laboratory", note: "Chapter 7" },
                { name: "Service District", note: "Chapter 4" },
                { name: "Order Center", note: "Chapter 4" },
                { name: "Client Hub", note: "Chapter 4" },
                { name: "Innovation Tower", note: "Chapter 7" },
                { name: "Secret District", note: "??? — find it" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-xs text-brand-300 font-bold">{item.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
