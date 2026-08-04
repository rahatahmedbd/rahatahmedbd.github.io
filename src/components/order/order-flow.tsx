"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
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
import {
  EMAIL_RE,
  PAGE_TIERS,
  clearOrderDraft,
  emptyOrderDraft,
  estimateOrder,
  getCategory,
  getPackage,
  loadOrderDraft,
  saveOrderDraft,
  type OrderDraft,
  type PackageId,
} from "@/lib/order/pricing";
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
  className?: string;
}

const STEPS = [
  { id: "category", en: "Website type", bn: "ওয়েবসাইটের ধরন" },
  { id: "package", en: "Size & package", bn: "সাইজ ও প্যাকেজ" },
  { id: "features", en: "Extras", bn: "অতিরিক্ত ফিচার" },
  { id: "contact", en: "Your details", bn: "আপনার তথ্য" },
] as const;

/**
 * The website ordering journey — deliberately staged so a visitor never meets
 * a wall of form fields. Category first (as a swipeable carousel), then the
 * few decisions that actually change the estimate, then only the contact
 * fields we truly need.
 *
 * Rendered identically inside the Website Experience and inside RahatVerse.
 */
export function OrderFlow({
  variant = "site",
  initialCategoryId,
  onSubmitted,
  className,
}: OrderFlowProps) {
  const { t, lang } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OrderDraft>(() => ({
    ...emptyOrderDraft,
    ...(initialCategoryId ? { categoryId: initialCategoryId } : {}),
  }));
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const dark = variant === "verse";

  /* Resume an unfinished draft — a journey started in the city can be
     finished on the website, and vice-versa. */
  useEffect(() => {
    const saved = loadOrderDraft();
    if (saved) {
      setDraft((d) => ({
        ...saved,
        categoryId: initialCategoryId || saved.categoryId || d.categoryId,
      }));
    }
    setHydrated(true);
  }, [initialCategoryId]);

  useEffect(() => {
    if (hydrated) saveOrderDraft(draft);
  }, [draft, hydrated]);

  const estimate = useMemo(() => estimateOrder(draft), [draft]);
  const category = getCategory(draft.categoryId);
  const pkg = getPackage(draft.packageId);

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
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const canAdvance = () => {
    if (step < STEPS.length - 1) return true;
    return (
      draft.fullName.trim().length >= 2 &&
      EMAIL_RE.test(draft.email.trim()) &&
      draft.phone.replace(/\D/g, "").length >= 6
    );
  };

  const submit = () => {
    setError(null);
    if (draft.fullName.trim().length < 2) {
      setError(t({ en: "Please enter your name.", bn: "আপনার নাম লিখুন।" }));
      return;
    }
    if (!EMAIL_RE.test(draft.email.trim())) {
      setError(t({ en: "Please enter a valid email address.", bn: "সঠিক ইমেইল ঠিকানা লিখুন।" }));
      return;
    }
    if (draft.phone.replace(/\D/g, "").length < 6) {
      setError(t({ en: "Please enter a valid phone number.", bn: "সঠিক ফোন নম্বর লিখুন।" }));
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
          clearOrderDraft();
          onSubmitted?.(res.reference);
          return;
        }
        setError(res.error || t({ en: "Could not submit. Please try again.", bn: "জমা দেওয়া যায়নি। আবার চেষ্টা করুন।" }));
      } catch {
        setError(
          t({
            en: "Network problem — your request was not sent. Please check your connection.",
            bn: "নেটওয়ার্ক সমস্যা — অনুরোধটি পাঠানো যায়নি। সংযোগ পরীক্ষা করুন।",
          })
        );
      }
    });
  };

  /* ── Success ─────────────────────────────────────────────────────────── */
  if (reference) {
    return (
      <div
        className={cn(
          "rounded-3xl border p-8 text-center",
          dark ? "border-white/10 bg-white/[0.04] text-white" : "border-border/10 bg-surface",
          className
        )}
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight">
          {t({ en: "Request received!", bn: "অনুরোধ পৌঁছে গেছে!" })}
        </h3>
        <p className={cn("mx-auto mt-2 max-w-md text-sm", dark ? "text-white/60" : "text-fg-soft")}>
          {t({
            en: "Your project is saved and Rahat has been notified. You will hear back within 24 hours.",
            bn: "আপনার প্রজেক্ট সেভ হয়েছে এবং রাহাতের কাছে নোটিফিকেশন গেছে। ২৪ ঘণ্টার মধ্যে উত্তর পাবেন।",
          })}
        </p>

        <div
          className={cn(
            "mx-auto mt-6 flex w-fit items-center gap-3 rounded-2xl border px-5 py-3",
            dark ? "border-white/10 bg-black/30" : "border-border/10 bg-canvas-muted"
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-widest opacity-60">
            {t({ en: "Reference", bn: "রেফারেন্স" })}
          </span>
          <span className="font-mono text-lg font-bold text-brand-500">{reference}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(reference);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1800);
            }}
            className="grid h-8 w-8 place-items-center rounded-lg opacity-70 transition hover:opacity-100"
            aria-label="Copy reference"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/dashboard"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t({ en: "Client portal", bn: "ক্লায়েন্ট পোর্টাল" })}
          </a>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition",
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

  /* ── Flow ────────────────────────────────────────────────────────────── */
  return (
    <div ref={topRef} className={cn("flex flex-col gap-6", className)}>
      {/* Stepper — swipeable on phones, scrollbar hidden for a clean look */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
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
                "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all",
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

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* ── Panels ── */}
        <div
          className={cn(
            "rounded-3xl border p-5 sm:p-7",
            dark ? "border-white/10 bg-white/[0.03]" : "border-border/10 bg-surface"
          )}
        >
          {/* STEP 1 — CATEGORY CAROUSEL */}
          {step === 0 && (
            <div className="animate-fade-in">
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
                  className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
                >
                  {BUILDINGS_DATA.map((b) => {
                    const selected = b.id === draft.categoryId;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => patch({ categoryId: b.id })}
                        className={cn(
                          "group relative flex w-[248px] shrink-0 snap-start flex-col gap-3 rounded-3xl border p-5 text-left transition-all duration-300",
                          selected
                            ? "border-brand-500/50 shadow-glow"
                            : dark
                            ? "border-white/10 hover:border-white/25"
                            : "border-border/10 hover:border-brand-500/30 hover:-translate-y-1",
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

          {/* STEP 2 — PACKAGE + SIZE */}
          {step === 1 && (
            <div className="animate-fade-in">
              <StepHeading
                dark={dark}
                title={t({ en: "How big is the project?", bn: "প্রজেক্টটি কত বড়?" })}
                sub={t({
                  en: "Pick a package and page count. The estimate updates live — change it any time.",
                  bn: "একটি প্যাকেজ ও পেজ সংখ্যা বেছে নিন। বাজেট সঙ্গে সঙ্গে আপডেট হবে — যেকোনো সময় বদলানো যাবে।",
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
                      className={cn(
                        "relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
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
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs font-semibold transition",
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
                className={cn(
                  "mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition",
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
            </div>
          )}

          {/* STEP 3 — FEATURES */}
          {step === 2 && (
            <div className="animate-fade-in">
              <StepHeading
                dark={dark}
                title={t({ en: "Anything extra?", bn: "অতিরিক্ত কিছু লাগবে?" })}
                sub={t({
                  en: "Optional. Skip it and we will discuss later — the estimate still works.",
                  bn: "ঐচ্ছিক। চাইলে এড়িয়ে যান, পরে আলোচনা করা যাবে — এস্টিমেট তবুও কাজ করবে।",
                })}
              />

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {BUILDER_FEATURES.map((f) => {
                  const on = draft.features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() =>
                        patch({
                          features: on
                            ? draft.features.filter((x) => x !== f.id)
                            : [...draft.features, f.id],
                        })
                      }
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition",
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
          )}

          {/* STEP 4 — CONTACT */}
          {step === 3 && (
            <div className="animate-fade-in">
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
                  placeholder={t({ en: "e.g. Rahat Ahmed", bn: "যেমন: রাহাত আহমেদ" })}
                />
                <Field
                  dark={dark}
                  required
                  type="tel"
                  label={t({ en: "Phone / WhatsApp", bn: "ফোন / হোয়াটসঅ্যাপ" })}
                  value={draft.phone}
                  onChange={(v) => patch({ phone: v })}
                  placeholder="+880 1XXX-XXXXXX"
                />
                <Field
                  dark={dark}
                  required
                  type="email"
                  label={t({ en: "Email", bn: "ইমেইল" })}
                  value={draft.email}
                  onChange={(v) => patch({ email: v })}
                  placeholder="you@example.com"
                  className="sm:col-span-2"
                />
                <Field
                  dark={dark}
                  label={t({ en: "Company (optional)", bn: "প্রতিষ্ঠান (ঐচ্ছিক)" })}
                  value={draft.companyName}
                  onChange={(v) => patch({ companyName: v })}
                  placeholder={t({ en: "Business or brand name", bn: "ব্যবসা বা ব্র্যান্ডের নাম" })}
                />
                <Field
                  dark={dark}
                  label={t({ en: "Country", bn: "দেশ" })}
                  value={draft.country}
                  onChange={(v) => patch({ country: v })}
                  placeholder="Bangladesh"
                />
                <div className="sm:col-span-2">
                  <FieldLabel dark={dark}>{t({ en: "Anything else? (optional)", bn: "আর কিছু বলার আছে? (ঐচ্ছিক)" })}</FieldLabel>
                  <textarea
                    rows={3}
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
                "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:opacity-0",
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
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold text-white shadow-[0_14px_34px_-14px_rgba(244,63,94,0.85)] transition hover:bg-brand-500"
              >
                {step === 2
                  ? t({ en: "Almost done", bn: "প্রায় শেষ" })
                  : t({ en: "Continue", bn: "পরবর্তী" })}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={isPending || !canAdvance()}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-7 text-sm font-bold text-white shadow-[0_14px_34px_-14px_rgba(244,63,94,0.85)] transition hover:from-brand-500 hover:to-brand-400 disabled:opacity-50"
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

        {/* ── Live estimate ── */}
        <aside
          className={cn(
            "h-fit rounded-3xl border p-5 lg:sticky lg:top-24",
            dark ? "border-white/10 bg-white/[0.03] text-white" : "border-border/10 bg-canvas-subtle"
          )}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            {t({ en: "Live estimate", bn: "লাইভ এস্টিমেট" })}
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <EstimateRow icon={<Tag className="h-3.5 w-3.5" />} label={t({ en: "Type", bn: "ধরন" })} value={t(category.title)} dark={dark} />
            <EstimateRow icon={<Layers className="h-3.5 w-3.5" />} label={t({ en: "Package", bn: "প্যাকেজ" })} value={lang === "bn" ? pkg.titleBn : pkg.title} dark={dark} />
            <EstimateRow icon={<Gauge className="h-3.5 w-3.5" />} label={t({ en: "Scope", bn: "পরিসর" })} value={estimate.scope} dark={dark} />
            <EstimateRow icon={<Clock className="h-3.5 w-3.5" />} label={t({ en: "Timeline", bn: "সময়" })} value={estimate.timeline} dark={dark} />
          </div>

          <div className={cn("mt-4 rounded-2xl border p-4", dark ? "border-white/10 bg-black/25" : "border-border/10 bg-surface")}>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest opacity-60">
              <Wallet className="h-3.5 w-3.5" />
              {t({ en: "Estimated price", bn: "আনুমানিক মূল্য" })}
            </div>
            <div className="mt-1 text-2xl font-extrabold text-emerald-500">{estimate.priceRange}</div>
            <p className={cn("mt-1 text-[11px] leading-relaxed", dark ? "text-white/45" : "text-fg-muted")}>
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

          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-5 flex h-10 items-center justify-center gap-2 rounded-full border text-xs font-semibold transition",
              dark ? "border-white/15 hover:bg-white/10" : "border-border/15 hover:bg-canvas-muted"
            )}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {t({ en: "Prefer to just chat?", bn: "সরাসরি কথা বলবেন?" })}
          </a>
        </aside>
      </div>
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
  placeholder,
  type = "text",
  required,
  dark,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  dark: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel dark={dark}>
        {label} {required && <span className="text-brand-500">*</span>}
      </FieldLabel>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-2 h-11 w-full rounded-2xl border px-4 text-sm outline-none transition focus:border-brand-500",
          dark
            ? "border-white/12 bg-black/30 text-white placeholder-white/30"
            : "border-border/15 bg-canvas-subtle text-fg placeholder-fg-muted"
        )}
      />
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
