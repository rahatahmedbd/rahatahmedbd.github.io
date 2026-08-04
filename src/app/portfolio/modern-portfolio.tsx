"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Droplet,
  GraduationCap,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";
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

// Modern Premium Portfolio Redesign - Phase 04
export default function ModernPortfolio() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Premium Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-lg">
        <Container>
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-primary)] text-white font-bold text-xl">
                RA
              </div>
              <div>
                <div className="font-semibold text-xl">Rahat Ahmed</div>
                <div className="text-xs text-[var(--color-text-secondary)] -mt-1">Portfolio</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a
                href="#about"
                className="hover:text-[var(--color-brand-primary)] transition-colors"
              >
                About
              </a>
              <a
                href="#education"
                className="hover:text-[var(--color-brand-primary)] transition-colors"
              >
                Education
              </a>
              <a
                href="#achievements"
                className="hover:text-[var(--color-brand-primary)] transition-colors"
              >
                Achievements
              </a>
              <a
                href="#experience"
                className="hover:text-[var(--color-brand-primary)] transition-colors"
              >
                Experience
              </a>
              <a
                href="#services"
                className="hover:text-[var(--color-brand-primary)] transition-colors"
              >
                Services
              </a>
              <a
                href="#contact"
                className="hover:text-[var(--color-brand-primary)] transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to Welcome
                </Button>
              </Link>
              <a href="#contact">
                <Button size="sm">Get in Touch</Button>
              </a>
            </div>
          </div>
        </Container>
      </nav>

      {/* HERO SECTION — Redesigned Phase 17: premium split layout */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(122,12,46,0.08),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(26,60,90,0.06),transparent_50%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:4px_4px] opacity-25"
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
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <motion.div variants={fadeUp} className="mb-6 flex justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-primary)]/15 bg-[var(--color-brand-primary)]/8 px-3 py-1.5 text-sm font-medium text-[var(--color-brand-primary)]">
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
                    className="w-full px-8 text-base transition-transform duration-200 ease-out hover:scale-[1.03] hover:shadow-[var(--shadow-xl)] sm:text-lg"
                  >
                    Order a Website
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <a href="#achievements" className="sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full px-8 text-base transition-transform duration-200 ease-out hover:scale-[1.03] hover:shadow-[var(--shadow-lg)] sm:text-lg"
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
            <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
              {/* Glow ring */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--color-brand-primary)]/30 via-[var(--color-brand-accent)]/20 to-[var(--color-brand-secondary)]/30 blur-2xl"
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
                className="absolute -left-2 top-6 w-44 sm:-left-6 sm:w-52"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                      Education
                    </div>
                    <div className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
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
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md">
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
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md">
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

              {/* Decorative mini badge — top-right corner of image */}
              <motion.div
                variants={statFloatVariants(1.0)}
                className="absolute -top-3 right-6 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-md)] backdrop-blur-md sm:right-10"
              >
                <Award className="h-3.5 w-3.5 text-[var(--color-brand-accent)]" aria-hidden="true" />
                Available for work
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 border-b border-[var(--color-border)]">
        <Container>
          <SectionTitle
            title="About Me"
            subtitle="From a village in Sunamganj to building meaningful impact through education, service & technology"
            align="center"
          />

          <div className="max-w-3xl mx-auto text-center">
            <div className="prose prose-lg text-[var(--color-text-secondary)]">
              <p>{portfolioProfile.summary}</p>
              <p>
                Currently an HSC 2nd Year Science student at Sunamganj Government College, I am also
                a home tutor, Co-Founder &amp; General Secretary of Shantichakra Blood Society,
                Founder of FS Coaching Center, and an active BNCC Cadet.
              </p>
              <p>
                I am passionate about web development, AI, content creation, and community service —
                with a mission to create positive change through education and technology.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* EDUCATION SECTION */}
      <section
        id="education"
        className="py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]"
      >
        <Container>
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
        </Container>
      </section>

      {/* ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-20 border-b border-[var(--color-border)]">
        <Container>
          <SectionTitle
            title="Achievements"
            subtitle="Recognition in academics, science fairs, and community service"
            align="center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {achievementItems.map((item) => (
              <Card key={item.title} variant="elevated" className="p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="font-semibold text-xl mb-1">{item.title}</div>
                <div className="text-sm text-[var(--color-brand-primary)] font-medium mb-3">
                  {item.year}
                </div>
                <div className="text-[var(--color-text-secondary)] text-sm">{item.desc}</div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* SERVICES SECTION — NEW DESIGN AS PER REQUIREMENTS */}
      <section
        id="services"
        className="py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]"
      >
        <Container>
          <SectionTitle
            title="Website Development Services"
            subtitle="Choose the right service for your needs. Starting prices are beginner-friendly."
            align="center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {portfolioServices.map((service) => (
              <Card key={service.title} variant="elevated" className="group p-7 flex flex-col">
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
        </Container>
      </section>

      {/* EXPERIENCE & INITIATIVES */}
      <section id="experience" className="py-20 border-b border-[var(--color-border)]">
        <Container>
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
            {initiatives.map((initiative) => (
              <Card key={initiative.title} variant="elevated" className="p-8">
                <div className="text-4xl mb-4">{initiative.icon}</div>
                <div className="font-semibold text-2xl">{initiative.title}</div>
                <div className="text-[var(--color-brand-primary)] font-medium">
                  {initiative.role}
                </div>
                <p className="mt-4 text-[var(--color-text-secondary)]">{initiative.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* BLOOD DONATION & SHANTICHAKRA */}
      <section id="blood" className="py-20 bg-[var(--color-brand-primary)] text-white">
        <Container>
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
        </Container>
      </section>

      {/* GALLERY SECTION */}
      <section
        id="gallery"
        className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-20"
      >
        <Container>
          <SectionTitle
            title="Gallery"
            subtitle="Some moments from academic achievements, community work, and initiatives"
            align="center"
          />

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <Card key={item.title} variant="elevated" className="overflow-hidden p-0">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="aspect-[3/2] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="mb-1 text-2xl">{item.icon}</div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">{item.meta}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-20">
        <Container>
          <SectionTitle
            title="Let’s Work Together"
            subtitle="Ready to start a project or just want to connect?"
            align="center"
          />

          <div className="max-w-md mx-auto text-center">
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
            <div className="mt-8 flex flex-wrap justify-center gap-2">
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
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-10 text-center text-sm text-[var(--color-text-tertiary)]">
        <Container>
          © {new Date().getFullYear()} {portfolioProfile.name} • Made with ❤️ in Sunamganj,
          Bangladesh
        </Container>
      </footer>
    </div>
  );
}
