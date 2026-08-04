"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Building2, Clock, Rocket, ShieldCheck, Sliders, Sparkles, Wallet } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { OrderFlow } from "@/components/order/order-flow";
import { Container } from "@/components/ui/primitives";
import { ExperienceSwitch } from "@/components/experience/experience-switch";
import { SkeletonPanel } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** The full interactive district stays available — it is simply no longer the
 *  first thing a visitor is confronted with. Code-split so the quick path
 *  never pays for it. */
const ServiceDistrictMain = dynamic(
  () => import("@/components/service-district/ServiceDistrictMain").then((m) => m.ServiceDistrictMain),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonPanel key={i} />
        ))}
      </div>
    ),
  }
);

type Mode = "quick" | "district";

/** Read the deep-link mode from the URL (e.g. /order?mode=district). */
function initialMode(): Mode {
  if (typeof window === "undefined") return "quick";
  return new URLSearchParams(window.location.search).get("mode") === "district"
    ? "district"
    : "quick";
}

export function OrderPageClient() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>(initialMode);

  const switchMode = (next: Mode) => {
    setMode(next);
    // Keep the URL shareable — ?mode=district lands straight on the district.
    const url = new URL(window.location.href);
    if (next === "district") url.searchParams.set("mode", "district");
    else url.searchParams.delete("mode");
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="relative min-h-screen pb-16 pt-10 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade opacity-70" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-600/15 blur-[130px]" />
        <div className="absolute -right-24 top-64 h-72 w-72 rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            <Sparkles className="h-3.5 w-3.5" />
            {t({ en: "Website order", bn: "ওয়েবসাইট অর্ডার" })}
          </span>
          <h1 className="mt-5 text-balance text-display-lg font-bold tracking-tight">
            {t({
              en: "Order your website in three short steps",
              bn: "তিনটি সহজ ধাপে ওয়েবসাইট অর্ডার করুন",
            })}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-fg-soft">
            {t({
              en: "Pick a category, set the size, and leave your contact. You get a live price estimate as you go — no long forms, no obligation.",
              bn: "ক্যাটাগরি বাছুন, আকার ঠিক করুন এবং যোগাযোগের তথ্য দিন। সঙ্গে সঙ্গেই মূল্যের ধারণা পাবেন — বড় ফর্ম নেই, বাধ্যবাধকতাও নেই।",
            })}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t({ en: "About 2 minutes", bn: "প্রায় ২ মিনিট" })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" />
              {t({ en: "Free estimate", bn: "বিনামূল্যে এস্টিমেট" })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t({ en: "Fixed price before work starts", bn: "কাজ শুরুর আগেই নির্দিষ্ট মূল্য" })}
            </span>
          </div>
        </div>

        {/* Mode switch */}
        <div className="mx-auto mt-9 flex w-fit items-center gap-1 rounded-full border border-border/12 bg-surface/70 p-1 backdrop-blur">
          <ModeTab active={mode === "quick"} onClick={() => switchMode("quick")}>
            <Rocket className="h-3.5 w-3.5" />
            {t({ en: "Quick order", bn: "দ্রুত অর্ডার" })}
          </ModeTab>
          <ModeTab active={mode === "district"} onClick={() => switchMode("district")}>
            <Sliders className="h-3.5 w-3.5" />
            {t({ en: "Explore in detail", bn: "বিস্তারিত দেখুন" })}
          </ModeTab>
        </div>
        <p className="mt-3 text-center text-[11px] text-fg-muted">
          {mode === "quick"
            ? t({
                en: "Prefer to browse packages, talk to the AI consultant or use the 3D builder? Switch to “Explore in detail”.",
                bn: "প্যাকেজ ঘুরে দেখতে, এআই কনসালটেন্ট বা ৩ডি বিল্ডার ব্যবহার করতে চান? “বিস্তারিত দেখুন”-এ যান।",
              })
            : t({
                en: "Everything here also feeds the same order — the quick path is just shorter.",
                bn: "এখানকার সবকিছু একই অর্ডারেই যায় — দ্রুত পথটি শুধু সংক্ষিপ্ত।",
              })}
        </p>

        {/* Body */}
        <div className="mt-10">
          {mode === "quick" ? (
            <OrderFlow variant="site" />
          ) : (
            <div className="animate-fade-in">
              <ServiceDistrictMain />
            </div>
          )}
        </div>

        {/* Same thing, other door */}
        <div className="mt-14 flex flex-col items-center gap-3 rounded-3xl border border-border/12 bg-surface/50 p-7 text-center backdrop-blur">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
            <Building2 className="h-3.5 w-3.5" />
            {t({ en: "Same order, other experience", bn: "একই অর্ডার, অন্য অভিজ্ঞতা" })}
          </span>
          <p className="max-w-xl text-sm leading-relaxed text-fg-soft">
            {t({
              en: "You can complete this exact order from inside RahatVerse — at the Website Store in the 3D city. Your draft travels with you.",
              bn: "এই একই অর্ডার আপনি রাহাতভার্সের ভেতরে ওয়েবসাইট স্টোর থেকেও সম্পূর্ণ করতে পারবেন। আপনার ড্রাফট সঙ্গে সঙ্গেই চলে যাবে।",
            })}
          </p>
          <ExperienceSwitch to="verse" variant="pill" />
        </div>
      </Container>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold transition-all",
        active
          ? "bg-brand-600 text-white shadow-soft"
          : "text-fg-soft hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}
