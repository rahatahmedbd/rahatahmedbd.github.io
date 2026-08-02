"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Gauge,
  Languages,
  Layers,
  Rocket,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { writeExperienceMode, type ExperienceMode } from "@/lib/experience/mode";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface EntryGateProps {
  /** Rendered open on first visit (decided on the server, so there is no flash). */
  defaultOpen?: boolean;
  /** `/enter` renders the gate as a standalone page — it cannot be dismissed away to nothing. */
  standalone?: boolean;
}

/**
 * The front door of RahatVerse V2.
 *
 * Nothing about the underlying product changes here — the visitor simply picks
 * *how* they want to receive exactly the same information:
 * a fast premium website, or a cinematic 3D city.
 */
export function EntryGate({ defaultOpen = true, standalone = false }: EntryGateProps) {
  const { t, lang, toggle } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [leaving, setLeaving] = useState<ExperienceMode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Lock scroll while the gate is on screen. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Ambient particle field — tiny, cancels itself, respects reduced motion. */
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dots: Array<{ x: number; y: number; z: number; s: number }> = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.min(120, Math.round((w * h) / 14000));
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.3 + Math.random() * 0.9,
        s: 0.4 + Math.random() * 1.6,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) {
          d.y -= d.z * 0.28;
          if (d.y < -4) {
            d.y = h + 4;
            d.x = Math.random() * w;
          }
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.z > 0.8 ? "244,63,94" : "125,211,252"},${0.16 + d.z * 0.22})`;
        ctx.fill();
      }
      raf = window.requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  const choose = useCallback(
    (mode: ExperienceMode) => {
      writeExperienceMode(mode);
      setLeaving(mode);
      window.setTimeout(() => {
        if (mode === "verse") {
          router.push("/rahatverse");
          return;
        }
        if (standalone) {
          router.push("/");
          return;
        }
        setOpen(false);
      }, 520);
    },
    [router, standalone]
  );

  /* Escape = "just show me the website". */
  useEffect(() => {
    if (!open || standalone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") choose("site");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, standalone, choose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t({ en: "Choose your experience", bn: "আপনার অভিজ্ঞতা বেছে নিন" })}
      className={cn(
        "fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-[#05060c] text-white transition-opacity duration-500",
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      {/* Ambience */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[160px]" />
        <div className="absolute -left-24 bottom-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute -right-24 bottom-[10%] h-[420px] w-[420px] rounded-full bg-indigo-500/15 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold shadow-[0_10px_30px_-10px_rgba(244,63,94,0.8)]">
            {site.initials}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">{t(site.name)}</span>
            <span className="text-[11px] text-white/50">RahatVerse V2</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <Languages className="h-3.5 w-3.5" />
            {lang === "bn" ? "English" : "বাংলা"}
          </button>
          {!standalone && (
            <button
              type="button"
              onClick={() => choose("site")}
              aria-label={t({ en: "Skip", bn: "এড়িয়ে যান" })}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-white/30 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-12 pt-4 sm:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            {t({ en: "One story · Two experiences", bn: "এক তথ্য · দুই অভিজ্ঞতা" })}
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t({
              en: "How would you like to explore?",
              bn: "আপনি কীভাবে ঘুরে দেখতে চান?",
            })}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
            {t({
              en: "Exactly the same information, portfolio, packages, ordering and contact — presented two different ways. Pick the one you enjoy; you can switch any time.",
              bn: "একই তথ্য, একই পোর্টফোলিও, একই প্যাকেজ, একই অর্ডার ও যোগাযোগ ব্যবস্থা — শুধু উপস্থাপনা আলাদা। যেকোনো একটি বেছে নিন, যখন খুশি বদলাতে পারবেন।",
            })}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-2">
          {/* RahatVerse */}
          <GateCard
            onClick={() => choose("verse")}
            active={leaving === "verse"}
            accent="verse"
            emoji="🚀"
            icon={<Rocket className="h-5 w-5" />}
            kicker={t({ en: "3D Cinematic City", bn: "থ্রিডি সিনেমাটিক শহর" })}
            title="RahatVerse"
            titleSub={t({ en: "Guided vehicle tour", bn: "স্বয়ংক্রিয় গাইডেড ট্যুর" })}
            description={t({
              en: "Enter through the futuristic gate, board the self-driving pod and glide through a living city. Every district is a section of this website — fully interactive, fully functional.",
              bn: "ফিউচারিস্টিক গেট দিয়ে ঢুকে স্বয়ংচালিত ভেহিকেলে বসুন। শহরের প্রতিটি ভবন এই ওয়েবসাইটেরই এক একটি সেকশন — সম্পূর্ণ ইন্টারেক্টিভ ও কার্যকর।",
            })}
            points={[
              t({ en: "Auto-driving guided tour — no controls to learn", bn: "নিজে চালাতে হবে না — গাড়ি নিজেই ঘুরিয়ে দেখাবে" }),
              t({ en: "Order a website from inside the Website Store", bn: "ওয়েবসাইট স্টোরে দাঁড়িয়েই অর্ডার করা যাবে" }),
              t({ en: "Best on desktop · works on mobile too", bn: "ডেস্কটপে সেরা · মোবাইলেও চলবে" }),
            ]}
            cta={t({ en: "Enter RahatVerse", bn: "রাহাতভার্সে প্রবেশ করুন" })}
          />

          {/* Website */}
          <GateCard
            onClick={() => choose("site")}
            active={leaving === "site"}
            accent="site"
            emoji="💼"
            icon={<Building2 className="h-5 w-5" />}
            kicker={t({ en: "Premium Classic Website", bn: "প্রিমিয়াম ক্লাসিক ওয়েবসাইট" })}
            title={t({ en: "Website Experience", bn: "ওয়েবসাইট এক্সপেরিয়েন্স" })}
            titleSub={t({ en: "Fast, minimal, straight to the point", bn: "দ্রুত, পরিচ্ছন্ন, সরাসরি কাজের" })}
            description={t({
              en: "A clean modern site with every section, every fact and the full order flow — reachable in seconds. Ideal if you came here to hire, compare packages or contact quickly.",
              bn: "পরিষ্কার আধুনিক ওয়েবসাইট — সব সেকশন, সব তথ্য ও সম্পূর্ণ অর্ডার সিস্টেম কয়েক সেকেন্ডেই। দ্রুত কাজ, প্যাকেজ দেখা বা যোগাযোগের জন্য আদর্শ।",
            })}
            points={[
              t({ en: "Website order button right on the homepage", bn: "হোমপেজেই বড় ওয়েবসাইট অর্ডার বাটন" }),
              t({ en: "Step-by-step ordering — only what is needed", bn: "ধাপে ধাপে অর্ডার — শুধু প্রয়োজনীয় তথ্য" }),
              t({ en: "Light on data · perfect on any phone", bn: "কম ডেটা · যেকোনো ফোনে দুর্দান্ত" }),
            ]}
            cta={t({ en: "Continue to Website", bn: "ওয়েবসাইটে যান" })}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[11px] text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            {t({ en: "Same data & backend", bn: "একই তথ্য ও ব্যাকএন্ড" })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            {t({ en: "Same ordering system", bn: "একই অর্ডার সিস্টেম" })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" />
            {t({ en: "Switch any time from the menu", bn: "মেনু থেকে যেকোনো সময় বদলান" })}
          </span>
        </div>
      </div>
    </div>
  );
}

function GateCard({
  onClick,
  active,
  accent,
  emoji,
  icon,
  kicker,
  title,
  titleSub,
  description,
  points,
  cta,
}: {
  onClick: () => void;
  active: boolean;
  accent: "verse" | "site";
  emoji: string;
  icon: React.ReactNode;
  kicker: string;
  title: string;
  titleSub: string;
  description: string;
  points: string[];
  cta: string;
}) {
  const isVerse = accent === "verse";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[28px] border p-6 text-left transition-all duration-500 ease-premium sm:p-8",
        "border-white/10 bg-white/[0.035] backdrop-blur-xl hover:-translate-y-1.5",
        isVerse
          ? "hover:border-brand-400/50 hover:shadow-[0_40px_80px_-40px_rgba(244,63,94,0.7)]"
          : "hover:border-cyan-300/40 hover:shadow-[0_40px_80px_-40px_rgba(56,189,248,0.55)]",
        active && "scale-[0.98] opacity-60"
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          isVerse
            ? "bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-[90px] transition-opacity duration-500 group-hover:opacity-100",
          isVerse ? "bg-brand-500/25 opacity-60" : "bg-cyan-400/20 opacity-50"
        )}
      />

      <div className="relative flex items-center gap-3">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl text-xl",
            isVerse
              ? "bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/30"
              : "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/25"
          )}
        >
          {emoji}
        </span>
        <span className="flex flex-col">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
              isVerse ? "text-brand-300" : "text-cyan-200"
            )}
          >
            {icon}
            {kicker}
          </span>
          <span className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</span>
        </span>
      </div>

      <p className="relative mt-1.5 text-sm font-medium text-white/70">{titleSub}</p>
      <p className="relative mt-4 text-sm leading-relaxed text-white/55">{description}</p>

      <ul className="relative mt-5 flex flex-col gap-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[13px] text-white/70">
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                isVerse ? "bg-brand-400" : "bg-cyan-300"
              )}
            />
            {p}
          </li>
        ))}
      </ul>

      <span
        className={cn(
          "relative mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all",
          isVerse
            ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_18px_40px_-18px_rgba(244,63,94,0.9)] group-hover:from-brand-500 group-hover:to-brand-400"
            : "bg-white text-slate-900 group-hover:bg-white/90"
        )}
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </button>
  );
}
