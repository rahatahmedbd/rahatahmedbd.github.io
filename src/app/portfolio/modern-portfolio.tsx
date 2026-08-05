"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Bird,
  Brain,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Droplet,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Home,
  Images,
  Mail,
  Medal,
  Ribbon,
  Rocket,
  School,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wrench,
  X,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import {
  achievementItems,
  bloodDonation,
  educationItems,
  galleryItems,
  initiatives,
  portfolioProfile,
  portfolioServices,
  skills,
  socialLinks,
} from "@/data/platform";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

/**
 * Profile image source.
 * Points to the local placeholder for now. Will be swapped to a Cloudinary URL
 * once the final profile photo is uploaded (no structural changes needed —
 * just update this constant).
 */
const PROFILE_IMAGE_SRC = "/assets/images/profile.jpg";
const PROFILE_IMAGE_ALT = `${portfolioProfile.name} — ${portfolioProfile.roles}`;

/* ------------------------------------------------------------------ */
/* "Why Work With Me" value propositions                               */
/* PLACEHOLDER CONTENT (Phase 20) — the user will provide the final    */
/* copy separately; replace title/text below when it arrives.          */
/* ------------------------------------------------------------------ */
const trustPoints = [
  {
    icon: Rocket,
    title: "Fast Delivery",
    text: "Clean, modern websites built and delivered quickly without cutting corners.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable & Honest",
    text: "Clear communication, transparent pricing, and results delivered on time.",
  },
  {
    icon: HeartHandshake,
    title: "Support After Launch",
    text: "I stay available after your site goes live for fixes, updates, and advice.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Navigation model used by both the sticky navbar and the scrollspy  */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ */
/* Mobile bottom navigation (Phase 26) — 5 tabs, mobile/tablet only.  */
/* "Portfolio" maps to #experience (the Portfolio Hub section, same   */
/* route the RahatVerse districts use for the portfolio).             */
/* ------------------------------------------------------------------ */
const BOTTOM_NAV_TABS = [
  { id: "top", label: "Home", icon: Home },
  { id: "experience", label: "Portfolio", icon: Briefcase },
  { id: "services", label: "Services", icon: Wrench },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "contact", label: "Contact", icon: Mail },
] as const;

/* ------------------------------------------------------------------ */
/* Emoji -> lucide icon map (Phase 28).                                */
/* The data layer keeps its existing icon strings (content unchanged); */
/* at render time they are replaced with SVG icons where mapped.       */
/* ------------------------------------------------------------------ */
const CARD_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "🏆": Trophy,
  "🥇": Medal,
  "🧠": Brain,
  "🎖️": Award,
  "🩸": Droplet,
  "🏫": School,
  "🤝": Handshake,
  "🎗️": Ribbon,
  "🕊️": Bird,
};

/* ------------------------------------------------------------------ */
/* Motion variants for hero entrance animations                       */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const statFloatVariants = (delay: number) =>
  ({
    hidden: { opacity: 0, y: 24, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  }) as const;

/** Shared easing curve used by the section reveal animations. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * SectionReveal — subtle fade + slight slide-up when a section enters the
 * viewport. Fires once per section. Uses transform/opacity only, so it
 * cannot cause layout shift (CLS). Respects prefers-reduced-motion by
 * fading without sliding.
 */
function SectionReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Modern Premium Portfolio Redesign - Phase 04
export default function ModernPortfolio() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("top");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Swipe-to-navigate: records the touch start position for the lightbox.
  const lightboxTouchStart = useRef<{ x: number; y: number } | null>(null);

  const goToPreviousImage = () => {
    setLightboxIndex((current) =>
      current === null ? current : (current - 1 + galleryItems.length) % galleryItems.length,
    );
  };

  const goToNextImage = () => {
    setLightboxIndex((current) =>
      current === null ? current : (current + 1) % galleryItems.length,
    );
  };

  const handleTabSelect = (tabId: string) => {
    if (tabId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(tabId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scrollspy (Phase 28 fine-tune): one rAF-throttled pass keeps the top
  // bar and bottom nav active states perfectly in sync.
  // - Top bar: the last nav section whose top has crossed ~30% of the
  //   viewport (the reading line just below the sticky bar) is active.
  // - Bottom nav: the tab whose section center is closest to the viewport
  //   center wins — boundaries flip precisely at the halfway point and
  //   never flicker; if no tab section is on screen the last tab stays.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      const height = window.innerHeight;

      // Top bar scrollspy.
      const probe = y + height * 0.3;
      let current = "";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top + y <= probe) {
          current = item.id;
        }
      }
      setActiveSection(current);

      // Bottom nav scrollspy — closest section center to viewport center.
      const center = y + height * 0.5;
      let bestTab: string | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const tab of BOTTOM_NAV_TABS) {
        const el = document.getElementById(tab.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + y;
        const bottom = top + el.offsetHeight;
        if (bottom < y || top > y + height) continue; // off-screen
        const distance = Math.abs((top + bottom) / 2 - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestTab = tab.id;
        }
      }
      if (bestTab) setActiveTab(bestTab);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Lightbox: Escape closes, ArrowLeft/ArrowRight navigate; lock body scroll
  // while the modal is open so the page behind can't scroll.
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      } else if (e.key === "ArrowLeft") {
        goToPreviousImage();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 text-[var(--color-text-primary)] lg:pb-0">
      {/* Top Bar — slim on mobile (logo + badge), full nav on desktop.
          Transparent at top, glassmorphism on scroll. Safe-area aware. */}
      <nav
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
          scrolled
            ? "border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_80%,transparent)] shadow-[var(--shadow-sm)] backdrop-blur-xl"
            : "border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <Container>
          <div className="flex h-14 items-center justify-between md:h-20">
            {/* Compact identity */}
            <div className="flex min-w-0 items-center gap-2 md:gap-3">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[var(--color-brand-primary)] text-white font-bold text-sm md:h-10 md:w-10 md:rounded-xl md:text-xl">
                RA
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-base leading-tight md:text-xl">
                  Rahat Ahmed
                </div>
                <div className="-mt-0.5 hidden text-xs text-[var(--color-text-secondary)] sm:block">
                  Portfolio
                </div>
              </div>

              {/* Highlight badge — real info: the website order flow is live */}
              <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] px-2 py-1 text-[10px] font-medium text-[var(--color-success-dark)] md:ml-2 md:px-2.5 md:text-xs">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                </span>
                Now Taking Orders
              </span>
            </div>

            {/* Desktop horizontal nav */}
            <div className="hidden items-center gap-8 text-sm font-medium md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative transition-colors ${
                      isActive
                        ? "text-[var(--color-brand-primary)] font-semibold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-[var(--color-brand-primary)]"
                        : "hover:text-[var(--color-brand-primary)]"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="flex flex-none items-center gap-1 sm:gap-4">
              <Link href="/" aria-label="Back to Welcome">
                <Button variant="ghost" size="sm" className="px-2 sm:px-4">
                  <span className="md:hidden" aria-hidden="true">
                    ←
                  </span>
                  <span className="hidden md:inline">← Back to Welcome</span>
                </Button>
              </Link>
              {/* Redundant on mobile — Contact lives in the bottom nav */}
              <a href="#contact" className="hidden sm:inline">
                <Button size="sm" className="px-3 sm:px-4">
                  Get in Touch
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </nav>

      {/* HERO SECTION — Redesigned Phase 27: cinematic split layout */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-[var(--color-border)] pt-20 pb-20 md:pt-28 md:pb-28"
      >
        {/* Decorative background — cinematic atmosphere (phase-25 style) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,12,46,0.1),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(26,60,90,0.08),transparent_50%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:4px_4px] opacity-20"
        />

        <Container className="relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
          >
            {/* ---------------- LEFT: TEXT CONTENT ---------------- */}
            <div className="text-center lg:text-left">
              <motion.div variants={fadeUp} className="mb-6 flex justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-brand-primary)_15%,transparent)] bg-[color-mix(in_srgb,var(--color-brand-primary)_8%,transparent)] px-3 py-1.5 text-sm font-medium text-[var(--color-brand-primary)]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {portfolioProfile.roles}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-6xl md:text-7xl"
              >
                {portfolioProfile.name}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl md:text-2xl lg:mx-0"
              >
                {portfolioProfile.headline}
              </motion.p>

              {/* Primary CTAs */}
              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link href="/order" className="sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full px-8 text-base transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.03] hover:shadow-[var(--shadow-xl)] sm:text-lg"
                  >
                    Order a Website
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <a href="#achievements" className="sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full px-8 text-base transition-[transform,box-shadow] duration-200 ease-out hover:scale-[1.03] hover:shadow-[var(--shadow-lg)] sm:text-lg"
                  >
                    <Trophy className="h-5 w-5" aria-hidden="true" />
                    View Achievements
                  </Button>
                </a>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-7 text-sm text-[var(--color-text-tertiary)]"
              >
                Scroll to explore my journey ↓
              </motion.p>
            </div>

            {/* ---------------- RIGHT: PROFILE IMAGE + FLOATING BADGES ---------------- */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Cinematic glow — breathing burgundy aura + warm accent layer */}
              <motion.div
                aria-hidden="true"
                animate={
                  reduceMotion
                    ? { opacity: 0.8 }
                    : { opacity: [0.55, 0.95, 0.55], scale: [1, 1.045, 1] }
                }
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-5 rounded-[2.25rem] bg-[radial-gradient(ellipse_at_35%_30%,color-mix(in_srgb,var(--color-brand-primary)_38%,transparent),transparent_62%),radial-gradient(ellipse_at_70%_75%,color-mix(in_srgb,var(--color-brand-accent)_22%,transparent),transparent_58%)] blur-2xl"
              />

              {/* Image container with gradient border */}
              <motion.div
                variants={fadeUp}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[var(--color-brand-primary)] via-[var(--color-brand-primary-light)] to-[var(--color-brand-secondary)] p-[2px] shadow-[var(--shadow-2xl)]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] bg-[var(--color-bg-secondary)]">
                  {/* Placeholder slot — swap PROFILE_IMAGE_SRC constant above for Cloudinary URL */}
                  <Image
                    src={PROFILE_IMAGE_SRC}
                    alt={PROFILE_IMAGE_ALT}
                    fill
                    sizes="(max-width: 1023px) 90vw, 420px"
                    priority
                    className="object-cover"
                  />
                  {/* Subtle overlay for premium feel */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                  />
                </div>
              </motion.div>

              {/* ---------- Floating stat cards ---------- */}

              {/* Card 1: Education — top-left on desktop, top on mobile */}
              <motion.div
                variants={statFloatVariants(0.55)}
                className="absolute -left-2 top-6 w-60 sm:-left-6 sm:w-64"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_95%,transparent)] p-3 shadow-[var(--shadow-lg)] backdrop-blur-md">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      Education
                    </div>
                    <div className="text-sm font-semibold leading-snug text-[var(--color-text-primary)]">
                      {portfolioProfile.currentEducation}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Blood Donor — middle-right */}
              <motion.div
                variants={statFloatVariants(0.7)}
                className="absolute -right-2 top-[38%] w-48 sm:-right-6 sm:w-56"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_95%,transparent)] p-3 shadow-[var(--shadow-lg)] backdrop-blur-md">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Droplet className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      Blood Donor
                    </div>
                    <div className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                      {portfolioProfile.bloodGroup} • {portfolioProfile.bloodDonations}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: BNCC Cadet — bottom-left */}
              <motion.div
                variants={statFloatVariants(0.85)}
                className="absolute -bottom-4 left-4 w-44 sm:-bottom-6 sm:left-6 sm:w-52"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_95%,transparent)] p-3 shadow-[var(--shadow-lg)] backdrop-blur-md">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Shield className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      Cadet
                    </div>
                    <div className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                      BNCC Cadet
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 border-b border-[var(--color-border)]">
        <Container>
          <SectionReveal>
            <SectionTitle
              title="About Me"
              subtitle="From a village in Sunamganj to building meaningful impact through education, service & technology"
              align="center"
            />

            <div className="max-w-3xl mx-auto text-center">
              <div className="prose prose-lg text-[var(--color-text-secondary)]">
                <p>{portfolioProfile.summary}</p>
                <p>
                  Currently an HSC 2nd Year Science student at Sunamganj Government College, I am
                  also a home tutor, Co-Founder &amp; General Secretary of Shantichakra Blood
                  Society, Founder of FS Coaching Center, and an active BNCC Cadet.
                </p>
                <p>
                  I am passionate about web development, AI, content creation, and community service
                  — with a mission to create positive change through education and technology.
                </p>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* EDUCATION SECTION */}
      <section
        id="education"
        className="py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]"
      >
        <Container>
          <SectionReveal>
            <SectionTitle
              title="Education Journey"
              subtitle="A continuous path of academic excellence from primary school to HSC"
              align="center"
            />

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {educationItems.map((edu) => (
                  <Card key={edu.title} variant="bordered" className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="md:w-48 text-sm font-mono text-[var(--color-text-tertiary)]">
                        {edu.year}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-xl">{edu.title}</div>
                        <div className="text-[var(--color-text-secondary)]">{edu.institution}</div>
                        <div className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                          {edu.desc}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-20 border-b border-[var(--color-border)]">
        <Container>
          <SectionReveal>
            <SectionTitle
              title="Achievements"
              subtitle="Recognition in academics, science fairs, and community service"
              align="center"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {achievementItems.map((item) => {
                const CardIcon = CARD_ICON_MAP[item.icon];
                return (
                  <Card
                    key={item.title}
                    variant="elevated"
                    className="border border-transparent p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--color-brand-primary)_25%,transparent)] hover:shadow-[var(--shadow-xl)]"
                  >
                    {CardIcon ? (
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-brand-primary)_10%,transparent)] text-[var(--color-brand-primary)]">
                        <CardIcon className="h-6 w-6" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="mb-4 text-4xl">{item.icon}</div>
                    )}
                    <div className="font-semibold text-xl mb-1">{item.title}</div>
                    <div className="text-sm text-[var(--color-brand-primary)] font-medium mb-3">
                      {item.year}
                    </div>
                    <div className="text-[var(--color-text-secondary)] text-sm">{item.desc}</div>
                  </Card>
                );
              })}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* SERVICES SECTION — NEW DESIGN AS PER REQUIREMENTS */}
      <section
        id="services"
        className="py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]"
      >
        <Container>
          <SectionReveal>
            <SectionTitle
              title="Website Development Services"
              subtitle="Choose the right service for your needs. Starting prices are beginner-friendly."
              align="center"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {portfolioServices.map((service) => (
                <Card
                  key={service.title}
                  variant="elevated"
                  className="group flex flex-col border border-transparent p-7 premium-hover focus-visible-ring hover:border-[color-mix(in_srgb,var(--color-brand-primary)_22%,transparent)] hover:shadow-[var(--shadow-xl)]"
                >
                  <div>
                    <div className="font-semibold text-2xl mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">
                      {service.title}
                    </div>
                    <div className="text-3xl font-semibold text-[var(--color-brand-primary)] mb-1">
                      {service.price}
                    </div>
                    <div className="text-sm text-[var(--color-text-tertiary)] mb-4">
                      Delivery: {service.time}
                    </div>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-auto pt-6">
                    <Link href="/order">
                      <Button variant="outline" className="w-full">
                        Choose This Service →
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10 text-sm text-[var(--color-text-tertiary)]">
              All websites are fully responsive, fast-loading, and SEO optimized.
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* WHY WORK WITH ME — PLACEHOLDER VALUE PROPOSITIONS (Phase 20).
          Content is temporary; the user will provide the final copy
          separately (see trustPoints in this file). */}
      <section id="why-me" className="py-20 border-b border-[var(--color-border)]">
        <Container>
          <SectionReveal>
            <SectionTitle
              title="Why Work With Me"
              subtitle="A quick look at what you can expect when we build together"
              align="center"
            />

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {trustPoints.map((point) => (
                <Card
                  key={point.title}
                  variant="elevated"
                  className="p-7 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--color-brand-primary)_25%,transparent)] hover:shadow-[var(--shadow-xl)] border border-transparent"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--color-brand-primary)_10%,transparent)] text-[var(--color-brand-primary)]">
                    <point.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {point.text}
                  </p>
                </Card>
              ))}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* EXPERIENCE & INITIATIVES */}
      <section id="experience" className="py-20 border-b border-[var(--color-border)]">
        <Container>
          <SectionReveal>
            <SectionTitle
              title="Experience & Initiatives"
              subtitle="Organizations I founded and roles I currently hold"
              align="center"
            />

            <div id="skills" className="mx-auto mb-10 max-w-5xl">
              <h3 className="mb-4 text-center text-xl font-semibold">Skills &amp; Focus</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {initiatives.map((initiative) => {
                const CardIcon = CARD_ICON_MAP[initiative.icon];
                return (
                  <Card
                    key={initiative.title}
                    variant="elevated"
                    className="border border-transparent p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--color-brand-primary)_25%,transparent)] hover:shadow-[var(--shadow-xl)]"
                  >
                    {CardIcon ? (
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-brand-secondary)_10%,transparent)] text-[var(--color-brand-secondary)]">
                        <CardIcon className="h-6 w-6" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="mb-4 text-4xl">{initiative.icon}</div>
                    )}
                    <div className="font-semibold text-2xl">{initiative.title}</div>
                    <div className="text-[var(--color-brand-primary)] font-medium">
                      {initiative.role}
                    </div>
                    <p className="mt-4 text-[var(--color-text-secondary)]">
                      {initiative.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* BLOOD DONATION & SHANTICHAKRA */}
      <section id="blood" className="py-20 bg-[var(--color-brand-primary)] text-white">
        <Container>
          <SectionReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-6">🩸</div>
              <h2 className="text-4xl font-semibold tracking-tight mb-4">{bloodDonation.title}</h2>
              <p className="text-xl opacity-90 mb-8">
                {bloodDonation.role} • {bloodDonation.location}
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="px-6 py-2 bg-white/10 rounded-full">{bloodDonation.donations}</div>
                <div className="px-6 py-2 bg-white/10 rounded-full">{bloodDonation.bloodGroup}</div>
                <div className="px-6 py-2 bg-white/10 rounded-full">{bloodDonation.founded}</div>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* GALLERY SECTION — click a card to open the lightbox */}
      <section
        id="gallery"
        className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-20"
      >
        <Container>
          <SectionReveal>
            <SectionTitle
              title="Gallery"
              subtitle="Some moments from academic achievements, community work, and initiatives"
              align="center"
            />

            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item, index) => {
                const CardIcon = CARD_ICON_MAP[item.icon];
                return (
                  <Card
                    key={item.title}
                    variant="elevated"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${item.title} in lightbox`}
                    onClick={() => setLightboxIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightboxIndex(index);
                      }
                    }}
                    className="cursor-pointer overflow-hidden p-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[var(--shadow-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      width={600}
                      height={400}
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="aspect-[3/2] w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-5">
                      {CardIcon ? (
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-brand-primary)_10%,transparent)] text-[var(--color-brand-primary)]">
                          <CardIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      ) : (
                        <div className="mb-1 text-2xl">{item.icon}</div>
                      )}
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">{item.meta}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* CONTACT SECTION — form (new) + existing direct channels */}
      <section id="contact" className="py-20">
        <Container>
          <SectionReveal>
            <SectionTitle
              title="Let’s Work Together"
              subtitle="Ready to start a project or just want to connect?"
              align="center"
            />

            <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Contact form — saves to Supabase via POST /api/contact */}
              <ContactForm />

              {/* Existing direct channels (unchanged) */}
              <div className="mx-auto w-full max-w-md text-center lg:mx-0 lg:max-w-none lg:text-left">
                <div className="space-y-4">
                  <a href={`mailto:${portfolioProfile.email}`}>
                    <Button size="lg" className="w-full">
                      Email Me
                    </Button>
                  </a>
                  <a href={portfolioProfile.whatsapp} target="_blank" rel="noopener">
                    <Button variant="outline" size="lg" className="w-full">
                      Message on WhatsApp
                    </Button>
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <p className="mt-5 text-sm text-[var(--color-text-tertiary)]">
                  Usually respond within 24 hours
                </p>
              </div>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-10 text-center text-sm text-[var(--color-text-tertiary)]">
        <Container>
          © {new Date().getFullYear()} {portfolioProfile.name} • Made with ❤️ in Sunamganj,
          Bangladesh
        </Container>
      </footer>

      {/* GALLERY LIGHTBOX */}
      {lightboxIndex !== null && galleryItems[lightboxIndex] ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={galleryItems[lightboxIndex].title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onTouchStart={(e) => {
            if (galleryItems.length > 1) {
              lightboxTouchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
              };
            }
          }}
          onTouchEnd={(e) => {
            const start = lightboxTouchStart.current;
            lightboxTouchStart.current = null;
            if (!start) return;
            const dx = e.changedTouches[0].clientX - start.x;
            const dy = e.changedTouches[0].clientY - start.y;
            // Horizontal swipe past 56px, clearly more horizontal than
            // vertical — otherwise treat it as a scroll/tap.
            if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
              if (dx < 0) goToNextImage();
              else goToPreviousImage();
            }
          }}
        >
          {/* Backdrop — click outside the image to close */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Previous / Next — shown because there is more than one image */}
          {galleryItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPreviousImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goToNextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Image + caption (clicks inside do not close the lightbox) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="relative z-[1] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl bg-black">
              <Image
                src={galleryItems[lightboxIndex].image}
                alt={galleryItems[lightboxIndex].alt}
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 95vw, 900px"
                className="max-h-[72vh] w-full object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  {(() => {
                    const CaptionIcon = CARD_ICON_MAP[galleryItems[lightboxIndex].icon];
                    return CaptionIcon ? (
                      <CaptionIcon
                        className="h-5 w-5 flex-none text-[#f4c7d4]"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">
                        {galleryItems[lightboxIndex].icon}
                      </span>
                    );
                  })()}
                  <span className="truncate">{galleryItems[lightboxIndex].title}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-white/70">
                  {galleryItems[lightboxIndex].meta}
                </p>
              </div>
              <div className="flex-none rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/80">
                {lightboxIndex + 1} / {galleryItems.length}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      {/* Bottom Navigation — mobile/tablet only (hidden md+), native-app feel */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:hidden"
      >
        <div className="grid h-16 grid-cols-5">
          {BOTTOM_NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabSelect(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className="group relative flex flex-col items-center justify-center gap-1 transition-colors duration-200"
              >
                {/* Active indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute top-0 h-0.5 w-8 rounded-full bg-[var(--color-brand-primary)] transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon
                  className={`h-5 w-5 transition-all duration-200 ${
                    isActive
                      ? "scale-110 text-[var(--color-brand-primary)]"
                      : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-brand-primary)]"
                      : "text-[var(--color-text-tertiary)]"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
