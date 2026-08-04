"use client";

import { BadgeCheck, Quote, Star, User } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface TestimonialRecord {
  id?: string;
  author_name: string;
  author_title?: string | null;
  author_avatar_url?: string | null;
  rating: number;
  content: string;
  /** True only for rows that came from the database (i.e. approved). */
  verified?: boolean;
}

interface TestimonialsClientProps {
  dbTestimonials: TestimonialRecord[];
}

/** Preserved fallbacks — shown only while the CMS has no approved entries. */
const defaultTestimonials: TestimonialRecord[] = [
  {
    author_name: "Mominur Rahman",
    author_title: "CEO at DevTech Solutions",
    author_avatar_url: "",
    rating: 5,
    content:
      "Rahat built a premium corporate platform for us. The site loads in under a second and security is top-notch! Outstanding full stack work.",
  },
  {
    author_name: "Foyez Ahmed",
    author_title: "Guardian of FS Coaching Student",
    author_avatar_url: "",
    rating: 5,
    content:
      "Rahat is an exceptionally disciplined and patient tutor. He simplified chemistry and math concepts so clearly for my son.",
  },
];

function TestimonialCard({ item }: { item: TestimonialRecord }) {
  const { t } = useLanguage();

  return (
    <figure className="card-surface flex h-full flex-col justify-between gap-6 rounded-3xl p-6 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-500/25 hover:shadow-lift sm:p-7">
      <div className="space-y-4">
        <Quote className="h-7 w-7 text-brand-500/25" />
        <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < item.rating ? "fill-gold-400 text-gold-400" : "text-border/30"
              )}
            />
          ))}
        </div>
        <blockquote className="text-pretty text-sm leading-relaxed text-fg-soft">
          &ldquo;{item.content}&rdquo;
        </blockquote>
      </div>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-border/8 pt-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-border/10 bg-canvas-muted text-sm font-bold text-brand-500">
          {item.author_avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.author_avatar_url}
              alt={item.author_name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-4 w-4 text-fg-muted" />
          )}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-bold text-fg">
            <span className="truncate">{item.author_name}</span>
            {item.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-sky-500"
                aria-label={t({ en: "Verified client", bn: "যাচাইকৃত ক্লায়েন্ট" })}
              />
            )}
          </span>
          <span className="block truncate text-xs text-fg-muted">
            {item.author_title || t({ en: "Client", bn: "ক্লায়েন্ট" })}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsClient({ dbTestimonials }: TestimonialsClientProps) {
  const { t } = useLanguage();

  const hasDb = dbTestimonials.length > 0;
  const testimonials: TestimonialRecord[] = hasDb
    ? dbTestimonials.map((item) => ({ ...item, verified: true }))
    : defaultTestimonials;

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
            en: "Honest feedback from business owners, agency clients, and tutoring guardians.",
          })}
        />

        {testimonials.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-dashed border-border/20 p-10 text-center text-sm text-fg-muted">
            {t({
              en: "No testimonials published yet — the first ones will appear here.",
              bn: "এখনো কোনো মতামত প্রকাশ করা হয়নি — প্রথমগুলো এখানে দেখা যাবে।",
            })}
          </p>
        ) : (
          <Reveal className="mt-12 sm:mt-14">
            {/* Swipeable on phones, a comfortable grid from md upward. */}
            <div className="md:hidden">
              <Carousel
                ariaLabel={t({ en: "Client testimonials", bn: "ক্লায়েন্ট মতামত" })}
                itemClassName="w-[88%]"
              >
                {testimonials.map((item, i) => (
                  <TestimonialCard key={item.id ?? i} item={item} />
                ))}
              </Carousel>
            </div>
            <div className="hidden gap-6 md:grid md:grid-cols-2">
              {testimonials.map((item, i) => (
                <TestimonialCard key={item.id ?? i} item={item} />
              ))}
            </div>
          </Reveal>
        )}

        {hasDb ? (
          <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-fg-muted">
            <BadgeCheck className="h-3.5 w-3.5 text-sky-500" />
            {t({
              en: "Every testimonial shown here is reviewed and approved before publishing.",
              bn: "এখানে দেখানো প্রতিটি মতামত প্রকাশের আগে যাচাই ও অনুমোদন করা হয়।",
            })}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
