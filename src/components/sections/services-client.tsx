"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Sparkles, Code, GraduationCap, Heart, Layers, Terminal, ArrowRight, Check, Shield, Zap, Globe, Smartphone, Search, Palette, Database, Cpu, Lock, Rocket } from "lucide-react";
import { Container, Section, SectionHeading, Card, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  icon: string;
  features?: string[];
  featuresBn?: string[];
  ctaText?: { en: string; bn: string };
}

interface ServicesClientProps {
  dbServices: any[];
}

const defaultServices: Service[] = [
  {
    id: "web-dev",
    title_en: "Web Development",
    title_bn: "ওয়েব ডেভেলপমেন্ট",
    description_en: "Premium, secure and modern full-stack web application development services. From landing pages to complex SaaS platforms.",
    description_bn: "উন্নত, নিরাপদ এবং আধুনিক ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট সেবা। ল্যান্ডিং পেজ থেকে জটিল SaaS প্ল্যাটফর্ম পর্যন্ত।",
    icon: "Code",
    features: [
      "Next.js 14 + React 18 + TypeScript",
      "Tailwind CSS + Framer Motion animations",
      "Supabase (PostgreSQL + Auth + Realtime)",
      "Vercel deployment with CI/CD",
      "SEO-optimized + Lighthouse 90+ scores",
      "Mobile-first responsive design",
    ],
    featuresBn: [
      "নেক্সট.জেএস ১৪ + রিএক্ট ১৮ + টাইপস্ক্রিপ্ট",
      "টেইলউইন্ড সিএসএস + ফ্রেমার মোশন",
      "সাপাবেস (পোস্টগ্রেসকিউএল + অথ + রিয়েলটাইম)",
      "ভার্সেল ডিপ্লอยমেন্ট সিআই/সিডি সহ",
      "এসইও-অপটিমাইজড + লাইটহাউস ৯০+",
      "মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন",
    ],
    ctaText: { en: "Start a web project", bn: "ওয়েব প্রজেক্ট শুরু করুন" },
  },
  {
    id: "tutoring",
    title_en: "Home Tutoring",
    title_bn: "গৃহ শিক্ষকতা",
    description_en: "Experienced tutoring in science and computer subjects for school and college students. Personalized learning plans with proven results.",
    description_bn: "বিজ্ঞান এবং কম্পিউটার বিষয়ে স্কুল ও কলেজ শিক্ষার্থীদের জন্য অভিজ্ঞ গৃহ শিক্ষকতা। ব্যক্তিগত লার্নিং প্ল্যান ও প্রমাণিত ফলাফল।",
    icon: "GraduationCap",
    features: [
      "Science (Physics, Chemistry, Biology)",
      "Computer Science & Programming basics",
      "Mathematics (Algebra, Calculus, Geometry)",
      "HSC/SSC exam preparation",
      "Custom study materials & mock tests",
      "Flexible schedule (online/offline)",
    ],
    featuresBn: [
      "বিজ্ঞান (পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান)",
      "কম্পিউটার সায়েন্স ও প্রোগ্রামিং বেসিক",
      "গণিত (বীজগণিত, ক্যালকুলাস, জ্যামিতি)",
      "এইচএসসি/এসএসসি পরীক্ষার প্রস্তুতি",
      "কাস্টম স্টাডি ম্যাটেরিয়াল ও মক টেস্ট",
      "নমনীয় সময়সূচি (অনলাইন/অফলাইন)",
    ],
    ctaText: { en: "Book a session", bn: "সেশন বুক করুন" },
  },
  {
    id: "social",
    title_en: "Social & Volunteer Work",
    title_bn: "সমাজসেবা ও স্বেচ্ছাসেবা",
    description_en: "Active blood donation leader and volunteer in Sunamganj Shantichakra Blood Society. Community empowerment through technology and education.",
    description_bn: "সুনামগঞ্জ শান্তিচক্র ব্লাড সোসাইতে সক্রিয় রক্তদান লিডার ও স্বেচ্ছাসেবক। প্রযুক্তি ও শিক্ষার মাধ্যমে সম্প্রদায় সশক্তিকরণ।",
    icon: "Heart",
    features: [
      "Blood donation drives & coordination",
      "Shantichakra Blood Society leadership",
      "BNCC Cadet (Bangladesh National Cadet Corps)",
      "FS Coaching Center founder",
      "Helping Hand Organization founder",
      "Community health awareness campaigns",
    ],
    featuresBn: [
      "রক্তদান ড্রাইভ ও কোঅর্ডিনেশন",
      "শান্তিচক্র ব্লাড সোসাইটি লিডারশিপ",
      "বিএনসিসি ক্যাডেট (বাংলাদেশ ন্যাশনাল ক্যাডেট کور)",
      "এফএস কোচিং সেন্টার প্রতিষ্ঠাতা",
      "হেল্পিং হ্যান্ড অর্গানাইজেশন প্রতিষ্ঠাতা",
      "সাম্প্রদায়িক স্বাস্থ্য সচেতনতা অভিযান",
    ],
    ctaText: { en: "Join the cause", bn: "কার্যজুড়ে যোগ দিন" },
  },
];

const serviceIcons: Record<string, React.ReactNode> = {
  Code: <Code className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Layers: <Layers className="h-6 w-6" />,
  Terminal: <Terminal className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
  Smartphone: <Smartphone className="h-6 w-6" />,
  Search: <Search className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Database: <Database className="h-6 w-6" />,
  Cpu: <Cpu className="h-6 w-6" />,
  Lock: <Lock className="h-6 w-6" />,
  Rocket: <Rocket className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  ArrowRight: <ArrowRight className="h-4 w-4" />,
  Check: <Check className="h-3.5 w-3.5" />,
};

const iconBgStyles = [
  "bg-brand-500/10 text-brand-500",
  "bg-cyan-500/10 text-cyan-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-violet-500/10 text-violet-500",
  "bg-amber-500/10 text-amber-500",
  "bg-pink-500/10 text-pink-500",
];

/**
 * Premium Services Section — Interactive cards with expandable features,
 * distinct visual identities per service, and clear CTAs.
 */
export function ServicesClient({ dbServices }: ServicesClientProps) {
  const { t, lang } = useLanguage();

  const services = dbServices.length > 0 ? dbServices : defaultServices;

  return (
    <Section id="services" className="relative border-t border-border/5">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.3] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]">
        <div className="absolute inset-0 bg-grid-faint [background-size:80px_80px]" />
      </div>

      <Container>
        <SectionHeading
          eyebrow={t({ bn: "সেবাসমূহ", en: "My Services" })}
          title={t({
            bn: "আমি যা করি এবং যে সেবা দিয়ে থাকি",
            en: "What I Do & Services I Offer",
          })}
          subtitle={t({
            bn: "প্রযুক্তিগত দক্ষতা ও সমাজসেবার সমন্বয়ে তৈরি প্রিমিয়াম, টেইলারড সেবাসমূহ।",
            en: "Premium, highly tailored services crafted by combining technical expertise with volunteer dedication.",
          })}
        />

        {/* Service Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {services.map((srv, idx) => {
            const Icon = serviceIcons[srv.icon] || serviceIcons.Sparkles;
            const iconBg = iconBgStyles[idx % iconBgStyles.length];
            const features = lang === "bn" && srv.featuresBn ? srv.featuresBn : (srv.features || []);
            const ctaText = srv.ctaText ? t(srv.ctaText) : t({ en: "Learn more", bn: "বিস্তারিত জানুন" });

            return (
              <Reveal key={srv.id} delay={idx * 100} direction="up">
                <Card
                  interactive
                  className={cn(
                    "relative overflow-hidden p-7 sm:p-8",
                    "border-border/10 bg-surface/50 backdrop-blur-xl",
                    "flex flex-col h-full",
                    "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r",
                    idx === 0 ? "before:from-brand-500 before:to-brand-400" :
                    idx === 1 ? "before:from-cyan-500 before:to-cyan-400" :
                    "before:from-emerald-500 before:to-emerald-400"
                  )}
                >
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className={cn(
                      "grid h-14 w-14 place-items-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                      iconBg
                    )}>
                      {Icon}
                    </div>
                    <Badge tone="light" className="text-[10px] uppercase tracking-wider font-semibold">
                      {idx + 1}/3
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <h3 className="font-bold text-fg text-lg sm:text-xl leading-snug mb-3">
                      {t({ bn: srv.title_bn, en: srv.title_en })}
                    </h3>
                    <p className="text-sm text-fg-soft leading-relaxed mb-5 flex-1">
                      {t({ bn: srv.description_bn || "", en: srv.description_en || "" })}
                    </p>

                    {/* Feature List */}
                    {features.length > 0 && (
                      <ul className="space-y-2.5 mb-6" role="list">
                        {features.slice(0, 5).map((feat: string, fi: number) => (
                          <li key={fi} className="flex items-start gap-2.5 text-sm text-fg-soft group transition-colors">
                            <span className={cn(
                              "shrink-0 mt-0.5 grid h-5 w-5 place-items-center rounded-lg",
                              "bg-brand-500/10 text-brand-500 group:bg-brand-500 group:text-white transition-all duration-300"
                            )}>
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="leading-relaxed group-hover:text-fg transition-colors">{feat}</span>
                          </li>
                        ))}
                        {features.length > 5 && (
                          <li className="flex items-start gap-2.5 text-sm text-brand-500 font-medium">
                            <span className="shrink-0 mt-0.5 grid h-5 w-5 place-items-center rounded-lg bg-brand-500/10 text-brand-500">
                              <Sparkles className="h-3.5 w-3.5" />
                            </span>
                            <span>{t({ en: `+${features.length - 5} more features`, bn: `আরও ${features.length - 5} ফিচার` })}</span>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-border/10">
                    <button
                      className={cn(
                        "group w-full flex items-center justify-center gap-2 rounded-xl",
                        "px-5 py-3 text-sm font-bold transition-all duration-300",
                        idx === 0
                          ? "bg-brand-600 text-white hover:bg-brand-500 shadow-glow"
                          : idx === 1
                          ? "bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.5)]"
                          : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]"
                      )}
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Service District CTA — Premium */}
        <Reveal delay={300} direction="up">
          <div className="mt-16 relative overflow-hidden rounded-4xl border border-brand-500/25 bg-gradient-to-br from-brand-900/95 via-brand-800/95 to-indigo-900/95 p-7 sm:p-10 shadow-[0_25px_60px_-20px_rgba(244,63,94,0.4)]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-white">
              <div className="space-y-4 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 text-xs font-mono font-bold text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>CHAPTER 7 · INTERACTIVE EXPERIENCE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {t({ en: "Enter the Futuristic Service District", bn: "ইন্টারেক্টিভ সার্ভিস ডিস্ট্রিক্ট ভিজিট করুন" })}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                  {t({
                    en: "Explore 9 interactive building hubs, consult with our AI advisor, design your website live in our 3D Visual Builder, and launch your project.",
                    bn: "৯ টি ডিজিটাল সার্ভিস বিল্ডিং হাব ঘুরে দেখুন, ৩ডি ভিজ্যুয়াল বিল্ডারে প্রজেক্ট ডিজাইন করুন এবং নতুন অর্ডার রিলিজ করুন।",
                  })}
                </p>
              </div>

              <a
                href="/service-district"
                className={cn(
                  "shrink-0 relative inline-flex items-center gap-3 rounded-full",
                  "bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500",
                  "bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]",
                  "text-white font-extrabold px-8 py-4 text-sm",
                  "shadow-[0_15px_40px_-15px_rgba(244,63,94,0.6)]",
                  "hover:shadow-[0_20px_50px_-15px_rgba(244,63,94,0.75)]",
                  "transition-all duration-300 hover:scale-[1.02]"
                )}
              >
                <span className="relative z-10">{t({ en: "Explore Service District 🚀", bn: "সার্ভিস ডিস্ট্রিক্টে প্রবেশ করুন 🚀" })}</span>
                <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}