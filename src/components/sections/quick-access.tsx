"use client";

import {
  ArrowUpRight,
  Award,
  Droplet,
  GraduationCap,
  Landmark,
  Mail,
  Rocket,
  ShoppingBag,
  User,
  Zap,
  MessageCircle,
  Code,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Container, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const destinations = [
  {
    href: "/order",
    icon: ShoppingBag,
    en: "Order a website",
    bn: "ওয়েবসাইট অর্ডার",
    descEn: "Packages, pricing & instant estimate",
    descBn: "প্যাকেজ, মূল্য ও তাৎক্ষণিক এস্টিমেট",
    primary: true,
    accent: "brand",
  },
  {
    href: "#about",
    icon: User,
    en: "About me",
    bn: "আমার পরিচয়",
    descEn: "Story, facts and mission",
    descBn: "গল্প, তথ্য ও লক্ষ্য",
    accent: "brand",
  },
  {
    href: "#work",
    icon: Award,
    en: "Work & achievements",
    bn: "কাজ ও অর্জন",
    descEn: "Awards, experience and gallery",
    descBn: "পুরস্কার, অভিজ্ঞতা ও গ্যালারি",
    accent: "gold",
  },
  {
    href: "#services",
    icon: Code,
    en: "Services & skills",
    bn: "সেবা ও দক্ষতা",
    descEn: "What I build and teach",
    descBn: "যা তৈরি করি ও শেখাই",
    accent: "cyan",
  },
  {
    href: "#trust",
    icon: Droplet,
    en: "Blood society",
    bn: "ব্লাড সোসাইটি",
    descEn: "Shantichakra & community work",
    descBn: "শান্তিচক্র ও সমাজসেবা",
    accent: "red",
  },
  {
    href: "#contact",
    icon: Mail,
    en: "Contact",
    bn: "যোগাযোগ",
    descEn: "Email, WhatsApp and FAQs",
    descBn: "ইমেইল, হোয়াটসঅ্যাপ ও প্রশ্নোত্তর",
    accent: "sky",
  },
  {
    href: "/rahatverse",
    icon: Rocket,
    en: "RahatVerse (3D)",
    bn: "রাহাতভার্স (থ্রিডি)",
    descEn: "Same content, cinematic city tour",
    descBn: "একই তথ্য, সিনেমাটিক শহর ভ্রমণ",
    accent: "violet",
  },
  {
    href: "/museum",
    icon: Landmark,
    en: "Portfolio museum",
    bn: "পোর্টফোলিও জাদুঘর",
    descEn: "Projects as an interactive exhibit",
    descBn: "প্রজেক্টের ইন্টারেক্টিভ প্রদর্শনী",
    accent: "amber",
  },
] as const;

type AccentColor = "brand" | "gold" | "cyan" | "red" | "sky" | "violet" | "amber";

const accentStyles: Record<AccentColor, { bg: string; border: string; iconBg: string; iconColor: string; hoverBg: string; hoverBorder: string }> = {
  brand: {
    bg: "bg-brand-500/[0.07]",
    border: "border-brand-500/35",
    iconBg: "bg-brand-600",
    iconColor: "text-white",
    hoverBg: "hover:bg-brand-500/12",
    hoverBorder: "hover:border-brand-500/60",
  },
  gold: {
    bg: "bg-gold-500/[0.07]",
    border: "border-gold-500/35",
    iconBg: "bg-gold-500",
    iconColor: "text-white",
    hoverBg: "hover:bg-gold-500/12",
    hoverBorder: "hover:border-gold-500/60",
  },
  cyan: {
    bg: "bg-cyan-500/[0.07]",
    border: "border-cyan-500/35",
    iconBg: "bg-cyan-500",
    iconColor: "text-white",
    hoverBg: "hover:bg-cyan-500/12",
    hoverBorder: "hover:border-cyan-500/60",
  },
  red: {
    bg: "bg-red-500/[0.07]",
    border: "border-red-500/35",
    iconBg: "bg-red-500",
    iconColor: "text-white",
    hoverBg: "hover:bg-red-500/12",
    hoverBorder: "hover:border-red-500/60",
  },
  sky: {
    bg: "bg-sky-500/[0.07]",
    border: "border-sky-500/35",
    iconBg: "bg-sky-500",
    iconColor: "text-white",
    hoverBg: "hover:bg-sky-500/12",
    hoverBorder: "hover:border-sky-500/60",
  },
  violet: {
    bg: "bg-violet-500/[0.07]",
    border: "border-violet-500/35",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
    hoverBg: "hover:bg-violet-500/12",
    hoverBorder: "hover:border-violet-500/60",
  },
  amber: {
    bg: "bg-amber-500/[0.07]",
    border: "border-amber-500/35",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
    hoverBg: "hover:bg-amber-500/12",
    hoverBorder: "hover:border-amber-500/60",
  },
};

const defaultStyles = {
  bg: "bg-surface/60",
  border: "border-border/10",
  iconBg: "bg-canvas-muted",
  iconColor: "text-fg-soft",
  hoverBg: "hover:bg-canvas-muted/80",
  hoverBorder: "hover:border-brand-500/30",
};

/**
 * Fast lane — the single biggest UX complaint about long personal sites is
 * "where is the thing I came for" — this answers it in one screen, right
 * under the hero, before any storytelling begins.
 * Enhanced with distinct accent colors per destination for better visual hierarchy.
 */
export function QuickAccess() {
  const { t } = useLanguage();

  return (
    <Section className="py-12 sm:py-16 border-t border-border/5">
      <Container>
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight sm:text-xl text-fg">
                {t({ en: "What are you looking for?", bn: "আপনি কী খুঁজছেন?" })}
              </h2>
              <p className="mt-1 text-sm text-fg-soft">
                {t({
                  en: "Jump straight there — one tap, no scrolling required.",
                  bn: "সরাসরি চলে যান — এক ট্যাপেই, স্ক্রল করার দরকার নেই।",
                })}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-brand-500 uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" />
              {t({ en: "Instant navigation", bn: "তাৎক্ষণিক নেভিগেশন" })}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:gap-4">
          {destinations.map((d, i) => {
            const Icon = d.icon;
            const styles = d.accent && accentStyles[d.accent as AccentColor] ? accentStyles[d.accent as AccentColor] : defaultStyles;
            const isPrimary = (d as any).primary === true;

            return (
              <Reveal key={d.href} delay={i * 40} direction="scale">
                <a
                  href={d.href}
                  className={cn(
                    "group relative flex h-full flex-col gap-3 rounded-3xl border p-4 sm:p-5 transition-all duration-500 ease-premium",
                    "hover:-translate-y-1.5 hover:shadow-lift",
                    styles.bg,
                    styles.border,
                    styles.hoverBg,
                    styles.hoverBorder,
                    isPrimary && "ring-1 ring-inset ring-brand-500/20"
                  )}
                >
                  {/* Accent top bar */}
                  <span className={cn("absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r", isPrimary ? "from-brand-500 to-brand-400" : "from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity")} />

                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-all duration-500",
                        styles.iconBg,
                        styles.iconColor,
                        "group-hover:scale-110 group-hover:rotate-3"
                      )}
                    >
                      <Icon className="h-5.5 w-5.5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-fg-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-500 opacity-0 group-hover:opacity-100" />
                  </div>

                  <div className="mt-auto flex flex-col gap-1.5">
                    <span className="block text-sm font-bold leading-snug text-fg">
                      {t({ en: d.en, bn: d.bn })}
                    </span>
                    <span className="block text-[11px] leading-relaxed text-fg-muted">
                      {t({ en: d.descEn, bn: d.descBn })}
                    </span>
                  </div>

                  {/* Primary badge */}
                  {isPrimary && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-brand-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-glow">
                      {t({ en: "Primary", bn: "প্রধান" })}
                    </span>
                  )}
                </a>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}