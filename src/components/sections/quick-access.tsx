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
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Container, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const destinations = [
  {
    href: "/order",
    icon: ShoppingBag,
    en: "Order a website",
    bn: "ওয়েবসাইট অর্ডার",
    descEn: "Packages, pricing & instant estimate",
    descBn: "প্যাকেজ, মূল্য ও তাৎক্ষণিক এস্টিমেট",
    primary: true,
  },
  {
    href: "#about",
    icon: User,
    en: "About me",
    bn: "আমার পরিচয়",
    descEn: "Story, facts and mission",
    descBn: "গল্প, তথ্য ও লক্ষ্য",
  },
  {
    href: "#work",
    icon: Award,
    en: "Work & achievements",
    bn: "কাজ ও অর্জন",
    descEn: "Awards, experience and gallery",
    descBn: "পুরস্কার, অভিজ্ঞতা ও গ্যালারি",
  },
  {
    href: "#services",
    icon: GraduationCap,
    en: "Services & skills",
    bn: "সেবা ও দক্ষতা",
    descEn: "What I build and teach",
    descBn: "যা তৈরি করি ও শেখাই",
  },
  {
    href: "#trust",
    icon: Droplet,
    en: "Blood society",
    bn: "ব্লাড সোসাইটি",
    descEn: "Shantichakra & community work",
    descBn: "শান্তিচক্র ও সমাজসেবা",
  },
  {
    href: "#contact",
    icon: Mail,
    en: "Contact",
    bn: "যোগাযোগ",
    descEn: "Email, WhatsApp and FAQs",
    descBn: "ইমেইল, হোয়াটসঅ্যাপ ও প্রশ্নোত্তর",
  },
  {
    href: "/rahatverse",
    icon: Rocket,
    en: "RahatVerse (3D)",
    bn: "রাহাতভার্স (থ্রিডি)",
    descEn: "Same content, cinematic city tour",
    descBn: "একই তথ্য, সিনেমাটিক শহর ভ্রমণ",
  },
  {
    href: "/museum",
    icon: Landmark,
    en: "Portfolio museum",
    bn: "পোর্টফোলিও জাদুঘর",
    descEn: "Projects as an interactive exhibit",
    descBn: "প্রজেক্টের ইন্টারেক্টিভ প্রদর্শনী",
  },
];

/**
 * Fast lane. The single biggest UX complaint about long personal sites is
 * "where is the thing I came for" — this answers it in one screen, right
 * under the hero, before any storytelling begins.
 */
export function QuickAccess() {
  const { t } = useLanguage();

  return (
    <Section className="py-10 sm:py-14">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                {t({ en: "What are you looking for?", bn: "আপনি কী খুঁজছেন?" })}
              </h2>
              <p className="mt-1 text-sm text-fg-soft">
                {t({
                  en: "Jump straight there — one tap, no scrolling required.",
                  bn: "সরাসরি চলে যান — এক ট্যাপেই, স্ক্রল করার দরকার নেই।",
                })}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {destinations.map((d, i) => {
            const Icon = d.icon;
            return (
              <Reveal key={d.href} delay={i * 50} direction="scale">
                <a
                  href={d.href}
                  className={`group flex h-full flex-col gap-2.5 rounded-3xl border p-4 transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-lift sm:p-5 ${
                    d.primary
                      ? "border-brand-500/35 bg-brand-500/[0.07] hover:border-brand-500/60"
                      : "border-border/10 bg-surface/60 hover:border-brand-500/30"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-2xl transition-colors ${
                        d.primary
                          ? "bg-brand-600 text-white"
                          : "bg-canvas-muted text-fg-soft group-hover:bg-brand-500/12 group-hover:text-brand-600 dark:group-hover:text-brand-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-fg-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-500" />
                  </span>
                  <span className="mt-auto">
                    <span className="block text-sm font-semibold leading-snug">
                      {t({ en: d.en, bn: d.bn })}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-fg-muted">
                      {t({ en: d.descEn, bn: d.descBn })}
                    </span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
