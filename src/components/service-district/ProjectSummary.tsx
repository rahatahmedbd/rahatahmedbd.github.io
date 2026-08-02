"use client";

import { Check, Edit3, ArrowRight, DollarSign, Clock, Layers, Sparkles, ShieldCheck, Cpu, Code, Lock } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { BUILDINGS_DATA, BUILDER_FEATURES, PORTAL_PACKAGES } from "./data";

interface ProjectSummaryProps {
  summaryState: {
    buildingId: string;
    pagesCount: string;
    isMultilingual: boolean;
    features: string[];
    estimatedScope: string;
    estimatedTimeline: string;
    estimatedPriceRange: string;
    difficultyLevel: string;
  };
  onEditChoices: () => void;
  onProceedToLaunch: () => void;
}

export function ProjectSummary({
  summaryState,
  onEditChoices,
  onProceedToLaunch,
}: ProjectSummaryProps) {
  const { t } = useLanguage();

  const building = BUILDINGS_DATA.find((b) => b.id === summaryState.buildingId) || BUILDINGS_DATA[0];

  // Determine recommended package based on price estimate or features
  const portalPackage =
    summaryState.features.length > 7
      ? PORTAL_PACKAGES[3]
      : summaryState.features.length > 4
      ? PORTAL_PACKAGES[2]
      : summaryState.features.length > 2
      ? PORTAL_PACKAGES[1]
      : PORTAL_PACKAGES[0];

  return (
    <div className="space-y-8 rounded-3xl border border-border/20 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              INSTANT PROJECT SUMMARY
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-slate-400">
              Custom Blueprint Verification
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t({ en: "Project Plan Overview", bn: "প্রজেক্ট সামারি ও চূড়ান্ত প্ল্যান" })}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t({
              en: "Review your selected modules, timeline, estimated budget and recommended package portal before launching.",
              bn: "আপনার সিলেক্টকৃত মোডিউল, বাজেট ও প্যাকেজ পোর্টাল রিভিউ করুন। প্রয়োজনে এডিট করুন।",
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={onEditChoices}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition-colors shrink-0"
        >
          <Edit3 className="h-4 w-4 text-cyan-400" />
          <span>{t({ en: "Edit Choices", bn: "পছন্দ পরিবর্তন করুন" })}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Building & Pages */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
            Selected Service Category
          </span>
          <div>
            <h3 className="text-lg font-extrabold text-white">{t(building.title)}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{t(building.subtitle)}</p>
          </div>
          <div className="pt-2 border-t border-white/5 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Page Count:</span>
              <span className="font-bold text-white">{summaryState.pagesCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Languages:</span>
              <span className="font-bold text-white">
                {summaryState.isMultilingual ? "Bilingual (EN + BN)" : "Single Language"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Recommended Package Portal */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
            Recommended Package Gateway
          </span>
          <div>
            <h3 className="text-lg font-extrabold text-white">{portalPackage.title}</h3>
            <p className="text-xs text-purple-300 font-bold mt-0.5">{portalPackage.priceRange}</p>
          </div>
          <p className="text-xs text-slate-300 border-t border-white/5 pt-2">
            {t(portalPackage.description)}
          </p>
        </div>

        {/* Card 3: Timeline & Budget Estimates */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Estimated Scope & Budget
          </span>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Timeline:</span>
              <span className="font-bold text-white">{summaryState.estimatedTimeline}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Complexity:</span>
              <span className="font-bold text-cyan-300">{summaryState.difficultyLevel}</span>
            </div>
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300">Total Estimate:</span>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {summaryState.estimatedPriceRange}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Features Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Selected Modules ({summaryState.features.length}):
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {summaryState.features.map((featId) => {
            const feat = BUILDER_FEATURES.find((f) => f.id === featId);
            if (!feat) return null;
            return (
              <div key={featId} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-bold">{t({ en: feat.name, bn: feat.nameBn })}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps Guide */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
        <span className="font-bold uppercase tracking-wider block">🚀 Next Steps:</span>
        <p>
          {t({
            en: "Clicking 'Proceed to Mission Launch' will display your finished holographic command plan. You can then launch your order instantly to store it in Supabase and notify the Admin Panel.",
            bn: "পরবর্তী স্টেপে কমান্ড রুমে মিশন লঞ্চ বাটন প্রেস করে সরাসরি প্রজেক্ট অর্ডার তৈরি করতে পারবেন।",
          })}
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onEditChoices}
          className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-xs font-bold text-slate-300 transition-colors"
        >
          {t({ en: "Back & Modify", bn: "পিছনে গিয়ে কাস্টমাইজ করুন" })}
        </button>

        <button
          type="button"
          onClick={onProceedToLaunch}
          className="rounded-full bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-extrabold px-8 py-3 text-xs shadow-xl transition-all flex items-center gap-2"
        >
          <span>{t({ en: "Proceed to Mission Launch Center", bn: "মিশন লঞ্চ সেন্টারে যান" })}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
