"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Sparkles, Code, GraduationCap, Heart, Layers, Terminal } from "lucide-react";
import { Container, Section, SectionHeading, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

interface Service {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  icon: string;
}

interface ServicesClientProps {
  dbServices: any[];
}

export function ServicesClient({ dbServices }: ServicesClientProps) {
  const { t } = useLanguage();

  const defaultServices = [
    {
      title_en: "Web Development",
      title_bn: "ওয়েব ডেভেলপমেন্ট",
      description_en: "Premium, secure and modern full-stack web application development services.",
      description_bn: "উন্নত, নিরাপদ এবং আধুনিক ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট সেবা।",
      icon: "Code",
    },
    {
      title_en: "Home Tutoring",
      title_bn: "গৃহ শিক্ষকতা",
      description_en: "Experienced tutoring in science and computer subjects for school and college students.",
      description_bn: "বিজ্ঞান এবং কম্পিউটার বিষয়ে স্কুল ও কলেজ শিক্ষার্থীদের জন্য অভিজ্ঞ গৃহ শিক্ষকতা।",
      icon: "GraduationCap",
    },
    {
      title_en: "Social SBS Volunteer",
      title_bn: "রক্তদান ও সমাজসেবা",
      description_en: "Active blood donation leader and volunteer in Sunamganj Shantichakra Blood Society.",
      description_bn: "সুনামগঞ্জ শান্তিশতক ব্লাড সোসাইটিতে সক্রিয় রক্তদান লিডার ও সমাজসেবামূলক কর্মকাণ্ড।",
      icon: "Heart",
    },
  ];

  const services = dbServices.length > 0 ? dbServices : defaultServices;

  const getIcon = (name: string) => {
    switch (name) {
      case "Code":
        return <Code className="h-6 w-6 text-brand-500" />;
      case "GraduationCap":
        return <GraduationCap className="h-6 w-6 text-brand-500" />;
      case "Heart":
        return <Heart className="h-6 w-6 text-brand-500" />;
      case "Layers":
        return <Layers className="h-6 w-6 text-brand-500" />;
      default:
        return <Sparkles className="h-6 w-6 text-brand-500" />;
    }
  };

  return (
    <Section id="services" className="border-t border-border/5 bg-surface/5">
      <Container>
        <SectionHeading
          eyebrow={t({ bn: "সেবাসমূহ", en: "My Services" })}
          title={t({
            bn: "আমি যা করি এবং যে সেবা দিয়ে থাকি",
            en: "What I Do & Services I Offer",
          })}
          subtitle={t({
            bn: "আমার প্রযুক্তিগত দক্ষতা এবং সমাজসেবামূলক কাজের সমন্বয়ে প্রদানকৃত প্রিমিয়াম সেবাসমূহ।",
            en: "Premium, highly tailored services crafted by combining web development stack expertise with volunteer dedication.",
          })}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
          {services.map((srv, idx) => (
            <Reveal key={idx} delay={idx * 80} direction="scale">
              <Card interactive className="p-6 sm:p-8 border border-border/10 bg-surface/40 backdrop-blur flex flex-col items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
                  {getIcon(srv.icon)}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-fg text-lg">
                    {t({ bn: srv.title_bn, en: srv.title_en })}
                  </h3>
                  <p className="text-sm text-fg-soft leading-relaxed">
                    {t({ bn: srv.description_bn || "", en: srv.description_en || "" })}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
