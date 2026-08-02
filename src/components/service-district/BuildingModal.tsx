"use client";

import { X, Check, Clock, Code, Sparkles, ArrowRight, ExternalLink, ShieldCheck, Building2, ShoppingBag, Heart, Briefcase, GraduationCap, Building, Utensils, Cpu } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { BuildingData } from "./data";
import { Button } from "@/components/ui/button";

interface BuildingModalProps {
  building: BuildingData | null;
  onClose: () => void;
  onSelectForBuilder: (buildingId: string) => void;
}

export function BuildingModal({
  building,
  onClose,
  onSelectForBuilder,
}: BuildingModalProps) {
  const { t, lang } = useLanguage();

  if (!building) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="h-8 w-8 text-cyan-400" />;
      case "ShoppingBag":
        return <ShoppingBag className="h-8 w-8 text-emerald-400" />;
      case "Heart":
        return <Heart className="h-8 w-8 text-rose-400" />;
      case "Briefcase":
        return <Briefcase className="h-8 w-8 text-purple-400" />;
      case "GraduationCap":
        return <GraduationCap className="h-8 w-8 text-amber-400" />;
      case "Building":
        return <Building className="h-8 w-8 text-blue-400" />;
      case "Utensils":
        return <Utensils className="h-8 w-8 text-amber-500" />;
      case "Code":
        return <Code className="h-8 w-8 text-violet-400" />;
      case "Cpu":
        return <Cpu className="h-8 w-8 text-fuchsia-400" />;
      default:
        return <Sparkles className="h-8 w-8 text-brand-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-border/20 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-8 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${building.color} p-3 shadow-lg text-white`}>
              {renderIcon(building.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  BUILDING HUB
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-semibold text-slate-400">
                  Est. {building.typicalTimeline}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                {t(building.title)}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {t(building.subtitle)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Section 1: Overview & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What this service is */}
          <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t({ en: "What This Service Is", bn: "এই সার্ভিসটির সংক্ষিপ্ত পরিচয়" })}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(building.description)}
            </p>
          </div>

          {/* Who it is for */}
          <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {t({ en: "Who It Is For", bn: "কাদের জন্য উপযুক্ত" })}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(building.targetAudience)}
            </p>
          </div>
        </div>

        {/* Content Section 2: Real Examples */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t({ en: "Real Examples & Projects", bn: "বাস্তব উদাহরণ ও প্রজেক্ট নমুনা" })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {building.realExamples.map((ex, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-3 hover:border-brand-500/50 transition-all"
              >
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src={ex.image}
                    alt={ex.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {ex.badge && (
                    <span className="absolute top-2 right-2 rounded-lg bg-black/70 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-cyan-300 border border-white/10">
                      {ex.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base leading-tight group-hover:text-brand-400 transition-colors">
                    {ex.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    {t(ex.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Section 3: Key Benefits & Typical Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t({ en: "Key Service Benefits", bn: "বিশেষ সুবিধাসমূহ" })}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {building.keyBenefits.map((b, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200"
                >
                  <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>{t(b)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {t({ en: "Typical Timeline", bn: "আনুমানিক সময়" })}
            </h3>
            <p className="text-2xl font-extrabold text-white">
              {building.typicalTimeline}
            </p>
            <p className="text-[11px] text-slate-400">
              {t({
                en: "Includes design, coding, database setup, and live testing.",
                bn: "ডিজাইন, কোডিং, ডাটাবেস ও লাইভ টেস্টিং অন্তর্ভুক্ত।",
              })}
            </p>
          </div>
        </div>

        {/* Content Section 4: Suggested Tech & Recommended Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
          {/* Tech Stack */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Code className="h-4 w-4 text-cyan-400" />
              {t({ en: "Suggested Tech Stack", bn: "প্রস্তাবিত টেকনোলজি" })}
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {building.suggestedTech.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              {t({ en: "Recommended Features", bn: "প্রস্তাবিত ফিচারস" })}
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {building.recommendedFeatures.map((feat, fIdx) => (
                <span
                  key={fIdx}
                  className="rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div>
            <span className="text-xs text-slate-400 block">
              {t({ en: "Starting Base Price:", bn: "শুরুতে বেস প্রাইস:" })}
            </span>
            <span className="text-2xl font-extrabold text-cyan-400">
              ${building.basePrice}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 transition-colors"
            >
              {t({ en: "Close Explorer", bn: "বন্ধ করুন" })}
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectForBuilder(building.id);
                onClose();
              }}
              className="flex-1 sm:flex-initial rounded-full bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white px-6 py-2.5 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{t({ en: "Customize in Visual Builder", bn: "ভিজ্যুয়াল বিল্ডারে ডিজাইন করুন" })}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
