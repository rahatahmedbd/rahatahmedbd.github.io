"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Building2, Globe } from "lucide-react";

import { ParticleBackground } from "@/components/welcome/particle-background";
import { usePlatform } from "@/state/platform-context";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type PortalKind = "website" | "verse";

interface PortalConfig {
  kind: PortalKind;
  href: string;
  experience: "website" | "rahatverse";
  icon: typeof Globe;
  title: string;
  description: string;
  cta: string;
  /** Portal identity — calm vs vivid glow, both inside the brand family. */
  glowClass: string;
  ringClass: string;
  iconClass: string;
}

const PORTALS: readonly PortalConfig[] = [
  {
    kind: "website",
    href: "/portfolio",
    experience: "website",
    icon: Globe,
    title: "Website Experience",
    description:
      "Browse my portfolio in a clean, modern, and premium way. Perfect for quick exploration and website orders.",
    cta: "Enter Website Experience",
    glowClass:
      "bg-[radial-gradient(ellipse_at_center,rgba(122,12,46,0.55),rgba(122,12,46,0.16)_45%,transparent_72%)]",
    ringClass:
      "group-hover:border-[rgba(201,162,39,0.45)] group-hover:shadow-[0_0_60px_-12px_rgba(122,12,46,0.75)]",
    iconClass: "bg-[rgba(122,12,46,0.28)] text-[#f4c7d4] group-hover:text-white",
  },
  {
    kind: "verse",
    href: "/rahatverse",
    experience: "rahatverse",
    icon: Building2,
    title: "RahatVerse",
    description:
      "Explore my portfolio inside an immersive 3D city experience. Every location tells a different part of my story.",
    cta: "Enter RahatVerse",
    glowClass:
      "bg-[radial-gradient(ellipse_at_center,rgba(194,38,122,0.5),rgba(124,58,237,0.22)_48%,transparent_74%)]",
    ringClass:
      "group-hover:border-[rgba(194,38,122,0.55)] group-hover:shadow-[0_0_70px_-10px_rgba(194,38,122,0.8)]",
    iconClass: "bg-[rgba(194,38,122,0.3)] text-[#f9d5e8] group-hover:text-white",
  },
];

/* ---------------- Animation variants ---------------- */

const headlineWords: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const wordReveal: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const subtitleReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.55, ease: EASE } },
};

const portalContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.75 } },
};

const portalReveal: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: EASE } },
};

const footerReveal: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, delay: 1.35 } },
};

function WordReveal({ words, className }: { words: string[]; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className={className}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      variants={headlineWords}
    >
      {words.map((word, index) => (
        <motion.span key={index} className="inline-block whitespace-pre" variants={wordReveal}>
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function WelcomeExperience() {
  const router = useRouter();
  const { setExperience } = usePlatform();
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState<PortalConfig | null>(null);

  // Warm the destinations so the post-transition navigation is instant.
  useEffect(() => {
    router.prefetch("/portfolio");
    router.prefetch("/rahatverse");
  }, [router]);

  const handleSelect = (event: React.MouseEvent<HTMLAnchorElement>, portal: PortalConfig) => {
    if (reduceMotion) return; // native navigation, no transition overlay
    event.preventDefault();
    setLeaving(portal);
  };

  // The overlay finishes its fade-through-light, then we navigate.
  const handleOverlayComplete = () => {
    if (!leaving) return;
    setExperience(leaving.experience);
    router.push(leaving.href);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07070d] text-white">
      {/* Deep-space atmosphere */}
      <ParticleBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-18%,rgba(122,12,46,0.32),transparent_62%)]"
      />

      {/* Content — offset for new fixed PremiumTopbar (Phase 2) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-5 pt-20 pb-16 text-center sm:px-8 md:pt-24 md:pb-20">
        {/* Headline */}
        <div className="mb-5">
          <motion.p
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={subtitleReveal}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/60"
          >
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#c9a227]"
            />
            Rahat Ahmed
          </motion.p>

          <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl md:text-7xl">
            <WordReveal words={["Welcome", "to"]} className="block" />
            <WordReveal words={["Rahat's", "World"]} className="block" />
          </h1>

          <motion.p
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={subtitleReveal}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/65 sm:text-xl"
          >
            Choose how you&apos;d like to explore my portfolio
          </motion.p>
        </div>

        {/* The two portals */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={portalContainer}
          className="mt-12 grid w-full max-w-4xl gap-6 sm:gap-8 md:grid-cols-2"
        >
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            const isSelected = leaving?.kind === portal.kind;
            return (
              <motion.div
                key={portal.kind}
                variants={portalReveal}
                animate={isSelected ? { scale: 1.09, y: -6 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeIn" }}
                className="h-full"
              >
                <Link
                  href={portal.href}
                  onClick={(event) => handleSelect(event, portal)}
                  aria-label={portal.cta}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-7 text-left backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070d] sm:p-9 ${portal.ringClass}`}
                >
                  {/* Idle breathing glow + hover intensification */}
                  <motion.div
                    aria-hidden="true"
                    animate={
                      reduceMotion
                        ? { opacity: 0.75 }
                        : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 5.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: portal.kind === "verse" ? 0.8 : 0,
                          }
                    }
                    className={`pointer-events-none absolute -inset-10 ${portal.glowClass} opacity-75 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Portal top: icon + accent */}
                  <div className="relative mb-8 flex items-start justify-between">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 transition-colors duration-300 ${portal.iconClass}`}
                    >
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 h-2 w-2 rounded-full bg-[#c9a227]/70 shadow-[0_0_12px_rgba(201,162,39,0.8)]"
                    />
                  </div>

                  {/* Copy */}
                  <h2 className="relative text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">
                    {portal.title}
                  </h2>
                  <p className="relative mt-3 max-w-md text-base leading-relaxed text-white/65">
                    {portal.description}
                  </p>

                  {/* CTA */}
                  <div className="relative mt-auto pt-8">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/90 transition-colors duration-300 group-hover:border-white/30 group-hover:bg-white/10">
                      {portal.cta}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={footerReveal}
          className="mt-14 text-sm text-white/40"
        >
          Both experiences showcase the same information in different ways.
        </motion.p>
      </div>

      {/* Selection transition — fade through light, then navigate */}
      {leaving ? (
        <motion.div
          key="portal-transition"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.42, ease: "easeIn" }}
          onAnimationComplete={handleOverlayComplete}
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(255,248,240,0.96), rgba(201,162,39,0.35) 34%, rgba(122,12,46,0.55) 62%, #07070d 100%)",
          }}
        />
      ) : null}
    </div>
  );
}
