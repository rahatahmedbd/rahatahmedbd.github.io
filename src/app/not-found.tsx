"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  Landmark,
  Mail,
  Rocket,
  ShoppingBag,
  User,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const suggestions = [
  {
    href: "/order",
    icon: ShoppingBag,
    en: "Order a website",
    bn: "ওয়েবসাইট অর্ডার",
    descEn: "Packages, pricing & instant estimate",
    descBn: "প্যাকেজ, মূল্য ও তাৎক্ষণিক এস্টিমেট",
  },
  {
    href: "/#about",
    icon: User,
    en: "About Rahat",
    bn: "রাহাত সম্পর্কে",
    descEn: "Story, achievements and roles",
    descBn: "গল্প, অর্জন ও ভূমিকা",
  },
  {
    href: "/#contact",
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
] as const;

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.3] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/10 blur-[120px]" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 text-center">
        <Reveal direction="scale">
          <div className="relative mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
            <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: "12s" }} />
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-brand-600/15 blur-lg" />
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mb-2 text-display-md font-bold tracking-tight">
            <span className="text-gradient">
              {t({ bn: "পাতাটি খুঁজে পাওয়া যায়নি", en: "Page Not Found" })}
            </span>
          </h1>
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-brand-500">
            {t({ bn: "ত্রুটি ৪০৪", en: "Error 404" })}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <p className="mb-9 text-pretty text-sm leading-relaxed text-fg-soft">
            {t({
              bn: "আপনি যে পাতাটি খুঁজছেন তা সম্ভবত সরানো হয়েছে বা নাম পরিবর্তন করা হয়েছে। নিচের যেকোনো জায়গা থেকে শুরু করতে পারেন।",
              en: "The page you are looking for may have moved or been renamed. Here is where most visitors go next.",
            })}
          </p>
        </Reveal>

        {/* Suggestions */}
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {suggestions.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.href} delay={180 + i * 50} direction="up">
                <a
                  href={item.href}
                  className="press group flex h-full items-center gap-3 rounded-3xl border border-border/10 bg-surface/60 p-4 text-left transition-all duration-400 ease-premium hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-canvas-muted text-fg-soft transition-colors group-hover:bg-brand-500/12 group-hover:text-brand-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-fg">
                      {t(item)}
                    </span>
                    <span className="block truncate text-[11px] text-fg-muted">
                      {t({ en: item.descEn, bn: item.descBn })}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-fg-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={440}>
          <Button href="/" variant="secondary" className="mt-8">
            <ArrowLeft className="h-4 w-4" />
            {t({ bn: "হোমে ফিরে যান", en: "Back to Homepage" })}
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
