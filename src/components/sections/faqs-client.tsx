"use client";

import { useMemo, useState } from "react";
import { HelpCircle, MessageCircle, Search } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

interface FaqRecord {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

interface FaqsClientProps {
  dbFaqs: FaqRecord[];
}

/** Preserved fallbacks — used only when the CMS has no published FAQs. */
const defaultFaqs: FaqRecord[] = [
  {
    question: "What web technologies do you specialize in?",
    answer:
      "I specialize in building full-stack web products using React, Next.js, TypeScript, TailwindCSS, Supabase, PostgreSQL, and Cloudinary.",
    category: "Technical",
  },
  {
    question: "How do I place a website order request?",
    answer:
      "Simply click the 'Order Website' link on the navigation menu, choose your website type, features, budget, and submit the multi-step request form. We'll review your scope instantly!",
    category: "Process",
  },
  {
    question: "Can I track my project's progress in real-time?",
    answer:
      "Yes! Every customer receives access to a secure, premium Client Dashboard where they can track project status, review billing details, download delivery files, submit revisions, and chat directly with developers.",
    category: "Dashboard",
  },
];

export function FaqsClient({ dbFaqs }: FaqsClientProps) {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const faqs = dbFaqs.length > 0 ? dbFaqs : defaultFaqs;

  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category).filter(Boolean) as string[]);
    return ["all", ...Array.from(set)];
  }, [faqs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = category === "all" || faq.category === category;
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [faqs, query, category]);

  return (
    <Section id="faqs" className="border-t border-border/5">
      <Container size="narrow">
        <SectionHeading
          eyebrow={t({ bn: "জিজ্ঞাসাবাদ", en: "Common Questions" })}
          title={t({
            bn: "সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর",
            en: "Frequently Asked Questions",
          })}
          subtitle={t({
            bn: "আমার সেবা, প্রজেক্ট প্রসেস এবং অন্যান্য কাজের ধরন সম্পর্কে জানতে নিচের প্রশ্নোত্তরগুলো দেখে নিন।",
            en: "Find quick answers about services, ordering, dashboards, and how projects run.",
          })}
        />

        {/* Search + category filter */}
        {faqs.length > 3 && (
          <Reveal className="mt-10 flex flex-col gap-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t({ en: "Search questions…", bn: "প্রশ্ন খুঁজুন…" })}
                className="h-12 w-full rounded-full border border-border/12 bg-canvas-subtle pl-11 pr-4 text-sm outline-none transition focus:border-brand-500"
              />
            </label>
            {categories.length > 2 && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={
                      "press shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition " +
                      (category === c
                        ? "border-brand-500/40 bg-brand-500/12 text-brand-600 dark:text-brand-400"
                        : "border-border/12 text-fg-muted hover:text-fg")
                    }
                  >
                    {c === "all" ? t({ en: "All", bn: "সব" }) : c}
                  </button>
                ))}
              </div>
            )}
          </Reveal>
        )}

        <div className="mt-8 space-y-3 sm:mt-10">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/20 p-10 text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-fg-muted/50" />
              <p className="mt-3 text-sm font-semibold text-fg">
                {t({ en: "No matching questions", bn: "কোনো প্রশ্ন মেলেনি" })}
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-fg-soft">
                {t({
                  en: "Try a different word — or just ask directly, replies usually come the same day.",
                  bn: "অন্য শব্দে খুঁজুন — অথবা সরাসরি জিজ্ঞাসা করুন, সাধারণত একই দিনে উত্তর পাবেন।",
                })}
              </p>
              <Button
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
                className="mt-5"
              >
                <MessageCircle className="h-4 w-4" />
                {t({ en: "Ask on WhatsApp", bn: "হোয়াটসঅ্যাপে জিজ্ঞাসা করুন" })}
              </Button>
            </div>
          ) : (
            filtered.map((faq, idx) => (
              <Reveal key={faq.id ?? idx} delay={Math.min(idx, 5) * 40} direction="fade">
                <AccordionItem
                  open={openId === idx}
                  onToggle={() => setOpenId(openId === idx ? null : idx)}
                  icon={<HelpCircle className="h-5 w-5 shrink-0 text-brand-500" />}
                  question={faq.question}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed text-fg-soft">
                    {faq.answer}
                  </p>
                </AccordionItem>
              </Reveal>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <Reveal className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-border/10 bg-surface/50 p-7 text-center">
            <p className="text-sm font-semibold text-fg">
              {t({ en: "Still have a question?", bn: "আরও প্রশ্ন আছে?" })}
            </p>
            <p className="max-w-md text-xs leading-relaxed text-fg-soft">
              {t({
                en: "Message directly — no forms, no waiting on a call back.",
                bn: "সরাসরি বার্তা পাঠান — কোনো ফর্ম নেই, কল-ব্যাকের অপেক্ষাও নেই।",
              })}
            </p>
            <Button
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              <MessageCircle className="h-4 w-4" />
              {t({ en: "Ask on WhatsApp", bn: "হোয়াটসঅ্যাপে জিজ্ঞাসা করুন" })}
            </Button>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
