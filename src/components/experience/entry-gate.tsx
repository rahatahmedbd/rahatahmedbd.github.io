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
  ShieldCheck,
  MousePointer2,
  MonitorSmartphone,
  PartyPopper,
  CheckCircle2,
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
 * The front door of RahatVerse V2 — Premium, cinematic, memorable.
 * The visitor picks *how* they want to receive exactly the same information:
 * a fast premium website, or a cinematic 3D city tour.
 */
export function EntryGate({ defaultOpen = true, standalone = false }: EntryGateProps) {
  const { t, lang, toggle } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [leaving, setLeaving] = useState<ExperienceMode | null>(null);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mount detection for SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Lock scroll while the gate is on screen. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Ambient particle field — premium, respects reduced motion. */
  useEffect(() => {
    if (!open || !mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dots: Array<{ x: number; y: number; z: number; s: number; hue: number }> = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.min(150, Math.round((w * h) / 12000));
    for (let i = 0; i < count; i++) {
      const isBrand = Math.random() > 0.6;
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.2 + Math.random() * 1.0,
        s: 0.3 + Math.random() * 2.0,
        hue: isBrand ? 340 : 190, // brand pink or cyan
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) {
          d.y -= d.z * 0.35;
          if (d.y < -6) {
            d.y = h + 6;
            d.x = Math.random() * w;
          }
        }
        const alpha = 0.12 + d.z * 0.25;
        const hue = d.hue;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.s * d.z, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 85%, 60%, ${alpha})`;
        ctx.fill();
        
        // Glow for closer particles
        if (d.z > 0.7) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.s * d.z * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 85%, 60%, ${alpha * 0.15})`;
          ctx.fill();
        }
      }
      raf = window.requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [open, mounted]);

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

  if (!open || !mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t({ en: "Choose your experience", bn: "আপনার অভিজ্ঞতা বেছে নিন" })}
      className={cn(
        "fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-[#04060b] text-white transition-opacity duration-500",
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      {/* Ambience Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      
      {/* Layered Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Main brand glow */}
        <div className="absolute left-1/2 top-[-15%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[180px]" />
        {/* Cyan accent */}
        <div className="absolute -left-32 bottom-[-15%] h-[500px] w-[500px] rounded-full bg-cyan-500/12 blur-[160px]" />
        {/* Indigo accent */}
        <div className="absolute -right-32 bottom-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[160px]" />
        {/* Center subtle glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-brand-500/8 blur-[200px]" />
        {/* Grid pattern with radial mask */}
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(80%_70%_at_50%_35%,black,transparent)]" />
        {/* Vignette */}
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className={cn(
            "grid h-11 w-11 place-items-center rounded-2xl text-sm font-bold",
            "bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700",
            "shadow-[0_12px_40px_-12px_rgba(244,63,94,0.8)]",
            "ring-1 ring-brand-400/30"
          )}>
            {site.initials}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">{t(site.name)}</span>
            <span className="text-[11px] text-white/50 font-medium">RahatVerse V2</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-all",
              "border-white/15 bg-white/5 text-white/80",
              "hover:border-white/30 hover:text-white hover:bg-white/10"
            )}
          >
            <Languages className="h-3.5 w-3.5" />
            {lang === "bn" ? "English" : "বাংলা"}
          </button>
          {!standalone && (
            <button
              type="button"
              onClick={() => choose("site")}
              aria-label={t({ en: "Skip", bn: "এড়িয়ে যান" })}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                "border-white/15 bg-white/5 text-white/70",
                "hover:border-white/30 hover:text-white hover:bg-white/10"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-16 pt-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="text-center">
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]",
            "border-white/15 bg-white/5 text-white/70 backdrop-blur-xl",
            "ring-1 ring-inset ring-white/10"
          )}>
            <Sparkles className="h-4 w-4 text-brand-400 animate-pulse" />
            {t({ en: "One story · Two experiences", bn: "এক তথ্য · দুই অভিজ্ঞতা" })}
          </span>

          <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl font-extrabold tracking-[-0.03em] leading-[1.05] sm:text-6xl lg:text-7xl">
            {t({
              en: "How would you like to explore?",
              bn: "আপনি কীভাবে ঘুরে দেখতে চান?",
            })}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-white/65 sm:text-base lg:text-lg">
            {t({
              en: "Exactly the same information, portfolio, packages, ordering and contact — presented two different ways. Pick the one you enjoy; you can switch any time.",
              bn: "একই তথ্য, একই পোর্টফোলিও, একই প্যাকেজ, একই অর্ডার ও যোগাযোগ ব্যবস্থা — শুধু উপস্থাপনা আলাদা। যেকোনো একটি বেছে নিন, যখন খুশি বদলাতে পারবেন।",
            })}
          </p>
        </div>

        {/* Experience Cards */}
        <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-2">
          {/* RahatVerse Card */}
          <GateCard
            onClick={() => choose("verse")}
            active={leaving === "verse"}
            variant="verse"
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
              { icon: MousePointer2, text: t({ en: "Auto-driving guided tour — no controls to learn", bn: "নিজে চালাতে হবে না — গাড়ি নিজেই ঘুরিয়ে দেখাবে" }) },
              { icon: PartyPopper, text: t({ en: "Order a website from inside the Website Store", bn: "ওয়েবসাইট স্টোরে দাঁড়িয়েই অর্ডার করা যাবে" }) },
              { icon: MonitorSmartphone, text: t({ en: "Best on desktop · works on mobile too", bn: "ডেস্কটপে সেরা · মোবাইলেও চলবে" }) },
            ]}
            cta={t({ en: "Enter RahatVerse", bn: "রাহাতভার্সে প্রবেশ করুন" })}
          />

          {/* Website Experience Card */}
          <GateCard
            onClick={() => choose("site")}
            active={leaving === "site"}
            variant="site"
            emoji="💼"
            icon={<Building2 className="h-5 w-5" />}
            kicker={t({ en: "Premium Modern Website", bn: "প্রিমিয়াম মডার্ন ওয়েবসাইট" })}
            title={t({ en: "Website Experience", bn: "ওয়েবসাইট এক্সপেরিয়েন্স" })}
            titleSub={t({ en: "Fast, minimal, straight to the point", bn: "দ্রুত, পরিচ্ছন্ন, সরাসরি কাজের" })}
            description={t({
              en: "A clean modern site with every section, every fact and the full order flow — reachable in seconds. Ideal if you came here to hire, compare packages or contact quickly.",
              bn: "পরিষ্কার আধুনিক ওয়েবসাইট — সব সেকশন, সব তথ্য ও সম্পূর্ণ অর্ডার সিস্টেম কয়েক সেকেন্ডেই। দ্রুত কাজ, প্যাকেজ দেখা বা যোগাযোগের জন্য আদর্শ।",
            })}
            points={[
              { icon: ShieldCheck, text: t({ en: "Website order button right on the homepage", bn: "হোমপেজেই বড় ওয়েবসাইট অর্ডার বাটন" }) },
              { icon: MousePointer2, text: t({ en: "Step-by-step ordering — only what is needed", bn: "ধাপে ধাপে অর্ডার — শুধু প্রয়োজনীয় তথ্য" }) },
              { icon: Zap, text: t({ en: "Light on data · perfect on any phone", bn: "কম ডেটা · যেকোনো ফোনে দুর্দান্ত" }) },
            ]}
            cta={t({ en: "Explore Website", bn: "ওয়েবসাইট ঘুরে দেখুন" })}
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-[11px] text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-white/40" />
            {t({ en: "Same data & backend", bn: "একই তথ্য ও ব্যাকএন্ড" })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-white/40" />
            {t({ en: "Same ordering system", bn: "একই অর্ডার সিস্টেম" })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-white/40" />
            {t({ en: "Switch any time from the menu", bn: "মেনু থেকে যেকোনো সময় বদলান" })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            {t({ en: "Draft syncs across both", bn: "ড্রাফট দুটো জায়গায় সিংক" })}
          </span>
        </div>

        {/* Keyboard hint */}
        {!standalone && (
          <p className="mt-8 text-center text-[11px] text-white/30 font-medium">
            {t({ en: "Press Escape for Website Experience", bn: "ওয়েবসাইট এক্সপেরিয়েন্সের জন্য Escape চাপুন" })}
          </p>
        )}
      </div>
    </div>
  );
}

interface GateCardProps {
  onClick: () => void;
  active: boolean;
  variant: "verse" | "site";
  emoji: string;
  icon: React.ReactNode;
  kicker: string;
  title: string;
  titleSub: string;
  description: string;
  points: Array<{ icon: React.ElementType; text: string }>;
  cta: string;
}

function GateCard({
  onClick,
  active,
  variant,
  emoji,
  icon,
  kicker,
  title,
  titleSub,
  description,
  points,
  cta,
}: GateCardProps) {
  const isVerse = variant === "verse";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[32px] border p-7 text-left transition-all duration-500 ease-premium sm:p-9",
        "border-white/10 bg-white/[0.03] backdrop-blur-2xl hover:-translate-y-2",
        isVerse
          ? "hover:border-brand-400/50 hover:shadow-[0_50px_100px_-40px_rgba(244,63,94,0.6)]"
          : "hover:border-cyan-300/40 hover:shadow-[0_50px_100px_-40px_rgba(6,182,212,0.5)]",
        active && "scale-[0.98] opacity-60"
      )}
    >
      {/* Top accent line */}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          isVerse
            ? "bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"
            : "bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
        )}
      />
      
      {/* Corner glow */}
      <span
        className={cn(
          "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px] transition-opacity duration-500 group-hover:opacity-100",
          isVerse ? "bg-brand-500/20 opacity-50" : "bg-cyan-400/15 opacity-40"
        )}
      />
      
      {/* Bottom glow */}
      <span
        className={cn(
          "pointer-events-none absolute -left-20 bottom-20 h-64 w-64 rounded-full blur-[100px] transition-opacity duration-500 group-hover:opacity-100",
          isVerse ? "bg-brand-500/10 opacity-40" : "bg-cyan-400/10 opacity-30"
        )}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3">
        <span
          className={cn(
            "grid h-14 w-14 place-items-center rounded-2xl text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
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
          <span className="mt-0.5 text-2xl font-extrabold tracking-tight sm:text-[30px]">{title}</span>
        </span>
      </div>

      <p className="relative mt-2 text-sm font-medium text-white/75">{titleSub}</p>
      <p className="relative mt-5 text-sm leading-relaxed text-white/55">{description}</p>

      {/* Feature Points */}
      <ul className="relative mt-6 flex flex-col gap-3">
        {points.map((p, i) => {
          const Icon = p.icon;
          return (
            <li key={i} className="flex items-start gap-3 text-[13px] text-white/75 group transition-colors duration-300">
              <span
                className={cn(
                  "mt-1 shrink-0 grid h-5 w-5 place-items-center rounded-lg transition-all duration-300",
                  isVerse
                    ? "bg-brand-500/15 text-brand-400 group:bg-brand-500 group:text-white"
                    : "bg-cyan-500/15 text-cyan-300 group:bg-cyan-500 group:text-white"
                )}
              >
                <Icon className="h-3 w-3" />
              </span>
              <span className="leading-relaxed group-hover:text-white transition-colors">{p.text}</span>
            </li>
          );
        })}
      </ul>

      {/* CTA Button */}
      <span
        className={cn(
          "relative mt-8 inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-7 text-sm font-bold transition-all duration-300",
          isVerse
            ? "bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] text-white shadow-[0_20px_50px_-20px_rgba(244,63,94,0.8)] group-hover:from-brand-500 group-hover:via-brand-400 group-hover:to-brand-500"
            : "bg-white text-slate-900 group-hover:bg-white/90 shadow-[0_20px_50px_-20px_rgba(255,255,255,0.3)]"
        )}
      >
        {cta}
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </button>
  );
}