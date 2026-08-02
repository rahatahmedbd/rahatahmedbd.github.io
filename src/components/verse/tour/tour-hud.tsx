"use client";

import { useState } from "react";
import {
  ChevronRight,
  Compass,
  Home,
  Info,
  Map as MapIcon,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { DISTRICTS, type DistrictId } from "./districts";
import type { TourPhase } from "./tour-engine";
import { writeExperienceMode } from "@/lib/experience/mode";
import { cn } from "@/lib/utils";

interface TourHudProps {
  index: number;
  phase: TourPhase;
  paused: boolean;
  muted: boolean;
  panelOpen: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onNext: () => void;
  onGoTo: (id: DistrictId) => void;
  onJumpTo: (id: DistrictId) => void;
  onOpenPanel: () => void;
}

export function TourHud({
  index,
  phase,
  paused,
  muted,
  panelOpen,
  onTogglePause,
  onToggleMute,
  onNext,
  onGoTo,
  onJumpTo,
  onOpenPanel,
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
            <span className="block max-w-[46vw] truncate text-sm font-bold text-white sm:max-w-none">
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
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-black/55 px-3.5 text-[11px] font-semibold text-white/70 backdrop-blur-xl transition hover:border-white/25 hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t({ en: "Website", bn: "ওয়েবসাইট" })}</span>
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

      {/* ── Bottom controls ─────────────────────────────────────────────── */}
      {!panelOpen && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2.5 p-4 pb-6">
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
              en: "The pod drives itself · drag to look around · scroll to zoom",
              bn: "ভেহিকেল নিজেই চলে · চারপাশ দেখতে ড্র্যাগ করুন · জুমে স্ক্রল",
            })}
          </p>
        </div>
      )}

      {/* ── City map ────────────────────────────────────────────────────── */}
      {mapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/12 bg-[#070d1c] p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <Compass className="h-5 w-5 text-brand-400" />
                  {t({ en: "RahatVerse city map", bn: "রাহাতভার্স শহরের ম্যাপ" })}
                </h3>
                <p className="mt-0.5 text-[11px] text-white/45">
                  {t({
                    en: "Every district is a section of the website.",
                    bn: "প্রতিটি এলাকা ওয়েবসাইটের এক একটি সেকশন।",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/60 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

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
                      onClick={() => {
                        onGoTo(d.id);
                        setMapOpen(false);
                      }}
                      className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold transition hover:bg-white/20"
                    >
                      {t({ en: "Drive", bn: "যান" })}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onJumpTo(d.id);
                        setMapOpen(false);
                      }}
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
      )}
    </>
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
