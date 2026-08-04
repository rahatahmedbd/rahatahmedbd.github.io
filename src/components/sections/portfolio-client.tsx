"use client";

import Image from "next/image";
import { ArrowUpRight, ExternalLink, Github, Landmark, Star } from "lucide-react";
import type { Project } from "@/types/database";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Badge,
  Container,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function CaseStudy({ project }: { project: Project }) {
  const { t } = useLanguage();

  return (
    <article
      className={cn(
        "card-surface group flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 ease-premium",
        "hover:-translate-y-1.5 hover:border-brand-500/30 hover:shadow-lift"
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas-muted">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 33vw"
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-canvas-muted to-surface">
            <Landmark className="h-8 w-8 text-fg-muted/40" />
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3">
            <Badge tone="gold">
              <Star className="h-3 w-3 fill-current" />
              {t({ en: "Featured", bn: "বিশেষ" })}
            </Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-base font-bold leading-snug tracking-tight text-fg">
          {project.title}
        </h3>
        {project.summary ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-soft">
            {project.summary}
          </p>
        ) : null}

        {project.tags && project.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-canvas-muted px-2.5 py-1 text-[10px] font-semibold text-fg-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-5">
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-xs font-semibold text-white transition hover:bg-brand-500"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t({ en: "Live site", bn: "লাইভ সাইট" })}
            </a>
          ) : null}
          {project.repo_url ? (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex h-9 items-center gap-1.5 rounded-full border border-border/15 px-4 text-xs font-semibold text-fg-soft transition hover:text-fg"
            >
              <Github className="h-3.5 w-3.5" />
              {t({ en: "Code", bn: "কোড" })}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PortfolioClient({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();

  return (
    <Section id="portfolio" className="border-t border-border/5">
      <Container>
        <SectionHeading
          eyebrow={t({ en: "Selected work", bn: "নির্বাচিত কাজ" })}
          title={t({ en: "Case studies", bn: "কেস স্টাডি" })}
          subtitle={t({
            en: "Real projects, shipped and running. Each one links straight to the live site so you can judge it yourself.",
            bn: "বাস্তব প্রজেক্ট, তৈরি হয়ে চালু আছে। প্রতিটি সরাসরি লাইভ সাইটে নিয়ে যাবে — নিজেই যাচাই করুন।",
          })}
        />

        {projects.length === 0 ? (
          <Reveal className="mt-12">
            <div className="flex flex-col items-center gap-4 rounded-4xl border border-dashed border-border/20 bg-surface/40 p-10 text-center sm:p-14">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-canvas-muted">
                <Landmark className="h-6 w-6 text-fg-muted" />
              </span>
              <h3 className="text-lg font-bold tracking-tight">
                {t({
                  en: "Case studies are being written up",
                  bn: "কেস স্টাডি প্রস্তুত করা হচ্ছে",
                })}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-fg-soft">
                {t({
                  en: "Rather than fill this space with placeholders, published work will appear here as soon as each client approves it. In the meantime, the interactive museum walks through the same projects.",
                  bn: "প্লেসহোল্ডার দিয়ে জায়গা ভরার বদলে, ক্লায়েন্টের অনুমোদন পাওয়ার সঙ্গে সঙ্গেই প্রকাশিত কাজ এখানে যুক্ত হবে। ততক্ষণ পর্যন্ত ইন্টারেক্টিভ মিউজিয়ামে একই প্রজেক্টগুলো দেখতে পারেন।",
                })}
              </p>
              <div className="mt-1 flex flex-col items-stretch gap-3 sm:flex-row">
                <Button href="/museum" variant="secondary" size="sm">
                  <Landmark className="h-4 w-4" />
                  {t({ en: "Open the museum", bn: "মিউজিয়াম দেখুন" })}
                </Button>
                <Button href={site.whatsapp} target="_blank" rel="noopener noreferrer" size="sm">
                  {t({ en: "Ask to see examples", bn: "উদাহরণ দেখতে চাই" })}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Swipeable rail on phones, grid from sm upward. */}
            <div className="no-scrollbar snap-rail mt-12 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal
                  key={project.id}
                  direction="up"
                  delay={(i % 3) * 70}
                  className="snap-item w-[86%] shrink-0 sm:w-auto"
                >
                  <CaseStudy project={project} />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10 text-center">
              <Button href="/museum" variant="secondary" size="sm">
                <Landmark className="h-4 w-4" />
                {t({ en: "Explore every project in the museum", bn: "মিউজিয়ামে সব প্রজেক্ট দেখুন" })}
              </Button>
            </Reveal>
          </>
        )}
      </Container>
    </Section>
  );
}
