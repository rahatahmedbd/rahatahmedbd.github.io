"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Gauge,
  Layers,
  LayoutDashboard,
  Loader2,
  MessageCircle,
  Receipt,
  Rocket,
  Sparkles,
  Tag,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { submitProjectOrderAction } from "@/app/actions/orders";
import {
  BUILDER_FEATURES,
  BUILDINGS_DATA,
  PORTAL_PACKAGES,
} from "@/components/service-district/data";
import { CategoryIcon } from "@/components/order/category-icon";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Confetti } from "@/components/ui/confetti";
import { useToast } from "@/components/ui/toast";
import { useCopy } from "@/hooks/use-copy";
import {
  EMAIL_RE,
  PAGE_TIERS,
  clearOrderDraft,
  emptyOrderDraft,
  estimateOrder,
  getCategory,
  getPackage,
  getPageTier,
  loadOrderDraft,
  saveOrderDraft,
  type OrderDraft,
  type PackageId,
} from "@/lib/order/pricing";
import { buildOrderSummary, whatsappOrderLink } from "@/lib/order/summary";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "site" | "verse";

interface OrderFlowProps {
  /** Visual skin only — the steps, data and submission are identical. */
  variant?: Variant;
  /** Pre-select a category (RahatVerse store shelves link straight into a step). */
  initialCategoryId?: string;
  /** Called after a successful submission (e.g. to celebrate inside the city). */
  onSubmitted?: (reference: string) => void;
  /** Render the fixed mobile summary/submit bar. Off inside RahatVerse
   *  panels, which already own the bottom of the screen. */
  stickyBar?: boolean;
  className?: string;
}

/** Three steps, down from four: scope decisions now live together. */
const STEPS = [
  { id: "category", en: "Website type", bn: "ওয়েবসাইটের ধরন" },
  { id: "scope", en: "Size & extras", bn: "সাইজ ও ফিচার" },
  { id: "contact", en: "Your details", bn: "আপনার তথ্য" },
] as const;

type FieldKey = "fullName" | "phone" | "email";

function validateField(key: FieldKey, value: string): "required" | "invalid" | null {
  const v = value.trim();
  if (!v) return "required";
  if (key === "fullName") return v.length >= 2 ? null : "invalid";
  if (key === "email") return EMAIL_RE.test(v) ? null : "invalid";
  if (key === "phone") return v.replace(/\D/g, "").length >= 6 ? null : "invalid";
  return null;
}

/**
 * The website ordering journey — staged so a visitor never meets a wall of
 * form fields, with live pricing, per-field inline validation, a sticky
 * mobile summary, and a WhatsApp hand-off that carries the whole order.
 *
 * Rendered identically inside the Website Experience and inside RahatVerse.
 */
export function OrderFlow({
  variant = "site",
  initialCategoryId,
  onSubmitted,
  stickyBar,
  className,
}: OrderFlowProps) {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const { copied, copy } = useCopy();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OrderDraft>(() => ({
    ...emptyOrderDraft,
    ...(initialCategoryId ? { categoryId: initialCategoryId } : {}),
  }));
  const [hydrated, setHydrated] = useState(false);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    fullName: false,
    phone: false,
    email: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [refCopied, setRefCopied] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [resumed, setResumed] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const dark = variant === "verse";
  const showStickyBar = stickyBar ?? variant === "site";

  /* Resume an unfinished draft — a journey started in the city can be
     finished on the website, and vice-versa. */
  useEffect(() => {
    const saved = loadOrderDraft();
    if (saved) {
      setDraft((d) => ({
        ...saved,
        categoryId: initialCategoryId || saved.categoryId || d.categoryId,
      }));
      if (saved.fullName || saved.email || saved.phone) setResumed(true);
    }
    setHydrated(true);
  }, [initialCategoryId]);

  useEffect(() => {
    if (hydrated) saveOrderDraft(draft);
  }, [draft, hydrated]);

  useEffect(() => {
    if (!resumed) return;
    toast({
      title: t({ en: "Draft restored", bn: "ড্রাফট ফিরিয়ে আনা হয়েছে" }),
      description: t({
        en: "We kept your earlier answers — change anything you like.",
        bn: "আপনার আগের উত্তরগুলো রাখা হয়েছে — যেকোনো কিছু বদলাতে পারেন।",
      }),
      tone: "info",
    });
    setResumed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumed]);

  const estimate = useMemo(() => estimateOrder(draft), [draft]);
  const category = getCategory(draft.categoryId);
  const pkg = getPackage(draft.packageId);
  const pageTier = getPageTier(draft.pages);

  const errors = useMemo(
    () => ({
      fullName: validateField("fullName", draft.fullName),
      phone: validateField("phone", draft.phone),
      email: validateField("email", draft.email),
    }),
    [draft.fullName, draft.phone, draft.email]
  );
  const contactValid = !errors.fullName && !errors.phone && !errors.email;

  const patch = useCallback(
    (next: Partial<OrderDraft>) => setDraft((d) => ({ ...d, ...next })),
    []
  );

  const scrollRail = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: "smooth" });
  };

  const goto = (next: number) => {
    setStep(next);
    setError(null);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const errorMessage = (key: FieldKey) => {
    const kind = errors[key];
    if (!kind) return null;
    if (key === "fullName")
      return t({ en: "Please enter your name (2+ characters).", bn: "আপনার নাম লিখুন (২+ অক্ষর)।" });
    if (key === "email")
      return t({ en: "Please enter a valid email address.", bn: "সঠিক ইমেইল ঠিকানা লিখুন।" });
    return t({ en: "Please enter a valid phone number.", bn: "সঠিক ফোন নম্বর লিখুন।" });
  };

  const submit = () => {
    setError(null);
    setTouched({ fullName: true, phone: true, email: true });

    if (!contactValid) {
      const msg = t({
        en: "Please fix the highlighted fields.",
        bn: "চিহ্নিত ঘরগুলো ঠিক করুন।",
      });
      setError(msg);
      toast({ title: msg, tone: "warning" });
      if (step !== STEPS.length - 1) goto(STEPS.length - 1);
      return;
    }

    startTransition(async () => {
      try {
        const res = await submitProjectOrderAction({
          fullName: draft.fullName,
          companyName: draft.companyName,
          email: draft.email,
          phone: draft.phone,
          country: draft.country,
          websiteType: category.title.en,
          requiredFeatures: draft.features,
          designPreference: ["Modern", "Premium", "Mobile-first"],
          budgetOption: estimate.priceRange,
          deadlineOption: estimate.timeline,
          projectDetails:
            draft.notes ||
            `${category.title.en} · ${pkg.title} · ${draft.pages}${
              draft.multilingual ? " · Bilingual" : ""
            } · Scope: ${estimate.scope}`,
          uploadedFiles: [],
          estimatedCost: estimate.total,
          estimatedDelivery: estimate.timeline,
        });

        if (res.success && res.reference) {
          setReference(res.reference);
          setSheetOpen(false);
          clearOrderDraft();
          onSubmitted?.(res.reference);
          toast({
            title: t({ en: "Request sent 🎉", bn: "অনুরোধ পাঠানো হয়েছে 🎉" }),
            description: `${t({ en: "Reference", bn: "রেফারেন্স" })}: ${res.reference}`,
            tone: "success",
            duration: 6000,
          });
          return;
        }
        const msg =
          res.error ||
          t({ en: "Could not submit. Please try again.", bn: "জমা দেওয়া যায়নি। আবার চেষ্টা করুন।" });
        setError(msg);
        toast({ title: msg, tone: "error" });
      } catch {
        const msg = t({
          en: "Network problem — your request was not sent. Please check your connection.",
          bn: "নেটওয়ার্ক সমস্যা — অনুরোধটি পাঠানো যায়নি। সংযোগ পরীক্ষা করুন।",
        });
        setError(msg);
        toast({ title: msg, tone: "error" });
      }
    });
  };

  const copySummary = async () => {
    const ok = await copy(buildOrderSummary(draft, lang));
    toast({
      title: ok
        ? t({ en: "Summary copied", bn: "সারসংক্ষেপ কপি হয়েছে" })
        : t({ en: "Could not copy", bn: "কপি করা যায়নি" }),
      tone: ok ? "success" : "error",
    });
  };

  /* ── Success ─────────────────────────────────────────────────────────── */
  if (reference) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border p-7 text-center sm:p-9",
          dark ? "border-white/10 bg-white/[0.04] text-white" : "border-border/10 bg-surface",
          className
        )}
      >
        <Confetti />
        <div className="mx-auto grid h-16 w-16 animate-[pop-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both] place-items-center rounded-3xl bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight">
          {t({ en: "Request received!", bn: "অনুরোধ পৌঁছে গেছে!" })}
        </h3>
        <p className={cn("mx-auto mt-2 max-w-md text-sm leading-relaxed", dark ? "text-white/60" : "text-fg-soft")}>
          {t({
            en: "Your project is saved and Rahat has been notified. You will hear back within 24 hours.",
            bn: "আপনার প্রজেক্ট সেভ হয়েছে এবং রাহাতের কাছে নোটিফিকেশন গেছে। ২৪ ঘণ্টার মধ্যে উত্তর পাবেন।",
          })}
        </p>

        <div
          className={cn(
            "mx-auto mt-6 flex w-fit max-w-full items-center gap-3 rounded-2xl border px-4 py-3 sm:px-5",
            dark ? "border-white/10 bg-black/30" : "border-border/10 bg-canvas-muted"
          )}
        >
          <span className="hidden text-xs font-semibold uppercase tracking-widest opacity-60 sm:inline">
            {t({ en: "Reference", bn: "রেফারেন্স" })}
          </span>
          <span className="font-mono text-base font-bold text-brand-500 sm:text-lg">{reference}</span>
          <button
            type="button"
            onClick={async () => {
              const ok = await copy(reference);
              setRefCopied(ok);
              window.setTimeout(() => setRefCopied(false), 1800);
              toast({
                title: ok
                  ? t({ en: "Reference copied", bn: "রেফারেন্স কপি হয়েছে" })
                  : t({ en: "Could not copy", bn: "কপি করা যায়নি" }),
                tone: ok ? "success" : "error",
              });
            }}
            className="press grid h-9 w-9 place-items-center rounded-lg opacity-70 transition hover:opacity-100"
            aria-label="Copy reference"
          >
            {refCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href="/dashboard"
            className="press inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t({ en: "Client portal", bn: "ক্লায়েন্ট পোর্টাল" })}
          </a>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "press inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition",
              dark
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-border/20 text-fg hover:bg-canvas-muted"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            {t({ en: "Message on WhatsApp", bn: "হোয়াটসঅ্যাপে বার্তা" })}
          </a>
        </div>
      </div>
    );
  }

  /* ── Shared summary body (aside on desktop, sheet on mobile) ─────────── */
  const summaryBody = (
    <>
      <div className="space-y-3 text-sm">
        <EstimateRow icon={<Tag className="h-3.5 w-3.5" />} label={t({ en: "Type", bn: "ধরন" })} value={t(category.title)} dark={dark} />
        <EstimateRow icon={<Layers className="h-3.5 w-3.5" />} label={t({ en: "Package", bn: "প্যাকেজ" })} value={lang === "bn" ? pkg.titleBn : pkg.title} dark={dark} />
        <EstimateRow icon={<Receipt className="h-3.5 w-3.5" />} label={t({ en: "Pages", bn: "পেজ" })} value={t(pageTier.label)} dark={dark} />
        <EstimateRow icon={<Gauge className="h-3.5 w-3.5" />} label={t({ en: "Scope", bn: "পরিসর" })} value={estimate.scope} dark={dark} />
        <EstimateRow icon={<Clock className="h-3.5 w-3.5" />} label={t({ en: "Timeline", bn: "সময়" })} value={estimate.timeline} dark={dark} />
      </div>

      <div className={cn("mt-4 rounded-2xl border p-4", dark ? "border-white/10 bg-black/25" : "border-border/10 bg-surface")}>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest opacity-60">
          <Wallet className="h-3.5 w-3.5" />
          {t({ en: "Estimated price", bn: "আনুমানিক মূল্য" })}
        </div>
        <div className="mt-1 text-2xl font-extrabold tabular-nums text-emerald-500">
          {estimate.priceRange}
        </div>
        <dl className={cn("mt-3 space-y-1 border-t pt-3 text-[11px]", dark ? "border-white/10 text-white/55" : "border-border/10 text-fg-muted")}>
          <BreakdownRow label={t({ en: "Base", bn: "মূল" })} value={`$${estimate.base}`} />
          {estimate.pagesCost > 0 && (
            <BreakdownRow label={t({ en: "Pages", bn: "পেজ" })} value={`+$${estimate.pagesCost}`} />
          )}
          {estimate.featuresCost > 0 && (
            <BreakdownRow label={t({ en: "Extras", bn: "অতিরিক্ত" })} value={`+$${estimate.featuresCost}`} />
          )}
          {estimate.languageCost > 0 && (
            <BreakdownRow label={t({ en: "Bilingual", bn: "দুই ভাষা" })} value={`+$${estimate.languageCost}`} />
          )}
        </dl>
        <p className={cn("mt-3 text-[11px] leading-relaxed", dark ? "text-white/45" : "text-fg-muted")}>
          {t({
            en: "Indicative only. The final fixed price is agreed before any work starts.",
            bn: "শুধুমাত্র ধারণা। কাজ শুরুর আগেই চূড়ান্ত নির্দিষ্ট মূল্য ঠিক করা হবে।",
          })}
        </p>
      </div>

      {draft.features.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest opacity-60">
            {t({ en: "Extras", bn: "অতিরিক্ত" })} ({draft.features.length})
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {draft.features.map((id) => {
              const f = BUILDER_FEATURES.find((x) => x.id === id);
              if (!f) return null;
              return (
                <span
                  key={id}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                    dark ? "bg-white/10 text-white/70" : "bg-canvas-muted text-fg-soft"
                  )}
                >
                  {lang === "bn" ? f.nameBn : f.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-2">
        <a
          href={whatsappOrderLink(draft, lang)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "press flex h-11 items-center justify-center gap-2 rounded-full border text-xs font-semibold transition",
            dark ? "border-white/15 hover:bg-white/10" : "border-border/15 hover:bg-canvas-muted"
          )}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {t({ en: "Send this on WhatsApp", bn: "হোয়াটসঅ্যাপে পাঠান" })}
        </a>
        <button
          type="button"
          onClick={copySummary}
          className={cn(
            "press flex h-10 items-center justify-center gap-2 rounded-full text-xs font-semibold transition",
            dark ? "text-white/60 hover:bg-white/10" : "text-fg-muted hover:bg-canvas-muted"
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {t({ en: "Copy summary", bn: "সারসংক্ষেপ কপি" })}
        </button>
      </div>
    </>
  );

  /* ── Flow ────────────────────────────────────────────────────────────── */
  return (
    <div ref={topRef} className={cn("flex scroll-mt-24 flex-col gap-5", className)}>
      {/* Progress indicator */}
      <div className="flex flex-col gap-3">
        <div className={cn("h-1.5 w-full overflow-hidden rounded-full", dark ? "bg-white/10" : "bg-canvas-muted")}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-[width] duration-500 ease-premium"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => i <= step && goto(i)}
                disabled={i > step}
                className={cn(
                  "press flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all",
                  active
                    ? "border-brand-500/40 bg-brand-500/12 text-brand-600 dark:text-brand-400"
                    : done
                    ? dark
                      ? "border-white/15 bg-white/5 text-white/70"
                      : "border-border/10 bg-canvas-muted text-fg-soft"
                    : dark
                    ? "border-white/10 text-white/35"
                    : "border-border/10 text-fg-muted",
                  i <= step && "cursor-pointer"
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
                    active
                      ? "bg-brand-600 text-white"
                      : done
                      ? "bg-emerald-500 text-white"
                      : dark
                      ? "bg-white/10"
                      : "bg-border/10"
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{t(s)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_310px]">
        {/* ── Panels ── */}
        <div
          className={cn(
            "rounded-3xl border p-5 sm:p-7",
            dark ? "border-white/10 bg-white/[0.03]" : "border-border/10 bg-surface"
          )}
        >
          {/* STEP 1 — CATEGORY CAROUSEL */}
          {step === 0 && (
            <div className="animate-slide-up-fade">
              <StepHeading
                dark={dark}
                title={t({ en: "What kind of website do you need?", bn: "আপনার কেমন ওয়েবসাইট প্রয়োজন?" })}
                sub={t({
                  en: "Swipe through the categories and tap one. Nothing else is asked yet.",
                  bn: "ক্যাটাগরিগুলো স্লাইড করে দেখুন এবং একটি বেছে নিন। এখনই আর কিছু জিজ্ঞেস করা হবে না।",
                })}
              />

              <div className="relative mt-5">
                <div
                  ref={railRef}
                  className="no-scrollbar snap-rail flex gap-4 overflow-x-auto pb-3"
                >
                  {BUILDINGS_DATA.map((b) => {
                    const selected = b.id === draft.categoryId;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => patch({ categoryId: b.id })}
                        aria-pressed={selected}
                        className={cn(
                          "snap-item press group relative flex w-[248px] shrink-0 flex-col gap-3 rounded-3xl border p-5 text-left transition-all duration-300",
                          selected
                            ? "border-brand-500/50 shadow-glow"
                            : dark
                            ? "border-white/10 hover:border-white/25"
                            : "border-border/10 hover:-translate-y-1 hover:border-brand-500/30",
                          dark ? "bg-white/[0.04]" : "bg-canvas-subtle"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white",
                            b.color
                          )}
                        >
                          <CategoryIcon name={b.icon} className="h-6 w-6" />
                        </span>
                        <span className="flex flex-col gap-1">
                          <span className={cn("text-sm font-bold leading-snug", dark && "text-white")}>
                            {t(b.title)}
                          </span>
                          <span className={cn("text-xs leading-relaxed", dark ? "text-white/50" : "text-fg-muted")}>
                            {t(b.subtitle)}
                          </span>
                        </span>
                        <span className="mt-auto flex items-center justify-between pt-2">
                          <span className={cn("text-[11px] font-semibold", dark ? "text-white/50" : "text-fg-muted")}>
                            {t({ en: "from", bn: "শুরু" })} ${b.basePrice}
                          </span>
                          {selected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-500">
                              <Check className="h-3 w-3" />
                              {t({ en: "Selected", bn: "নির্বাচিত" })}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <RailButton dir="left" dark={dark} onClick={() => scrollRail(-1)} />
                <RailButton dir="right" dark={dark} onClick={() => scrollRail(1)} />
              </div>

              {/* Selected category detail */}
              <div
                className={cn(
                  "mt-5 rounded-2xl border p-4 text-sm leading-relaxed",
                  dark ? "border-white/10 bg-black/20 text-white/70" : "border-border/10 bg-canvas-muted text-fg-soft"
                )}
              >
                <p>{t(category.description)}</p>
                <p className={cn("mt-2 text-xs", dark ? "text-white/45" : "text-fg-muted")}>
                  <strong className="font-semibold">{t({ en: "Great for:", bn: "উপযুক্ত:" })}</strong>{" "}
                  {t(category.targetAudience)}
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 — PACKAGE, SIZE & EXTRAS (merged: one fewer step) */}
          {step === 1 && (
            <div className="animate-slide-up-fade">
              <StepHeading
                dark={dark}
                title={t({ en: "How big is the project?", bn: "প্রজেক্টটি কত বড়?" })}
                sub={t({
                  en: "Pick a package, a page count, and anything extra. The estimate updates live.",
                  bn: "প্যাকেজ, পেজ সংখ্যা ও অতিরিক্ত ফিচার বেছে নিন। এস্টিমেট সঙ্গে সঙ্গে আপডেট হবে।",
                })}
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PORTAL_PACKAGES.map((p) => {
                  const selected = p.id === draft.packageId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => patch({ packageId: p.id as PackageId })}
                      aria-pressed={selected}
                      className={cn(
                        "press relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
                        selected
                          ? "border-brand-500/50 shadow-glow"
                          : dark
                          ? "border-white/10 hover:border-white/25"
                          : "border-border/10 hover:border-brand-500/30",
                        dark ? "bg-white/[0.04]" : "bg-canvas-subtle"
                      )}
                    >
                      <span className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", p.color)} />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className={cn("text-sm font-bold", dark && "text-white")}>
                            {t({ en: p.title, bn: p.titleBn })}
                          </div>
                          <div className="mt-0.5 text-lg font-extrabold text-brand-500">{p.priceRange}</div>
                          <div className={cn("text-[11px]", dark ? "text-white/45" : "text-fg-muted")}>
                            {p.deliveryTime} · {p.badge}
                          </div>
                        </div>
                        {selected && <Check className="h-4 w-4 shrink-0 text-brand-500" />}
                      </div>
                      <ul className={cn("mt-3 space-y-1", dark ? "text-white/60" : "text-fg-soft")}>
                        {p.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px]">
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                            {t(f)}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <FieldLabel dark={dark}>{t({ en: "Number of pages", bn: "পেজ সংখ্যা" })}</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PAGE_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => patch({ pages: tier.id })}
                      aria-pressed={draft.pages === tier.id}
                      className={cn(
                        "press rounded-full border px-4 py-2 text-xs font-semibold transition",
                        draft.pages === tier.id
                          ? "border-brand-500/50 bg-brand-500/12 text-brand-600 dark:text-brand-400"
                          : dark
                          ? "border-white/10 text-white/60 hover:border-white/25"
                          : "border-border/10 text-fg-soft hover:border-brand-500/30"
                      )}
                    >
                      {t(tier.label)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => patch({ multilingual: !draft.multilingual })}
                role="switch"
                aria-checked={draft.multilingual}
                className={cn(
                  "press mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition",
                  draft.multilingual
                    ? "border-brand-500/40 bg-brand-500/[0.07]"
                    : dark
                    ? "border-white/10 hover:border-white/25"
                    : "border-border/10 hover:border-brand-500/25"
                )}
              >
                <span>
                  <span className={cn("block text-sm font-semibold", dark && "text-white")}>
                    {t({ en: "Bilingual (বাংলা + English)", bn: "দুই ভাষা (বাংলা + English)" })}
                  </span>
                  <span className={cn("block text-xs", dark ? "text-white/50" : "text-fg-muted")}>
                    {t({ en: "Adds a language switcher across the whole site", bn: "পুরো সাইটে ভাষা পরিবর্তনের সুবিধা যোগ হবে" })}
                  </span>
                </span>
                <span
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition",
                    draft.multilingual ? "bg-brand-600" : dark ? "bg-white/15" : "bg-border/20"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                      draft.multilingual ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </span>
              </button>

              {/* Extras — folded into the same step, clearly optional */}
              <div className="mt-7">
                <div className="flex items-baseline justify-between gap-3">
                  <FieldLabel dark={dark}>
                    {t({ en: "Extras (optional)", bn: "অতিরিক্ত ফিচার (ঐচ্ছিক)" })}
                  </FieldLabel>
                  {draft.features.length > 0 && (
                    <button
                      type="button"
                      onClick={() => patch({ features: [] })}
                      className="text-[11px] font-semibold text-brand-500 hover:underline"
                    >
                      {t({ en: "Clear all", bn: "সব মুছুন" })}
                    </button>
                  )}
                </div>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {BUILDER_FEATURES.map((f) => {
                    const on = draft.features.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          patch({
                            features: on
                              ? draft.features.filter((x) => x !== f.id)
                              : [...draft.features, f.id],
                          })
                        }
                        className={cn(
                          "press flex items-start gap-3 rounded-2xl border p-3.5 text-left transition",
                          on
                            ? "border-brand-500/45 bg-brand-500/[0.07]"
                            : dark
                            ? "border-white/10 hover:border-white/25"
                            : "border-border/10 hover:border-brand-500/25"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
                            on ? "border-brand-500 bg-brand-600 text-white" : dark ? "border-white/25" : "border-border/25"
                          )}
                        >
                          {on && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("flex items-center justify-between gap-2 text-sm font-semibold", dark && "text-white")}>
                            <span className="truncate">{lang === "bn" ? f.nameBn : f.name}</span>
                            <span className="shrink-0 text-[11px] font-bold text-emerald-500">+${f.cost}</span>
                          </span>
                          <span className={cn("mt-0.5 block text-[11px] leading-relaxed", dark ? "text-white/50" : "text-fg-muted")}>
                            {t(f.description)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — CONTACT */}
          {step === 2 && (
            <div className="animate-slide-up-fade">
              <StepHeading
                dark={dark}
                title={t({ en: "Where should Rahat reply?", bn: "রাহাত কোথায় উত্তর দেবেন?" })}
                sub={t({
                  en: "Only three fields are required. Everything else is optional.",
                  bn: "মাত্র তিনটি ঘর আবশ্যক। বাকি সব ঐচ্ছিক।",
                })}
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  dark={dark}
                  required
                  label={t({ en: "Full name", bn: "পুরো নাম" })}
                  value={draft.fullName}
                  onChange={(v) => patch({ fullName: v })}
                  onBlur={() => setTouched((s) => ({ ...s, fullName: true }))}
                  error={touched.fullName ? errorMessage("fullName") : null}
                  valid={!errors.fullName && draft.fullName.length > 0}
                  autoComplete="name"
                  placeholder={t({ en: "e.g. Rahat Ahmed", bn: "যেমন: রাহাত আহমেদ" })}
                />
                <Field
                  dark={dark}
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  label={t({ en: "Phone / WhatsApp", bn: "ফোন / হোয়াটসঅ্যাপ" })}
                  value={draft.phone}
                  onChange={(v) => patch({ phone: v })}
                  onBlur={() => setTouched((s) => ({ ...s, phone: true }))}
                  error={touched.phone ? errorMessage("phone") : null}
                  valid={!errors.phone && draft.phone.length > 0}
                  placeholder="+880 1XXX-XXXXXX"
                />
                <Field
                  dark={dark}
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  label={t({ en: "Email", bn: "ইমেইল" })}
                  value={draft.email}
                  onChange={(v) => patch({ email: v })}
                  onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                  error={touched.email ? errorMessage("email") : null}
                  valid={!errors.email && draft.email.length > 0}
                  placeholder="you@example.com"
                  className="sm:col-span-2"
                />
                <Field
                  dark={dark}
                  autoComplete="organization"
                  label={t({ en: "Company (optional)", bn: "প্রতিষ্ঠান (ঐচ্ছিক)" })}
                  value={draft.companyName}
                  onChange={(v) => patch({ companyName: v })}
                  placeholder={t({ en: "Business or brand name", bn: "ব্যবসা বা ব্র্যান্ডের নাম" })}
                />
                <Field
                  dark={dark}
                  autoComplete="country-name"
                  label={t({ en: "Country", bn: "দেশ" })}
                  value={draft.country}
                  onChange={(v) => patch({ country: v })}
                  placeholder="Bangladesh"
                />

                <div className="sm:col-span-2">
                  <FieldLabel dark={dark}>
                    {t({ en: "Anything else? (optional)", bn: "আর কিছু বলার আছে? (ঐচ্ছিক)" })}
                  </FieldLabel>
                  <textarea
                    rows={4}
                    value={draft.notes}
                    onChange={(e) => patch({ notes: e.target.value })}
                    placeholder={t({
                      en: "A reference site you like, a deadline, anything at all…",
                      bn: "পছন্দের কোনো সাইট, ডেডলাইন, বা যেকোনো তথ্য…",
                    })}
                    className={cn(
                      "mt-2 w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-brand-500",
                      dark
                        ? "border-white/12 bg-black/30 text-white placeholder-white/30"
                        : "border-border/15 bg-canvas-subtle text-fg placeholder-fg-muted"
                    )}
                  />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-xs font-semibold text-red-500"
                >
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-7 flex items-center justify-between gap-3 border-t border-current/10 pt-5">
            <button
              type="button"
              onClick={() => (step === 0 ? undefined : goto(step - 1))}
              disabled={step === 0}
              className={cn(
                "press inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-0",
                dark ? "text-white/70 hover:bg-white/10" : "text-fg-soft hover:bg-canvas-muted"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              {t({ en: "Back", bn: "পেছনে" })}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => goto(step + 1)}
                className="press group inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold text-white shadow-[0_14px_34px_-14px_rgba(244,63,94,0.85)] transition hover:bg-brand-500"
              >
                {step === STEPS.length - 2
                  ? t({ en: "Almost done", bn: "প্রায় শেষ" })
                  : t({ en: "Continue", bn: "পরবর্তী" })}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={isPending}
                className="press group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-7 text-sm font-bold text-white shadow-[0_14px_34px_-14px_rgba(244,63,94,0.85)] transition hover:from-brand-500 hover:to-brand-400 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t({ en: "Sending…", bn: "পাঠানো হচ্ছে…" })}
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    {t({ en: "Send my request", bn: "অনুরোধ পাঠান" })}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Live estimate (desktop) ── */}
        <aside
          className={cn(
            "hidden h-fit rounded-3xl border p-5 lg:sticky lg:top-24 lg:block",
            dark ? "border-white/10 bg-white/[0.03] text-white" : "border-border/10 bg-canvas-subtle"
          )}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            {t({ en: "Live estimate", bn: "লাইভ এস্টিমেট" })}
          </div>
          <div className="mt-4">{summaryBody}</div>
        </aside>
      </div>

      {/* ── Sticky mobile action bar ── */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[58] lg:hidden",
          "px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))]",
          !showStickyBar && "hidden"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-3xl border p-2.5 shadow-lift backdrop-blur-xl",
            dark ? "border-white/12 bg-black/80" : "border-border/12 bg-surface/92"
          )}
        >
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="press flex min-w-0 flex-1 flex-col items-start rounded-2xl px-3 py-1 text-left"
          >
            <span className={cn("text-[10px] font-semibold uppercase tracking-widest", dark ? "text-white/50" : "text-fg-muted")}>
              {t({ en: "Estimate · tap for details", bn: "এস্টিমেট · বিস্তারিত দেখুন" })}
            </span>
            <span className="truncate text-base font-extrabold tabular-nums text-emerald-500">
              {estimate.priceRange}
            </span>
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => goto(step + 1)}
              className="press inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-brand-600 px-5 text-sm font-bold text-white"
            >
              {t({ en: "Continue", bn: "পরবর্তী" })}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              className="press inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 text-sm font-bold text-white disabled:opacity-60"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              {t({ en: "Send", bn: "পাঠান" })}
            </button>
          )}
        </div>
      </div>
      {/* Clearance so the sticky bar never covers the last control. */}
      {showStickyBar && <div aria-hidden className="h-24 lg:hidden" />}

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={t({ en: "Your order summary", bn: "আপনার অর্ডার সারসংক্ষেপ" })}
        description={t({
          en: "Everything updates live as you change your choices.",
          bn: "আপনার পছন্দ বদলালেই এখানে সঙ্গে সঙ্গে আপডেট হবে।",
        })}
      >
        {summaryBody}
      </BottomSheet>
    </div>
  );
}

/* ── small pieces ──────────────────────────────────────────────────────── */

function StepHeading({ title, sub, dark }: { title: string; sub: string; dark: boolean }) {
  return (
    <div>
      <h3 className={cn("text-xl font-bold tracking-tight sm:text-2xl", dark && "text-white")}>{title}</h3>
      <p className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-white/55" : "text-fg-soft")}>{sub}</p>
    </div>
  );
}

function FieldLabel({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <span className={cn("text-xs font-semibold uppercase tracking-[0.14em]", dark ? "text-white/55" : "text-fg-muted")}>
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  required,
  dark,
  className,
  error,
  valid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
  required?: boolean;
  dark: boolean;
  className?: string;
  error?: string | null;
  valid?: boolean;
}) {
  return (
    <div className={className}>
      <FieldLabel dark={dark}>
        {label} {required && <span className="text-brand-500">*</span>}
      </FieldLabel>
      <div className="relative mt-2">
        <input
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          required={required}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-2xl border px-4 pr-10 text-sm outline-none transition",
            error
              ? "border-red-500/60 focus:border-red-500"
              : valid
              ? "border-emerald-500/45 focus:border-emerald-500"
              : "focus:border-brand-500",
            dark
              ? "border-white/12 bg-black/30 text-white placeholder-white/30"
              : !error && !valid
              ? "border-border/15 bg-canvas-subtle text-fg placeholder-fg-muted"
              : "bg-canvas-subtle text-fg placeholder-fg-muted"
          )}
        />
        {valid && !error && (
          <Check className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
        )}
      </div>
      {error ? (
        <p role="alert" className="mt-1.5 text-[11px] font-semibold text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt>{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function EstimateRow({
  icon,
  label,
  value,
  dark,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dark: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className={cn("flex items-center gap-1.5 text-xs", dark ? "text-white/50" : "text-fg-muted")}>
        {icon}
        {label}
      </span>
      <span className={cn("max-w-[60%] text-right text-xs font-semibold", dark ? "text-white" : "text-fg")}>
        {value}
      </span>
    </div>
  );
}

function RailButton({
  dir,
  onClick,
  dark,
}: {
  dir: "left" | "right";
  onClick: () => void;
  dark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Previous categories" : "More categories"}
      className={cn(
        "absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border shadow-soft backdrop-blur transition sm:grid",
        dir === "left" ? "-left-3" : "-right-3",
        dark
          ? "border-white/15 bg-black/60 text-white hover:bg-black/80"
          : "border-border/10 bg-surface/90 text-fg hover:bg-surface"
      )}
    >
      {dir === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
