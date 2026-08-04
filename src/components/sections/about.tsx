"use client";

import Image from "next/image";
import { Quote, ArrowRight, MapPin, Award, Heart, GraduationCap, Code, Users, Shield, Zap, Star, BookOpen, Target } from "lucide-react";
import { about } from "@/content/about";
import { useLanguage } from "@/components/providers/language-provider";
import { Container, Reveal, Section, SectionHeading, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const journeyMilestones = [
  { year: "2006", en: "Born in Jibdara, Shantiganj", bn: "জীবদারা, শান্তিগঞ্জে জন্ম", icon: Star, color: "brand" },
  { year: "2021", en: "SSC GPA 5.00 (A+)", bn: "এসএসসি জিপিএ ৫.০০ (এ+)", icon: Award, color: "gold" },
  { year: "2022", en: "HSC Science at Sunamganj Govt. College", bn: "সুনামগঞ্জ গভ. কলেজে এইচএসসি বিজ্ঞান", icon: GraduationCap, color: "cyan" },
  { year: "2023", en: "Founded FS Coaching Center", bn: "এফএস কোচিং সেন্টার প্রতিষ্ঠা", icon: BookOpen, color: "violet" },
  { year: "2024", en: "Shantichakra Blood Society Gen. Secretary", bn: "শান্তিচক্র ব্লাড সোসাইটি জেন. সেক্রেটারি", icon: Heart, color: "red" },
  { year: "2024", en: "Started Web Development Journey", bn: "ওয়েব ডেভেলপমেন্ট যাত্রা শুরু", icon: Code, color: "emerald" },
  { year: "2025", en: "BNCC Cadet & Helping Hand Org Founder", bn: "বিএনসিসি ক্যাডেট ও হেল্পিং হ্যান্ড প্রতিষ্ঠাতা", icon: Users, color: "amber" },
  { year: "Now", en: "Building Premium Web Agency", bn: "প্রিমিয়াম ওয়েব এজেন্সি তৈরি করছি", icon: Target, color: "brand" },
];

const colorStyles: Record<string, { bg: string; text: string; border: string }> = {
  brand: { bg: "bg-brand-500/10", text: "text-brand-500", border: "border-brand-500/20" },
  gold: { bg: "bg-gold-500/10", text: "text-gold-500", border: "border-gold-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
};

export function About() {
  const { t } = useLanguage();

  return (
    <Section id="about" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-cyan-500/8 blur-[120px]" />
      </div>

      <Container>
        <SectionHeading
          eyebrow={t({ bn: "আমার পরিচয়", en: "About Me" })}
          title={t(about.title)}
          subtitle={t(about.subtitle)}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          {/* Left: Portrait + Quote */}
          <div className="flex flex-col gap-8">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-4xl border border-border/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.3)]">
                <Image
                  src="/images/profile.jpg"
                  alt="Rahat Ahmed at Sunamganj"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover transition-transform duration-1000 ease-premium hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 left-6 sm:left-10 flex flex-col gap-3">
                <div className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl",
                  "border-gold-500/30 bg-gradient-to-r from-gold-500/10 to-gold-500/5"
                )}>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/20">
                    <GraduationCap className="h-5 w-5 text-gold-500" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-fg">{t(about.badge.title)}</div>
                    <div className="text-xs text-fg-muted">{t(about.badge.sub)}</div>
                  </div>
                </div>

                <div className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl",
                  "border-brand-500/30 bg-gradient-to-r from-brand-500/10 to-brand-500/5"
                )}>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20">
                    <Heart className="h-5 w-5 text-brand-500" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-fg">{t({ en: "Blood Donor (A+)", bn: "রক্তদাতা (এ+)" })}</div>
                    <div className="text-xs text-fg-muted">{t({ en: "4× donations · Shantichakra", bn: "৪× রক্তদান · শান্তিচক্র" })}</div>
                  </div>
                </div>
              </div>
            </div>

            <figure className="relative overflow-hidden rounded-4xl border border-gold-500/25 bg-gradient-to-br from-gold-500/10 via-transparent to-amber-500/5 p-7 sm:p-10">
              <Quote className="absolute right-6 top-6 h-20 w-20 text-gold-500/10" />
              <blockquote className="relative">
                <p className="text-pretty text-lg sm:text-xl font-medium leading-relaxed text-fg">
                  “{t(about.quote)}”
                </p>
                <footer className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
                  <span className="font-semibold text-gold-500">— {t({ en: "Rahat Ahmed", bn: "রাহাত আহমেদ" })}</span>
                  <span className="px-2">·</span>
                  <span>{t({ en: "Founder, RahatVerse", bn: "প্রতিষ্ঠাতা, রাহাতভার্স" })}</span>
                </footer>
              </blockquote>
            </figure>
          </div>

          {/* Right: Story + Facts + CTA */}
          <div className="flex flex-col gap-8">
            <div className="space-y-5">
              {about.story.map((para, i) => (
                <Reveal key={i} delay={i * 80} direction="right">
                  <p className="text-pretty text-base leading-relaxed text-fg-soft">
                    {t(para)}
                  </p>
                </Reveal>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.facts.map((fact, fi) => {
                const factIcons: Record<string, React.ReactNode> = {
                  "📍": <MapPin className="h-5 w-5" />,
                  "🎓": <GraduationCap className="h-5 w-5" />,
                  "💼": <Code className="h-5 w-5" />,
                  "🩸": <Heart className="h-5 w-5" />,
                  "🏅": <Award className="h-5 w-5" />,
                  "🇧🇩": <Users className="h-5 w-5" />,
                };
                const Icon = factIcons[fact.icon] || <MapPin className="h-5 w-5" />;
                
                return (
                  <Reveal key={fact.label.en} delay={120 + fi * 40} direction="up">
                    <div className="group flex items-center gap-4 rounded-2xl border border-border/10 bg-surface/60 p-4 transition-all duration-500 hover:border-brand-500/30 hover:shadow-lift hover:-translate-y-1">
                      <span className={cn(
                        "shrink-0 grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                        "bg-brand-500/10 text-brand-500"
                      )}>
                        {Icon}
                      </span>
                      <div className="min-w-0 leading-tight">
                        <div className="text-[10px] uppercase tracking-wider text-fg-muted">
                          {t(fact.label)}
                        </div>
                        <div className="mt-0.5 truncate text-base font-semibold text-fg">
                          {t(fact.value)}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={200} direction="up">
              <a
                href="#education"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-400"
              >
                <span className="link-underline">{t(about.cta)}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>

        {/* Core Values */}
        <Reveal delay={250} direction="up">
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: Shield, title: { en: "Quality First", bn: "গুণমানকে প্রাধান্য" }, desc: { en: "Every line of code reviewed, every pixel perfected", bn: "প্রতিটি লাইন কোড রিভিউ, প্রতিটি পিক্সেল পারফেক্ট" }, color: "brand" },
              { icon: Zap, title: { en: "Speed & Performance", bn: "গতি ও পারফরম্যান্স" }, desc: { en: "Lighthouse 90+, optimized Core Web Vitals", bn: "লাইটহাউস ৯০+, অপটিমাইজড কোর ওয়েব ভাইটালস" }, color: "amber" },
              { icon: Heart, title: { en: "Social Impact", bn: "সামাজিক প্রভাব" }, desc: { en: "Blood donation, education, community empowerment", bn: "রক্তদান, শিক্ষা, সম্প্রদায় সশক্তিকরণ" }, color: "red" },
            ].map((val, vi) => {
              const Icon = val.icon;
              const styles = colorStyles[val.color] || colorStyles.brand;
              return (
                <Card key={vi} className="p-6 text-center group hover:border-brand-500/25 hover:shadow-lift">
                  <div className={cn("mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl", styles.bg, styles.text)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-fg mb-2">{t(val.title)}</h4>
                  <p className="text-sm text-fg-soft leading-relaxed">{t(val.desc)}</p>
                </Card>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
