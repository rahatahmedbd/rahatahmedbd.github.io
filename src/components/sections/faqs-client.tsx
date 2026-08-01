"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Container, Section, SectionHeading, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FaqsClientProps {
  dbFaqs: any[];
}

export function FaqsClient({ dbFaqs }: FaqsClientProps) {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<number | string | null>(null);

  const defaultFaqs = [
    {
      question: "What web technologies do you specialize in?",
      answer: "I specialize in building full-stack web products using React, Next.js, TypeScript, TailwindCSS, Supabase, PostgreSQL, and Cloudinary.",
      category: "Technical",
    },
    {
      question: "How do I place a website order request?",
      answer: "Simply click the 'Order Website' link on the navigation menu, choose your website type, features, budget, and submit the multi-step request form. We'll review your scope instantly!",
      category: "Process",
    },
    {
      question: "Can I track my project's progress in real-time?",
      answer: "Yes! Every customer receives access to a secure, premium Client Dashboard where they can track project status, review billing details, download delivery files, submit revisions, and chat directly with developers.",
      category: "Dashboard",
    },
  ];

  const faqs = dbFaqs.length > 0 ? dbFaqs : defaultFaqs;

  const toggleFaq = (idx: number | string) => {
    setOpenId(openId === idx ? null : idx);
  };

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
            en: "Find quick answers to common questions about services, ordering systems, dynamic dashboards, and agency operations.",
          })}
        />

        <div className="space-y-4 mt-12 sm:mt-16">
          {faqs.map((faq, idx) => {
            const isOpen = openId === idx;
            return (
              <Reveal key={idx} delay={idx * 40} direction="fade">
                <Card className="border border-border/10 overflow-hidden bg-surface/30 backdrop-blur">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-fg hover:text-brand-500 transition-colors gap-4"
                  >
                    <span className="flex items-center gap-3 text-sm sm:text-base leading-snug">
                      <HelpCircle className="h-5 w-5 text-brand-500 shrink-0" />
                      {faq.question}
                    </span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-fg-muted" /> : <ChevronDown className="h-4 w-4 text-fg-muted" />}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-border/5 bg-canvas/20">
                      <p className="text-xs sm:text-sm text-fg-soft leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
