"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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

      {/* HERO SECTION - Premium Modern Design */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:4px_4px] opacity-30"></div>

        <Container>
          <div className="max-w-4xl mx-auto text-center pt-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] text-sm font-medium mb-6">
              <span>🌟</span>
              <span>{portfolioProfile.roles}</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-semibold tracking-[-3.5px] leading-[0.95] mb-6">
              {portfolioProfile.name}
            </h1>

            <p className="text-2xl md:text-3xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 tracking-tight">
              {portfolioProfile.headline}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-surface)] border">
                <span className="text-xl">🎓</span>
                <span className="font-medium">{portfolioProfile.currentEducation}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-surface)] border">
                <span className="text-xl">🩸</span>
                <span className="font-medium">
                  {portfolioProfile.bloodGroup} Blood Donor ({portfolioProfile.bloodDonations})
                </span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-surface)] border">
                <span className="text-xl">🎖️</span>
                <span className="font-medium">BNCC Cadet</span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="px-10 text-lg">
                  Order a Website →
                </Button>
              </Link>
              <a href="#achievements">
                <Button variant="outline" size="lg" className="px-10 text-lg">
                  View Achievements
                </Button>
              </a>
            </div>

            <div className="mt-8 text-sm text-[var(--color-text-tertiary)]">
              Scroll to explore my journey ↓
            </div>
          </div>
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
