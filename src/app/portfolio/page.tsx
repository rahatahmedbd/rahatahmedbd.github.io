'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';

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
              <a href="#about" className="hover:text-[var(--color-brand-primary)] transition-colors">About</a>
              <a href="#education" className="hover:text-[var(--color-brand-primary)] transition-colors">Education</a>
              <a href="#achievements" className="hover:text-[var(--color-brand-primary)] transition-colors">Achievements</a>
              <a href="#experience" className="hover:text-[var(--color-brand-primary)] transition-colors">Experience</a>
              <a href="#services" className="hover:text-[var(--color-brand-primary)] transition-colors">Services</a>
              <a href="#contact" className="hover:text-[var(--color-brand-primary)] transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">← Back to Welcome</Button>
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
              <span>Student • Tutor • Blood Donor • Web Developer</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-semibold tracking-[-3.5px] leading-[0.95] mb-6">
              Rahat Ahmed
            </h1>
            
            <p className="text-2xl md:text-3xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 tracking-tight">
              Building meaningful impact through education, technology &amp; community service
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-surface)] border">
                <span className="text-xl">🎓</span>
                <span className="font-medium">HSC 2nd Year</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-surface)] border">
                <span className="text-xl">🩸</span>
                <span className="font-medium">A+ Blood Donor (4×)</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-surface)] border">
                <span className="text-xl">🎖️</span>
                <span className="font-medium">BNCC Cadet</span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#services">
                <Button size="lg" className="px-10 text-lg">Order a Website</Button>
              </a>
              <a href="#achievements">
                <Button variant="outline" size="lg" className="px-10 text-lg">View Achievements</Button>
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
              <p>I am Rahat Ahmed, born on June 21, 2006, in Jibdara village, Shantiganj, Sunamganj. Growing up amidst nature taught me to dream big and work relentlessly.</p>
              <p>Currently an HSC 2nd Year Science student at Sunamganj Government College, I am also a home tutor, Co-Founder &amp; General Secretary of Shantichakra Blood Society, Founder of FS Coaching Center, and an active BNCC Cadet.</p>
              <p>I am passionate about web development, AI, content creation, and community service — with a mission to create positive change through education and technology.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* EDUCATION SECTION */}
      <section id="education" className="py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
        <Container>
          <SectionTitle 
            title="Education Journey" 
            subtitle="A continuous path of academic excellence from primary school to HSC"
            align="center"
          />

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { year: "2025 — Present", title: "HSC 2nd Year (Science)", institution: "Sunamganj Government College", desc: "Currently pursuing HSC in Science group." },
                { year: "July 2025", title: "SSC — GPA 5.00 (A+)", institution: "Satgaon Jibdara High School", desc: "Achieved GPA 5.00 in Science group." },
                { year: "2019", title: "PSC — GPA 5.00", institution: "Jibdara Government Primary School", desc: "Passed with GPA 5.00." },
              ].map((edu, index) => (
                <Card key={index} variant="bordered" className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="md:w-48 text-sm font-mono text-[var(--color-text-tertiary)]">{edu.year}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-xl">{edu.title}</div>
                      <div className="text-[var(--color-text-secondary)]">{edu.institution}</div>
                      <div className="mt-1 text-sm text-[var(--color-text-tertiary)]">{edu.desc}</div>
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
            {[
              { icon: "🏆", title: "SSC — GPA 5.00 (A+)", year: "2025", desc: "Satgaon Jibdara High School" },
              { icon: "🥇", title: "44th Science Exhibition — 1st Place", year: "2024", desc: "National Science & Technology Week" },
              { icon: "🥇", title: "42nd Science Fair — 1st Place", year: "2020", desc: "Upazila Level" },
              { icon: "🧠", title: "Creative Talent Search — 1st in Science", year: "2024", desc: "Srijonshil Medha" },
              { icon: "🎖️", title: "Meritorious Student Honor", year: "2025", desc: "School Recognition" },
              { icon: "🩸", title: "Shantichakra Recognition Crest", year: "2025", desc: "For SSC A+" },
            ].map((item, index) => (
              <Card key={index} variant="elevated" className="p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="font-semibold text-xl mb-1">{item.title}</div>
                <div className="text-sm text-[var(--color-brand-primary)] font-medium mb-3">{item.year}</div>
                <div className="text-[var(--color-text-secondary)] text-sm">{item.desc}</div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* SERVICES SECTION — NEW DESIGN AS PER REQUIREMENTS */}
      <section id="services" className="py-20 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
        <Container>
          <SectionTitle 
            title="Website Development Services" 
            subtitle="Choose the right service for your needs. Starting prices are beginner-friendly."
            align="center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                title: "Portfolio Website", 
                price: "Starting from ৳8,000", 
                time: "5–7 days",
                desc: "Beautiful personal or professional portfolio to showcase your work." 
              },
              { 
                title: "Business Website", 
                price: "Starting from ৳15,000", 
                time: "7–10 days",
                desc: "Modern, fast, and responsive business website with contact forms." 
              },
              { 
                title: "Educational Website", 
                price: "Starting from ৳12,000", 
                time: "6–9 days",
                desc: "School, coaching center, or educational institution websites." 
              },
              { 
                title: "Blood Organization Site", 
                price: "Starting from ৳10,000", 
                time: "5–8 days",
                desc: "Donor management &amp; awareness platforms for blood organizations." 
              },
              { 
                title: "E-commerce / Landing Page", 
                price: "Starting from ৳18,000", 
                time: "8–12 days",
                desc: "Simple product showcase or full e-commerce ready landing pages." 
              },
              { 
                title: "Custom Project", 
                price: "Custom Quote", 
                time: "Varies",
                desc: "Need something unique? Let’s discuss your requirements." 
              },
            ].map((service, index) => (
              <Card key={index} variant="elevated" className="group p-7 flex flex-col">
                <div>
                  <div className="font-semibold text-2xl mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">{service.title}</div>
                  <div className="text-3xl font-semibold text-[var(--color-brand-primary)] mb-1">{service.price}</div>
                  <div className="text-sm text-[var(--color-text-tertiary)] mb-4">Delivery: {service.time}</div>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">{service.desc}</p>
                </div>
                
                <div className="mt-auto pt-6">
                  <a href="#contact">
                    <Button variant="outline" className="w-full">Choose This Service</Button>
                  </a>
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

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card variant="elevated" className="p-8">
              <div className="text-4xl mb-4">🏫</div>
              <div className="font-semibold text-2xl">FS Coaching Center</div>
              <div className="text-[var(--color-brand-primary)] font-medium">Founder &amp; Director</div>
              <p className="mt-4 text-[var(--color-text-secondary)]">Founded in 2024 to provide quality education at affordable prices to underprivileged students in Jibdara Bazar.</p>
            </Card>

            <Card variant="elevated" className="p-8">
              <div className="text-4xl mb-4">🤝</div>
              <div className="font-semibold text-2xl">Helping Hand Organization</div>
              <div className="text-[var(--color-brand-primary)] font-medium">Founder</div>
              <p className="mt-4 text-[var(--color-text-secondary)]">Founded in 2023 to support the poor and helpless people in the community.</p>
            </Card>
          </div>
        </Container>
      </section>

      {/* BLOOD DONATION & SHANTICHAKRA */}
      <section id="blood" className="py-20 bg-[var(--color-brand-primary)] text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">🩸</div>
            <h2 className="text-4xl font-semibold tracking-tight mb-4">Shantichakra Blood Society</h2>
            <p className="text-xl opacity-90 mb-8">Co-Founder &amp; General Secretary • Sunamganj</p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="px-6 py-2 bg-white/10 rounded-full">4× Blood Donor</div>
              <div className="px-6 py-2 bg-white/10 rounded-full">A+ Blood Group</div>
              <div className="px-6 py-2 bg-white/10 rounded-full">Founded 2025</div>
            </div>
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
              <a href="mailto:rahatbd20505@gmail.com">
                <Button size="lg" className="w-full">Email Me</Button>
              </a>
              <a href="https://wa.me/8801626224878" target="_blank" rel="noopener">
                <Button variant="outline" size="lg" className="w-full">Message on WhatsApp</Button>
              </a>
            </div>
            <p className="mt-8 text-sm text-[var(--color-text-tertiary)]">
              Usually respond within 24 hours
            </p>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-10 text-center text-sm text-[var(--color-text-tertiary)]">
        <Container>
          © {new Date().getFullYear()} Rahat Ahmed • Made with ❤️ in Sunamganj, Bangladesh
        </Container>
      </footer>
    </div>
  );
}
