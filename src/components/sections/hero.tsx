"use client";

import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  ChevronDown,
  Droplet,
  GraduationCap,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { hero } from "@/content/home";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge, Chip } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { RotatingText } from "@/components/ui/rotating-text";
import { useCountUp } from "@/hooks/use-count-up";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const proof = [
  {
    icon: Award,
    value: 12,
    suffix: "+",
    label: { bn: "অর্জন ও পুরস্কার", en: "Awards & achievements" },
  },
  {
    icon: Droplet,
    value: 4,
    suffix: "×",
    label: { bn: "রক্তদান (A+)", en: "Blood donations (A+)" },
  },
  {
    icon: Star,
    value: 5,
    suffix: ".00",
    label: { bn: "SSC GPA (A+)", en: "SSC GPA (A+)" },
  },
];

function ProofStat({
  icon: Icon,
  value,
  suffix,
  label,
}: {
  icon: typeof Award;
  value: number;
  suffix: string;
  label: { bn: string; en: string };
}) {
  const { t, lang } = useLanguage();
  const { ref, display } = useCountUp(value, lang, 1400);

  return (
    <div className="relative flex flex-col items-center gap-1.5 px-2 py-5 text-center transition-colors duration-300 hover:bg-canvas-muted/40 sm:flex-row sm:justify-center sm:gap-4 sm:px-4 sm:py-7">
      <Icon className="h-5 w-5 shrink-0 text-brand-500 sm:h-6 sm:w-6" />
      <span className="flex flex-col sm:items-start">
        <span className="text-xl font-extrabold leading-none tracking-tight text-fg tabular-nums sm:text-2xl">
          <span ref={ref}>{display}</span>
          {suffix}
        </span>
        <span className="mt-1.5 text-[10px] leading-tight text-fg-muted sm:text-xs">
          {t(label)}
        </span>
      </span>
    </div>
  );
}

/**
 * The homepage opening — premium, calm and conversion-focused.
 * One unmistakable primary action (order a website), one low-friction
 * alternative (ask a question), and the credibility signals a visitor needs
 * before either.
 */
export function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const prefetchOrder = useCallback(() => router.prefetch("/order"), [router]);

  /* Stable identity per language so the rotation timer is not reset on
     every parent render. */
  const roles = useMemo(() => hero.chips.map((chip) => t(chip)), [t]);

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20"
    >
      {/* Ambient background — three cheap blurred layers, no images. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:72px_72px] opacity-[0.22] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
        <div className="absolute -left-32 top-8 h-96 w-96 rounded-full bg-brand-600/12 blur-[150px]" />
        <div className="absolute -right-28 top-56 h-96 w-96 rounded-full bg-cyan-500/8 blur-[150px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:px-8">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6 sm:gap-7">
          {/* Availability badge — live, honest, and the first thing read. */}
          <Reveal direction="fade">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3.5 py-1.5 text-xs font-semibold text-emerald-600 shadow-soft backdrop-blur-xl dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t({
                bn: "নতুন প্রজেক্টের জন্য উপলব্ধ",
                en: "Available for new projects",
              })}
            </span>
          </Reveal>

          {/* Greeting + name + rotating role */}
          <Reveal delay={70}>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-fg-muted sm:text-sm">
                {t({ bn: "আসসালামু আলাইকুম, আমি", en: "Assalamu Alaikum, I am" })}
              </span>
              <h1 className="text-display-2xl font-extrabold leading-[1.03] tracking-[-0.03em]">
                <span className="text-gradient-brand">{t(hero.name)}</span>
              </h1>
              <p className="flex flex-wrap items-baseline gap-x-2 text-lg font-semibold tracking-tight sm:text-xl">
                <RotatingText items={roles} className="text-brand-600 dark:text-brand-400" />
              </p>
            </div>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={130}>
            <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-fg-soft sm:text-base">
              {t(hero.subtitle)}
            </p>
          </Reveal>

          {/* Identity chips */}
          <Reveal delay={180}>
            <div className="flex flex-wrap items-center gap-2">
              {hero.chips.map((chip) => (
                <Chip key={chip.en} tone={chip.tone === "blood" ? "brand" : "outline"}>
                  {chip.tone === "blood" && <Droplet className="h-3.5 w-3.5" />}
                  {t(chip)}
                </Chip>
              ))}
            </div>
          </Reveal>

          {/* CTA hierarchy: one primary, one quiet alternative */}
          <Reveal delay={230} className="w-full">
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button
                href="/order"
                size="lg"
                onMouseEnter={prefetchOrder}
                onFocus={prefetchOrder}
                className="w-full sm:w-auto"
              >
                <Sparkles className="h-5 w-5" />
                {t({ bn: "ওয়েবসাইট অর্ডার করুন", en: "Order a Website" })}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                {t({ bn: "প্রশ্ন করুন", en: "Ask a question" })}
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                {t({ bn: "কাজ শুরুর আগেই নির্দিষ্ট মূল্য", en: "Fixed price before work starts" })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                {t({ bn: "২ মিনিটে বিনামূল্যে এস্টিমেট", en: "Free estimate in 2 minutes" })}
              </span>
            </div>
          </Reveal>

          {/* Verified credentials */}
          <Reveal delay={290}>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="gold">
                <Heart className="h-3.5 w-3.5" />
                {t(hero.badges.blood)}
              </Badge>
              <Badge tone="success">
                <Droplet className="h-3.5 w-3.5" />
                {t(hero.badges.donor)}
              </Badge>
              <Badge tone="brand">
                <GraduationCap className="h-3.5 w-3.5" />
                {t({ bn: "HSC ২য় বর্ষ", en: "HSC 2nd Year" })}
              </Badge>
            </div>
          </Reveal>
        </div>

        {/* Portrait */}
        <Reveal direction="scale" delay={160} className="relative mx-auto">
          <div className="relative aspect-square w-[min(74vw,22rem)] max-w-[26rem]">
            <div className="absolute inset-0 rounded-full border border-border/10" />
            <div className="absolute inset-4 rounded-full border border-border/10 [mask-image:linear-gradient(to_top,transparent,black_60%)]" />
            <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-brand-600/18 via-transparent to-cyan-500/12 blur-3xl" />

            <div className="absolute inset-6 overflow-hidden rounded-full border border-border/15 bg-canvas-muted shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]">
              <Image
                src="/images/profile.jpg"
                alt="Portrait of Rahat Ahmed"
                fill
                priority
                sizes="(max-width: 640px) 74vw, (max-width: 1024px) 40vw, 22rem"
                className="object-cover transition-transform duration-700 ease-premium hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            {/* Floating verified credential */}
            <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-3xl border border-border/15 bg-surface/95 px-4 py-2.5 shadow-lift backdrop-blur-xl sm:px-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/12">
                <GraduationCap className="h-5 w-5 text-brand-500" />
              </span>
              <div className="leading-tight">
                <div className="text-[13px] font-semibold text-fg sm:text-sm">
                  {t({ bn: "HSC ২য় বর্ষ · বিজ্ঞান", en: "HSC 2nd Year · Science" })}
                </div>
                <div className="text-[11px] text-fg-muted sm:text-xs">
                  {t({ bn: "সুনামগঞ্জ সরকারি কলেজ", en: "Sunamganj Govt. College" })}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Proof strip */}
      <div className="mx-auto mt-12 w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal delay={140} direction="up">
          <div className="grid grid-cols-3 divide-x divide-border/10 overflow-hidden rounded-3xl border border-border/10 bg-surface/60 shadow-soft backdrop-blur-xl">
            {proof.map((p) => (
              <ProofStat key={p.label.en} {...p} />
            ))}
          </div>
        </Reveal>

        {/* Scroll hint */}
        <div className="mt-8 hidden justify-center sm:flex">
          <a
            href="#about"
            className={cn(
              "group inline-flex flex-col items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em] text-fg-muted transition-colors hover:text-fg"
            )}
          >
            {t(hero.scrollHint)}
            <ChevronDown className="h-4 w-4 animate-float" />
          </a>
        </div>
      </div>
    </section>
  );
}
