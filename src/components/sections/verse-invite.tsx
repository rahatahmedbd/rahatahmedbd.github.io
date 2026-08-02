"use client";

import { ArrowRight, Building2, Car, Landmark, Layers, Rocket } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ExperienceSwitch } from "@/components/experience/experience-switch";

/**
 * The second door, offered as an equal — not a gimmick and not a detour.
 * Everything on this page also exists inside RahatVerse, fully functional.
 */
export function VerseInvite() {
  const { t } = useLanguage();

  const districts = [
    { en: "Agency Headquarters", bn: "এজেন্সি সদরদপ্তর", maps: { en: "About & mission", bn: "পরিচয় ও লক্ষ্য" } },
    { en: "Website Store", bn: "ওয়েবসাইট স্টোর", maps: { en: "Packages & ordering", bn: "প্যাকেজ ও অর্ডার" } },
    { en: "Portfolio Museum", bn: "পোর্টফোলিও জাদুঘর", maps: { en: "Work & experience", bn: "কাজ ও অভিজ্ঞতা" } },
    { en: "Blood Donation Center", bn: "রক্তদান কেন্দ্র", maps: { en: "Shantichakra society", bn: "শান্তিচক্র সোসাইটি" } },
  ];

  return (
    <Section id="rahatverse" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-border/12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-7 text-white shadow-lift sm:p-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/25 blur-[120px]" />
              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-cyan-400/15 blur-[120px]" />
              <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                  <Layers className="h-3.5 w-3.5 text-brand-400" />
                  {t({ en: "Same content · Other experience", bn: "একই তথ্য · অন্য অভিজ্ঞতা" })}
                </span>

                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  {t({
                    en: "Everything on this page — inside a 3D city",
                    bn: "এই পেজের সবকিছু — একটি থ্রিডি শহরের ভেতরে",
                  })}
                </h2>

                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
                  {t({
                    en: "Enter through the gate, board a self-driving pod and let it take you district by district. You can read about me, browse the portfolio, compare packages, order a website and contact me — all without leaving the city.",
                    bn: "গেট দিয়ে প্রবেশ করুন, স্বয়ংচালিত ভেহিকেলে বসুন — সেটি নিজেই আপনাকে এক এক করে সব জায়গা ঘুরিয়ে দেখাবে। পরিচয় পড়া, পোর্টফোলিও দেখা, প্যাকেজ তুলনা, ওয়েবসাইট অর্ডার ও যোগাযোগ — সবই শহরের ভেতর থেকেই করা যাবে।",
                  })}
                </p>

                <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <ExperienceSwitch
                    to="verse"
                    variant="solid"
                    className="h-12 justify-center px-7 text-sm"
                    label={t({ en: "Enter RahatVerse", bn: "রাহাতভার্সে প্রবেশ করুন" })}
                  />
                  <Button href="/museum" variant="ghost" size="lg" className="border border-white/20 text-white hover:bg-white/10 hover:text-white">
                    <Landmark className="h-4 w-4" />
                    {t({ en: "Portfolio Museum", bn: "পোর্টফোলিও জাদুঘর" })}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-white/40">
                  <span className="inline-flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5" />
                    {t({ en: "Auto-driving — nothing to learn", bn: "নিজে চালাতে হবে না" })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {t({ en: "Loads separately — this page stays fast", bn: "আলাদা লোড হয় — এই পেজ ধীর হয় না" })}
                  </span>
                </p>
              </div>

              {/* District ↔ section mapping */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  <Rocket className="h-3.5 w-3.5 text-brand-400" />
                  {t({ en: "How it maps", bn: "কোনটা কোথায়" })}
                </div>
                <ul className="mt-4 flex flex-col gap-3">
                  {districts.map((d) => (
                    <li key={d.en} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <span className="text-[13px] font-semibold text-white/85">{t(d)}</span>
                      <span className="shrink-0 text-[11px] text-white/45">{t(d.maps)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11px] leading-relaxed text-white/35">
                  {t({
                    en: "…and more. Same database, same order system, same contact inbox.",
                    bn: "…এবং আরও। একই ডাটাবেস, একই অর্ডার সিস্টেম, একই ইনবক্স।",
                  })}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
