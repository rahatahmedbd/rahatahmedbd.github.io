"use client";

import { BadgeCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Container, Reveal } from "@/components/ui/primitives";
import { shantichakraGroup, helpingHandPost } from "@/lib/site";
import { cn } from "@/lib/utils";

interface Organization {
  emoji: string;
  name: { bn: string; en: string };
  role: { bn: string; en: string };
  href?: string;
  verified?: boolean;
}

/**
 * Every organization is one Rahat genuinely founded, serves in, or is a
 * member of — nothing invented, nothing borrowed. Verified badges only mark
 * roles that are publicly documented (Facebook group / post / cadet number).
 */
const organizations: Organization[] = [
  {
    emoji: "🩸",
    name: { bn: "শান্তিচক্র ব্লাড সোসাইটি", en: "Shantichakra Blood Society" },
    role: { bn: "সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক", en: "Co-Founder & General Secretary" },
    href: shantichakraGroup,
    verified: true,
  },
  {
    emoji: "🤝",
    name: { bn: "হেল্পিং হ্যান্ড অর্গানাইজেশন", en: "Helping Hand Organization" },
    role: { bn: "প্রতিষ্ঠাতা", en: "Founder" },
    href: helpingHandPost,
    verified: true,
  },
  {
    emoji: "🏫",
    name: { bn: "FS কোচিং সেন্টার", en: "FS Coaching Center" },
    role: { bn: "প্রতিষ্ঠাতা ও পরিচালক", en: "Founder & Director" },
  },
  {
    emoji: "🎖️",
    name: { bn: "বিএনসিসি", en: "BNCC" },
    role: { bn: "ক্যাডেট — ২৫০৭১১৫২", en: "Cadet — 25071152" },
    verified: true,
  },
  {
    emoji: "🎓",
    name: { bn: "সুনামগঞ্জ সরকারি কলেজ", en: "Sunamganj Govt. College" },
    role: { bn: "HSC ২য় বর্ষ — বিজ্ঞান", en: "HSC 2nd Year — Science" },
  },
  {
    emoji: "🏅",
    name: { bn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়", en: "Satgaon Jibdara High School" },
    role: { bn: "SSC ২০২৫ — GPA ৫.০০", en: "SSC 2025 — GPA 5.00" },
    verified: true,
  },
];

function OrgPill({ org }: { org: Organization }) {
  const { t } = useLanguage();
  const inner = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas-muted text-lg">
        {org.emoji}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-fg">{t(org.name)}</span>
          {org.verified && (
            <BadgeCheck
              className="h-4 w-4 shrink-0 text-sky-500"
              aria-label={t({ en: "Verified", bn: "যাচাইকৃত" })}
            />
          )}
        </span>
        <span className="block truncate text-[11px] text-fg-muted">{t(org.role)}</span>
      </span>
    </>
  );

  const classes = cn(
    "flex w-[266px] shrink-0 items-center gap-3 rounded-2xl border border-border/10 bg-surface/70 px-4 py-3 backdrop-blur transition-all duration-300",
    org.href && "hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-soft"
  );

  return org.href ? (
    <a href={org.href} target="_blank" rel="noopener noreferrer" className={classes}>
      {inner}
    </a>
  ) : (
    <div className={classes}>{inner}</div>
  );
}

/**
 * Organization marquee — a continuous, pause-on-hover rail of the real
 * institutions behind the story. Duplicated once for a seamless loop.
 */
export function Organizations() {
  const { t } = useLanguage();
  const loop = [...organizations, ...organizations];

  return (
    <section className="border-y border-border/5 bg-canvas-subtle/50 py-12 sm:py-14">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-fg-muted">
            {t({
              en: "Founded, serving & studying at",
              bn: "প্রতিষ্ঠা, দায়িত্ব ও শিক্ষা",
            })}
          </p>
        </Reveal>
      </Container>

      <div
        className="group relative mt-7 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee-slow gap-4 pause-on-hover motion-reduce:animate-none">
          {loop.map((org, i) => (
            <OrgPill key={`${org.name.en}-${i}`} org={org} />
          ))}
        </div>
      </div>

      <Container>
        <p className="mt-7 text-center text-[11px] leading-relaxed text-fg-muted">
          {t({
            en: "Only roles that are real and publicly documented are shown — no invented partners, no borrowed logos.",
            bn: "শুধুমাত্র প্রকৃত ও প্রকাশ্যে যাচাইযোগ্য ভূমিকাগুলোই দেখানো হয়েছে — কোনো কাল্পনিক অংশীদার বা ধার করা লোগো নেই।",
          })}
        </p>
      </Container>
    </section>
  );
}
