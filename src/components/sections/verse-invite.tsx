"use client";

import { ArrowRight, Gamepad2, Landmark } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

/**
 * RahatVerse presented as an optional door, not a detour.
 * Visitors who only want a website are never pushed into the 3D experience.
 */
export function VerseInvite() {
  const { t } = useLanguage();

  return (
    <Section id="rahatverse" className="scroll-mt-20 py-16 sm:py-20">
      <Container size="narrow">
        <Reveal>
          <div className="rounded-3xl border border-border/15 bg-surface/60 p-7 text-center backdrop-blur sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-canvas-muted px-3.5 py-1 text-xs font-medium text-fg-muted">
              <Gamepad2 className="h-3.5 w-3.5" />
              {t({ en: "Optional", bn: "ঐচ্ছিক" })}
            </span>

            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {t({ en: "Curious? Explore RahatVerse", bn: "কৌতূহলী? রাহাতভার্স ঘুরে দেখুন" })}
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-fg-soft sm:text-base">
              {t({
                en: "A 3D digital city and an interactive portfolio museum — built entirely in the browser. It is a demonstration of what I can build, not something you need to see to hire me.",
                bn: "ব্রাউজারেই তৈরি একটি থ্রিডি ডিজিটাল শহর ও ইন্টারেক্টিভ পোর্টফোলিও মিউজিয়াম। এটি আমার সক্ষমতার প্রদর্শন — কাজ দিতে হলে এটি দেখা বাধ্যতামূলক নয়।",
              })}
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button href="/rahatverse" variant="secondary" size="md">
                <Gamepad2 className="h-4 w-4" />
                {t({ en: "Enter the City", bn: "শহরে প্রবেশ করুন" })}
              </Button>
              <Button href="/museum" variant="ghost" size="md">
                <Landmark className="h-4 w-4" />
                {t({ en: "Portfolio Museum", bn: "পোর্টফোলিও মিউজিয়াম" })}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <p className="mt-5 text-xs text-fg-muted">
              {t({
                en: "Best on desktop · Loads on demand, so it never slows this page down",
                bn: "ডেস্কটপে সবচেয়ে ভালো · আলাদা লোড হয়, এই পেজ ধীর করে না",
              })}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
