"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, MonitorSmartphone, PartyPopper, X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { VerseAudio } from "@/components/verse/engine/audio";
import { writeExperienceMode } from "@/lib/experience/mode";
import { cn } from "@/lib/utils";
import { DISTRICTS, type DistrictId } from "./districts";
import { DistrictContent } from "./district-content";
import { PanelShell } from "./panel-shell";
import { TourEngine, type TourPhase } from "./tour-engine";
import { TourHud } from "./tour-hud";
import { TourIntro } from "./tour-intro";
import type { VerseData } from "./types";

/**
 * RahatVerse V2 — the guided city tour.
 *
 * The visitor boards a self-driving pod at the gate; it carries them around
 * the ring road and parks at each district. Every district panel shows the
 * *same* content as the classic website and performs the *same* actions
 * (ordering, contacting, logging in) against the *same* backend.
 */
export function CityTour({ data }: { data: VerseData }) {
  const { t } = useLanguage();

  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TourEngine | null>(null);
  const audioRef = useRef<VerseAudio | null>(null);
  /** Guards the auto-open so re-renders don't reopen a panel the user closed. */
  const lastArrivalRef = useRef<string>("");
  /** Live refs mirroring state — the engine closure needs fresh values. */
  const indexRef = useRef(0);
  const phaseRef = useRef<TourPhase>("cruising");

  const [supported, setSupported] = useState(true);
  const [ready, setReady] = useState(false);
  const [boarded, setBoarded] = useState(false);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<TourPhase>("cruising");
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  /** Seconds until the pod drives itself to the next stop (null = idle). */
  const [autoCount, setAutoCount] = useState<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  const district = DISTRICTS[index] ?? DISTRICTS[0];

  /* ── boot the 3D city ───────────────────────────────────────────────── */

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Bail out gracefully when WebGL is unavailable (old phones, locked-down
    // browsers). The visitor is offered the classic website instead.
    try {
      const probe = document.createElement("canvas");
      const gl =
        probe.getContext("webgl2") ||
        probe.getContext("webgl") ||
        probe.getContext("experimental-webgl");
      if (!gl) {
        setSupported(false);
        return;
      }
    } catch {
      setSupported(false);
      return;
    }

    const lowPower =
      window.innerWidth < 820 ||
      (typeof navigator !== "undefined" &&
        typeof navigator.hardwareConcurrency === "number" &&
        navigator.hardwareConcurrency <= 4);

    let engine: TourEngine | null = null;
    try {
      engine = new TourEngine({
        container,
        lowPower,
        callbacks: {
          onReady: () => setReady(true),
          onState: (patch) => {
            if (patch.index !== undefined) {
              indexRef.current = patch.index;
              setIndex(patch.index);
            }
            if (patch.phase !== undefined) {
              phaseRef.current = patch.phase;
              setPhase(patch.phase);
            }
            if (patch.paused !== undefined) setPaused(patch.paused);
            if (patch.progress !== undefined) setProgress(patch.progress);
          },
          onArrive: (id, i) => {
            indexRef.current = i;
            phaseRef.current = "stopped";
            setIndex(i);
            setPhase("stopped");
            // Let the camera settle before the hologram opens.
            const key = `${id}:${Date.now()}`;
            lastArrivalRef.current = key;
            window.setTimeout(() => {
              if (lastArrivalRef.current === key) setPanelOpen(true);
            }, 900);
          },
          onDepart: () => {
            lastArrivalRef.current = "";
            setPanelOpen(false);
          },
          onSelect: (id) => {
            // Tapped a building: open its panel if we are parked there,
            // otherwise let the pod drive over.
            const parked = DISTRICTS[indexRef.current];
            if (id === parked.id && phaseRef.current === "stopped") {
              setPanelOpen(true);
            } else {
              engineRef.current?.goTo(id);
            }
          },
        },
      });
    } catch {
      setSupported(false);
      return;
    }

    engineRef.current = engine;
    // Hold the pod at the gate until the visitor boards.
    engine.setPaused(true);

    return () => {
      lastArrivalRef.current = "";
      engineRef.current = null;
      try {
        engine?.dispose();
      } catch {
        /* the renderer may already be gone */
      }
      audioRef.current?.dispose();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── controls ───────────────────────────────────────────────────────── */

  const board = useCallback(() => {
    setBoarded(true);
    engineRef.current?.setPaused(false);
    // Autoplay policies require a gesture — "Board the pod" is that gesture.
    try {
      const audio = new VerseAudio();
      audio.start();
      audio.setMuted(false);
      audioRef.current = audio;
    } catch {
      /* audio is a nicety, never a requirement */
    }
  }, []);

  /** Stop the auto-drive countdown (any interaction cancels it). */
  const stopAuto = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    setAutoCount(null);
  }, []);

  /** After the panel closes, drive on to the next stop automatically. */
  const startAuto = useCallback(() => {
    stopAuto();
    setAutoCount(12);
    let remaining = 12;
    autoTimerRef.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (autoTimerRef.current !== null) {
          window.clearInterval(autoTimerRef.current);
          autoTimerRef.current = null;
        }
        setAutoCount(null);
        setPanelOpen(false);
        lastArrivalRef.current = "";
        engineRef.current?.next();
        return;
      }
      setAutoCount(remaining);
    }, 1000);
  }, [stopAuto]);

  const togglePause = useCallback(() => {
    engineRef.current?.togglePaused();
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      audioRef.current?.setMuted(next);
      return next;
    });
  }, []);

  const next = useCallback(() => {
    stopAuto();
    setPanelOpen(false);
    lastArrivalRef.current = "";
    engineRef.current?.next();
  }, [stopAuto]);

  const goTo = useCallback(
    (id: DistrictId) => {
      stopAuto();
      setPanelOpen(false);
      lastArrivalRef.current = "";
      engineRef.current?.goTo(id);
    },
    [stopAuto]
  );

  const jumpTo = useCallback(
    (id: DistrictId) => {
      stopAuto();
      setPanelOpen(false);
      lastArrivalRef.current = "";
      engineRef.current?.jumpTo(id);
    },
    [stopAuto]
  );

  const openPanel = useCallback(() => {
    stopAuto();
    setPanelOpen(true);
  }, [stopAuto]);

  const closePanel = useCallback(() => {
    lastArrivalRef.current = "";
    setPanelOpen(false);
    // The tour continues automatically once the visitor is done reading.
    if (!paused && phase === "stopped") startAuto();
  }, [paused, phase, startAuto]);

  const zoomIn = useCallback(() => engineRef.current?.zoomBy(1.3), []);
  const zoomOut = useCallback(() => engineRef.current?.zoomBy(1 / 1.3), []);

  /* Pausing or resuming resets the auto-drive state. */
  useEffect(() => {
    if (paused) stopAuto();
    else if (phase === "stopped" && !panelOpen && boarded) startAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  /* Keyboard shortcuts once the tour is under way. */
  useEffect(() => {
    if (!boarded) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "n" || e.key === "N" || e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomOut();
      } else if ((e.key === "i" || e.key === "I") && !panelOpen) {
        e.preventDefault();
        openPanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [boarded, next, togglePause, toggleMute, openPanel, panelOpen, zoomIn, zoomOut]);

  /* Cleanup the auto timer on unmount. */
  useEffect(() => {
    return () => {
      if (autoTimerRef.current !== null) {
        window.clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, []);

  /* ── WebGL fallback ─────────────────────────────────────────────────── */

  if (!supported) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#04070f] px-6 text-center text-white">
        <MonitorSmartphone className="h-10 w-10 text-brand-400" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t({
              en: "This device can't render the city",
              bn: "এই ডিভাইসে শহরটি চালানো যাচ্ছে না",
            })}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
            {t({
              en: "RahatVerse needs WebGL. Nothing is lost — the website experience carries exactly the same information, packages and ordering system.",
              bn: "রাহাতভার্স চালাতে WebGL দরকার। কোনো তথ্য হারাচ্ছে না — ওয়েবসাইট এক্সপেরিয়েন্সে হুবহু একই তথ্য, প্যাকেজ ও অর্ডার সিস্টেম রয়েছে।",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            onClick={() => writeExperienceMode("site")}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 text-sm font-bold text-white"
          >
            {t({ en: "Open the website", bn: "ওয়েবসাইট খুলুন" })}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/order"
            className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white/75 transition hover:border-white/35 hover:text-white"
          >
            {t({ en: "Order a website", bn: "ওয়েবসাইট অর্ডার করুন" })}
          </a>
        </div>
      </div>
    );
  }

  /* ── the city ───────────────────────────────────────────────────────── */

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#04070f] text-white">
      {/* 3D canvas */}
      <div ref={mountRef} className="absolute inset-0" aria-hidden />

      {/* Cinematic letterbox + vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 [background:radial-gradient(120%_90%_at_50%_45%,transparent_50%,rgba(0,0,0,0.55)_100%)]" />

      {boarded && (
        <>
          <TourHud
            index={index}
            phase={phase}
            progress={progress}
            paused={paused}
            muted={muted}
            panelOpen={panelOpen}
            autoCount={autoCount}
            onTogglePause={togglePause}
            onToggleMute={toggleMute}
            onNext={next}
            onGoTo={goTo}
            onJumpTo={jumpTo}
            onOpenPanel={openPanel}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onCancelAuto={stopAuto}
          />

          <PanelShell
            district={district}
            open={panelOpen}
            onClose={closePanel}
            footer={
              <div className="flex items-center justify-between gap-3">
                <a
                  href={district.siteHref}
                  className="min-w-0 truncate text-[11px] text-white/45 transition hover:text-white/80"
                >
                  {t({
                    en: "Same section on the website",
                    bn: "ওয়েবসাইটে একই সেকশন",
                  })}
                </a>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-[12px] font-bold text-slate-950 transition hover:brightness-110"
                  style={{ backgroundColor: district.accentCss }}
                >
                  {t({ en: "Drive to next stop", bn: "পরবর্তী গন্তব্যে যান" })}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            }
          >
            <DistrictContent
              id={district.id}
              data={data}
              onOrdered={(ref) => setOrderRef(ref)}
            />
          </PanelShell>
        </>
      )}

      {/* Order confirmation flare — the city celebrates a real database row. */}
      {orderRef && (
        <div className="pointer-events-none fixed inset-x-0 top-24 z-[70] flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/12 px-4 py-3 backdrop-blur-xl">
            <PartyPopper className="h-5 w-5 shrink-0 text-emerald-300" />
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-emerald-200">
                {t({ en: "Order received", bn: "অর্ডার গৃহীত হয়েছে" })}
              </p>
              <p className="truncate text-[11px] text-white/55">
                {t({ en: "Reference", bn: "রেফারেন্স" })}: {orderRef}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOrderRef(null)}
              aria-label="Dismiss"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/50 transition hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Gate sequence */}
      {!boarded && <TourIntro ready={ready} onBoard={board} />}

      {/* Screen-reader / no-JS mirror: the city is never the only way in. */}
      <noscript>
        <div className={cn("absolute inset-0 z-[80] bg-[#04070f] p-8 text-white")}>
          <h1 className="text-xl font-bold">RahatVerse</h1>
          <p className="mt-2 text-sm text-white/60">
            The 3D city needs JavaScript. The full website — with the same
            information and the same ordering system — is at{" "}
            <a href="/" className="underline">
              the homepage
            </a>
            .
          </p>
        </div>
      </noscript>
    </div>
  );
}
