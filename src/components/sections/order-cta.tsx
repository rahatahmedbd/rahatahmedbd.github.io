"use client";

import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

const points = [
  { en: "Fixed price agreed before any work starts", bn: "কাজ শুরুর আগেই নির্দিষ্ট মূল্য" },
  { en: "First draft within 7 days", bn: "৭ দিনের মধ্যে প্রথম ড্রাফট" },
  { en: "Mobile-first, fast and SEO ready", bn: "মোবাইল-ফার্স্ট, দ্রুত ও এসইও-রেডি" },
];

/**
 * The single primary conversion block on the homepage. One action,
 * one low-friction alternative. Nothing else competes with it.
 */
export function OrderCta() {
  const { t } = useLanguage();

  return (
    <Section className="py-16 sm:py-20">
      <Container>
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-3xl border border-border/15 bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-white shadow-lift sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/20 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t({
                  en: "Ready for a website that actually works?",
                  bn: "আপনার ব্যবসার জন্য একটি কার্যকর ওয়েবসাইট চান?",
                })}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-white/85">
                {t({
                  en: "Answer a few short questions and get an instant price estimate and timeline. No calls required, no obligation.",
                  bn: "কয়েকটি সহজ প্রশ্নের উত্তর দিন — সঙ্গে সঙ্গেই মূল্য ও সময়ের ধারণা পাবেন। কোনো বাধ্যবাধকতা নেই।",
                })}
              </p>

              <ul className="mx-auto mt-7 flex max-w-lg flex-col items-start gap-2.5 text-left sm:items-center">
                {points.map((p) => (
                  <li key={p.en} className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                    <span>{t(p)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button href="/order" variant="light" size="lg">
                  {t({ en: "Start My Project", bn: "প্রজেক্ট শুরু করুন" })}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  size="lg"
                  className="border border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t({ en: "Ask a question first", bn: "প্রশ্ন করুন" })}
                </Button>
              </div>

              <p className="mt-5 text-xs text-white/70">
                {t({
                  en: "Takes about 2 minutes · Free estimate",
                  bn: "সময় লাগবে প্রায় ২ মিনিট · বিনামূল্যে এস্টিমেট",
                })}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
