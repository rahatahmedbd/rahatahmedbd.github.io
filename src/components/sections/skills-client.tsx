"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

interface SkillsClientProps {
  dbSkills: any[];
}

export function SkillsClient({ dbSkills }: SkillsClientProps) {
  const { t } = useLanguage();

  const defaultSkills = [
    { name: "React / Next.js", category: "Frontend", proficiency: 90 },
    { name: "TypeScript", category: "Frontend", proficiency: 85 },
    { name: "TailwindCSS", category: "Frontend", proficiency: 95 },
    { name: "Node.js / Express", category: "Backend", proficiency: 80 },
    { name: "PostgreSQL / Supabase", category: "Database", proficiency: 85 },
    { name: "Git & GitHub", category: "Other", proficiency: 90 },
  ];

  const skills = dbSkills.length > 0 ? dbSkills : defaultSkills;

  // Group by Category
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <Section id="skills" className="border-t border-border/5">
      <Container size="narrow">
        <SectionHeading
          eyebrow={t({ bn: "দক্ষতাসমূহ", en: "My Skills" })}
          title={t({
            bn: "আমার কারিগরি এবং প্রযুক্তিগত দক্ষতাসমূহ",
            en: "Technical Stack & Expertise",
          })}
          subtitle={t({
            bn: "আধুনিক ওয়েব অ্যাপ্লিকেশন তৈরিতে আমি যে সমস্ত প্রযুক্তি এবং হাতিয়ার ব্যবহার করে থাকি।",
            en: "Programming languages, frameworks and libraries I utilize to engineer robust, high-performance web products.",
          })}
        />

        <div className="space-y-8 mt-12 sm:mt-16">
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-500 border-b border-border/5 pb-2">
                {cat}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {skills
                  .filter((s) => s.category === cat)
                  .map((sk, idx) => (
                    <Reveal key={idx} delay={idx * 30} direction="fade" className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-fg">{sk.name}</span>
                        <span className="text-brand-500 font-mono">{sk.proficiency}%</span>
                      </div>
                      <div className="w-full bg-canvas-muted rounded-full h-2 overflow-hidden border border-border/10">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${sk.proficiency}%` }}
                        />
                      </div>
                    </Reveal>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
