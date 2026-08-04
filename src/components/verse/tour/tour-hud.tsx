"use client";

import { useState } from "react";
import {
  ChevronRight,
  Compass,
  Home,
  Info,
  Map as MapIcon,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { DISTRICTS, type DistrictId } from "./districts";
import type { TourPhase } from "./tour-engine";
import { writeExperienceMode } from "@/lib/experience/mode";
import { cn } from "@/lib/utils";

interface TourHudProps {
  index: number;
  phase: TourPhase;
  progress: number;
  paused: boolean;
  muted: boolean;
  panelOpen: boolean;
  /** Seconds until the pod auto-drives on (null = no countdown). */
  autoCount: number | null;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onNext: () => void;
  onGoTo: (id: DistrictId) => void;
  onJumpTo: (id: DistrictId) => void;
  onOpenPanel: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCancelAuto: () => void;
}

export function TourHud({
  index,
  phase,
  progress,
  paused,
  muted,
  panelOpen,
  autoCount,
  onTogglePause,
  onToggleMute,
  onNext,
  onGoTo,
  onJumpTo,
  onOpenPanel,
  onZoomIn,
  onZoomOut,
  onCancelAuto,
}: TourHudProps) {
  const { t } = useLanguage();
  const [mapOpen, setMapOpen] = useState(false);
  const current = DISTRICTS[index];
  const nextDistrict = DISTRICTS[(index + 1) % DISTRICTS.length];

  const statusLabel =
    phase === "stopped"
      ? t({ en: "Arrived", bn: "পৌঁছে গেছি" })
      : phase === "arriving"
      ? t({ en: "Slowing down…", bn: "ধীরে হচ্ছে…" })
      : paused
      ? t({ en: "Paused", bn: "থেমে আছে" })
      : t({ en: "Cruising", bn: "চলছে" });

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
        {/* Destination readout */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-black/55 px-3.5 py-2.5 backdrop-blur-xl">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg"
            style={{ backgroundColor: `${current.accentCss}22` }}
          >
            {current.emoji}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  phase === "stopped" ? "bg-emerald-400" : "animate-pulse bg-amber-400"
                )}
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                {statusLabel} · {current.stop}/{DISTRICTS.length}
              </span>
            </span>
            <span className="block max-w-[42vw] truncate text-sm font-bold text-white sm:max-w-none">
              {t(current.name)}
            </span>
          </span>
        </div>

        {/* Utilities */}
        <div className="pointer-events-auto flex items-center gap-2">
          <HudButton onClick={() => setMapOpen(true)} label={t({ en: "City map", bn: "শহরের ম্যাপ" })}>
            <MapIcon className="h-4 w-4" />
          </HudButton>
          <HudButton onClick={onToggleMute} label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </HudButton>
          <a
            href="/"
            onClick={() => writeExperienceMode("site")}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-black/55 px-3 text-[11px] font-semibold text-white/75 backdrop-blur-xl transition hover:border-white/25 hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {t({ en: "Website", bn: "ওয়েবসাইট" })}
            </span>
          </a>
        </div>
      </div>

      {/* ── Progress rail ───────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-x-0 top-[68px] z-30 flex justify-center px-3 sm:top-[76px]">
        <div className="pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-black/45 px-2 py-1.5 backdrop-blur-xl no-scrollbar">
          {DISTRICTS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onGoTo(d.id)}
              title={d.name.en}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all",
                i === index ? "text-slate-950" : "text-white/45 hover:text-white/80"
              )}
              style={i === index ? { backgroundColor: d.accentCss } : undefined}
            >
              <span className="text-xs leading-none">{d.emoji}</span>
              <span className={cn(i === index ? "inline" : "hidden lg:inline")}>{d.stop}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Zoom controls (map-mode style, always available) ─────────────── */}
      <div
        className={cn(
          "pointer-events-none fixed bottom-44 right-3 z-30 flex flex-col gap-1.5 sm:bottom-6 sm:right-4",
          panelOpen && "hidden sm:flex"
        )}
      >
        <HudButton onClick={onZoomIn} label={t({ en: "Zoom in", bn: "জুম ইন" })}>
          <Plus className="h-4 w-4" />
        </HudButton>
        <HudButton onClick={onZoomOut} label={t({ en: "Zoom out", bn: "জুম আউট" })}>
          <Minus className="h-4 w-4" />
        </HudButton>
      </div>

      {/* ── Auto-drive countdown chip ────────────────────────────────────── */}
      {autoCount !== null && !panelOpen && (
        <div className="pointer-events-none fixed inset-x-0 top-[120px] z-30 flex justify-center px-4 sm:top-[128px]">
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/12 bg-black/60 py-2 pl-4 pr-2 backdrop-blur-xl">
            <Zap className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <p className="text-[11px] font-semibold text-white/80">
              {t({
                en: `Next stop in ${autoCount}s`,
                bn: `${autoCount} সেকেন্ডে পরবর্তী গন্তব্য`,
              })}
            </p>
            <button
              type="button"
              onClick={onCancelAuto}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-white/10 px-3 text-[10px] font-bold text-white/80 transition hover:bg-white/20"
            >
              <RotateCcw className="h-3 w-3" />
              {t({ en: "Stay", bn: "থাকুন" })}
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom controls ─────────────────────────────────────────────── */}
      {!panelOpen && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2.5 p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {phase === "stopped" && (
            <button
              type="button"
              onClick={onOpenPanel}
              className="pointer-events-auto group inline-flex h-12 animate-fade-up items-center gap-2 rounded-full px-6 text-sm font-bold text-slate-950 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)] transition hover:scale-[1.03]"
              style={{ backgroundColor: current.accentCss }}
            >
              <Info className="h-4 w-4" />
              {t({ en: `Explore ${current.name.en}`, bn: `${current.name.bn} দেখুন` })}
            </button>
          )}

          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-black/55 p-1.5 backdrop-blur-xl">
            <HudButton onClick={onTogglePause} label={paused ? "Resume" : "Pause"}>
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </HudButton>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white/10 px-4 text-[11px] font-bold text-white transition hover:bg-white/20"
            >
              {t({ en: "Next stop", bn: "পরবর্তী গন্তব্য" })}
              <span className="hidden text-white/50 sm:inline">
                {nextDistrict.emoji} {t(nextDistrict.name)}
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="pointer-events-none text-center text-[10px] text-white/35">
            {t({
              en: "The pod drives itself · tap a building · drag to look · pinch or scroll to zoom",
              bn: "ভেহিকেল নিজেই চলে · ভবনে ট্যাপ করুন · ড্র্যাগে চারপাশ · পিঞ্চ/স্ক্রলে জুম",
            })}
          </p>
        </div>
      )}

      {/* ── City map ────────────────────────────────────────────────────── */}
      {mapOpen && (
        <CityMap
          index={index}
          progress={progress}
          onClose={() => setMapOpen(false)}
          onGoTo={(id) => {
            onGoTo(id);
            setMapOpen(false);
          }}
          onJumpTo={(id) => {
            onJumpTo(id);
            setMapOpen(false);
          }}
        />
      )}
    </>
  );
}

/* ── City map — radial navigation inspired by street maps ──────────────── */

function CityMap({
  index,
  progress,
  onClose,
  onGoTo,
  onJumpTo,
}: {
  index: number;
  progress: number;
  onClose: () => void;
  onGoTo: (id: DistrictId) => void;
  onJumpTo: (id: DistrictId) => void;
}) {
  const { t } = useLanguage();
  const current = DISTRICTS[index];

  // World angle → screen position on the ring (SVG y is flipped).
  const worldAngle = progress * Math.PI * 2;
  const podX = 200 + Math.cos(worldAngle) * 128;
  const podY = 200 - Math.sin(worldAngle) * 128;

  const roadR = 128;
  const markerR = 148;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/12 bg-[#070d1c] p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Compass className="h-5 w-5 text-brand-400" />
              {t({ en: "RahatVerse city map", bn: "রাহাতভার্স শহরের ম্যাপ" })}
            </h3>
            <p className="mt-0.5 text-[11px] text-white/45">
              {t({
                en: "Tap a district to drive there · every district is a section of the website.",
                bn: "যেকোনো এলাকায় ট্যাপ করে যান · প্রতিটি এলাকা ওয়েবসাইটের এক একটি সেকশন।",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/60 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Radial map */}
        <div className="relative mx-auto mt-4 w-full max-w-[360px]">
          <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label="City map">
            <defs>
              <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.14" />
                <stop offset="60%" stopColor="#0b1430" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#050a18" stopOpacity="0.9" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="188" fill="url(#map-glow)" />
            {/* Ring road */}
            <circle
              cx="200"
              cy="200"
              r={roadR}
              fill="none"
              stroke="#33456e"
              strokeWidth="7"
              strokeDasharray="2 6"
              strokeLinecap="round"
            />
            {/* District spokes */}
            {DISTRICTS.map((d) => {
              const a = Math.atan2(d.z, d.x);
              return (
                <line
                  key={`spoke-${d.id}`}
                  x1="200"
                  y1="200"
                  x2={200 + Math.cos(a) * markerR}
                  y2={200 - Math.sin(a) * markerR}
                  stroke="#223352"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                  opacity="0.7"
                />
              );
            })}
            {/* District markers */}
            {DISTRICTS.map((d, i) => {
              const a = Math.atan2(d.z, d.x);
              const mx = 200 + Math.cos(a) * markerR;
              const my = 200 - Math.sin(a) * markerR;
              const active = i === index;
              return (
                <g
                  key={d.id}
                  className="cursor-pointer"
                  onClick={() => onGoTo(d.id)}
                  role="button"
                  aria-label={d.name.en}
                >
                  <circle
                    cx={mx}
                    cy={my}
                    r={active ? 17 : 13}
                    fill={active ? d.accentCss : "#101b36"}
                    stroke={d.accentCss}
                    strokeWidth={active ? 2.5 : 1.5}
                    opacity={active ? 1 : 0.85}
                  />
                  <text
                    x={mx}
                    y={my + 5}
                    textAnchor="middle"
                    fontSize="13"
                  >
                    {d.emoji}
                  </text>
                </g>
              );
            })}
            {/* Pod position */}
            <circle cx={podX} cy={podY} r="7" fill="#ffffff" stroke="#f43f5e" strokeWidth="2.5" />
            <circle cx={podX} cy={podY} r="13" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Center monument */}
            <circle cx="200" cy="200" r="10" fill="#f43f5e" opacity="0.7" />
            <circle cx="200" cy="200" r="3" fill="#ffffff" />
          </svg>

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] text-white/60 backdrop-blur">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white ring-1 ring-brand-500" />
              {t({ en: "You", bn: "আপনি" })}
            </span>
            <span className="text-white/25">·</span>
            <span>
              {t({ en: "RahatVerse ring road", bn: "রাহাতভার্স রিং রোড" })}
            </span>
          </div>
        </div>

        {/* District list */}
        <div className="mt-4 space-y-2">
          {DISTRICTS.map((d, i) => (
            <div
              key={d.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3 transition",
                i === index ? "border-white/25 bg-white/[0.07]" : "border-white/8 bg-white/[0.03]"
              )}
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg"
                style={{ backgroundColor: `${d.accentCss}22` }}
              >
                {d.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{t(d.name)}</span>
                <span className="block truncate text-[10px] text-white/40">{t(d.mirrors)}</span>
              </span>
              <span className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => onGoTo(d.id)}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold transition hover:bg-white/20"
                >
                  {t({ en: "Drive", bn: "যান" })}
                </button>
                <button
                  type="button"
                  onClick={() => onJumpTo(d.id)}
                  className="rounded-full px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:text-white"
                  style={{ backgroundColor: `${d.accentCss}22` }}
                >
                  {t({ en: "Jump", bn: "সরাসরি" })}
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HudButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/55 text-white/70 backdrop-blur-xl transition hover:border-white/25 hover:text-white"
    >
      {children}
    </button>
  );
}
