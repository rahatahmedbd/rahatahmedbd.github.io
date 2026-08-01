"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Star, User } from "lucide-react";
import { Container, Section, SectionHeading, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  author_avatar_url: string | null;
  rating: number;
  content: string;
}

interface TestimonialsClientProps {
  dbTestimonials: any[];
}

export function TestimonialsClient({ dbTestimonials }: TestimonialsClientProps) {
  const { t } = useLanguage();

  const defaultTestimonials = [
    {
      author_name: "Mominur Rahman",
      author_title: "CEO at DevTech Solutions",
      author_avatar_url: "",
      rating: 5,
      content: "Rahat built a premium corporate platform for us. The site loads in under a second and security is top-notch! Outstanding full stack work.",
    },
    {
      author_name: "Foyez Ahmed",
      author_title: "Guardian of FS Coaching Student",
      author_avatar_url: "",
      rating: 5,
      content: "Rahat is an exceptionally disciplined and patient tutor. He simplified chemistry and math concepts so clearly for my son.",
    },
  ];

  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : defaultTestimonials;

  return (
    <Section id="testimonials" className="border-t border-border/5 bg-surface/5">
      <Container>
        <SectionHeading
          eyebrow={t({ bn: "প্রশংসাপত্র", en: "Client Feedback" })}
          title={t({
            bn: "ক্লায়েন্ট এবং শুভাকাঙ্ক্ষীদের অমূল্য মতামত",
            en: "What My Clients & Guardians Say",
          })}
          subtitle={t({
            bn: "বিভিন্ন প্রজেক্ট সম্পন্ন করার পর আমার সেবার মান সম্পর্কে ক্লায়েন্টদের প্রতিক্রিয়া।",
            en: "Honest feedback, ratings, and testimonials from business owners, agency clients, and tutoring guardians.",
          })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16">
          {testimonials.map((tst, idx) => (
            <Reveal key={idx} delay={idx * 80} direction="scale">
              <Card interactive className="p-6 sm:p-8 border border-border/10 bg-surface/40 backdrop-blur flex flex-col justify-between h-full gap-6">
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, rIdx) => (
                      <Star
                        key={rIdx}
                        className={`h-4 w-4 ${
                          rIdx < tst.rating ? "text-gold-500 fill-gold-500" : "text-border"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-fg-soft leading-relaxed italic">
                    &ldquo;{tst.content}&rdquo;
                  </p>
                </div>

                {/* Author card */}
                <div className="flex items-center gap-3 border-t border-border/5 pt-4 mt-auto">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-canvas-muted border border-border/10 flex items-center justify-center font-bold text-brand-500 text-sm">
                    {tst.author_avatar_url ? (
                      <img src={tst.author_avatar_url} alt={tst.author_name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-fg-muted" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-fg text-sm">{tst.author_name}</h4>
                    <p className="text-xs text-fg-muted">{tst.author_title || "Client"}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
