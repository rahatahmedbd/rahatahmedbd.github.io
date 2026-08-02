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

        {/* Chapter 7 Interactive Service District Banner */}
        <Reveal delay={250}>
          <div className="mt-12 rounded-3xl border border-brand-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-mono font-bold text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>CHAPTER 7 · INTERACTIVE EXPERIENCE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {t({ en: "Enter the Futuristic Service District", bn: "ইন্টারেক্টিভ সার্ভিস ডিস্ট্রিক্ট ভিজিট করুন" })}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                {t({
                  en: "Explore 9 interactive building hubs, consult with our AI advisor, design your website live in our 3D Visual Builder, and launch your project.",
                  bn: "৯ টি ডিজিটাল সার্ভিস বিল্ডিং হাব ঘুরে দেখুন, ৩ডি ভিজ্যুয়াল বিল্ডারে প্রজেক্ট ডিজাইন করুন এবং নতুন অর্ডার রিলিজ করুন।",
                })}
              </p>
            </div>

            <a
              href="/service-district"
              className="shrink-0 rounded-full bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-extrabold px-8 py-3.5 text-xs shadow-xl transition-all hover:scale-105"
            >
              {t({ en: "Explore Service District 🚀", bn: "সার্ভিস ডিস্ট্রিক্টে প্রবেশ করুন 🚀" })}
            </a>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
