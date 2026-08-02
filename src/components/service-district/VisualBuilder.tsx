"use client";

import { useState } from "react";
import {
  Code,
  Layers,
  Sparkles,
  Check,
  ShieldCheck,
  Lock,
  LayoutDashboard,
  Rss,
  Calendar,
  Heart,
  CreditCard,
  Workflow,
  Search,
  ShieldAlert,
  Globe,
  FileText,
  DollarSign,
  Clock,
  Gauge,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { BUILDINGS_DATA, BUILDER_FEATURES, PORTAL_PACKAGES } from "./data";
import dynamic from "next/dynamic";

/**
 * three.js + drei is ~250 kB. Load it only when the builder is on screen so
 * the order journey stays fast on mobile.
 */
const WebsiteModel3D = dynamic(
  () => import("./WebsiteModel3D").then((m) => m.WebsiteModel3D),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[320px] place-items-center rounded-3xl border border-white/10 bg-slate-950/70 text-xs font-mono text-slate-400">
        Loading 3D preview…
      </div>
    ),
  }
);

interface VisualBuilderProps {
  selectedBuildingId: string;
  onBuildingChange: (id: string) => void;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  pagesCount: string;
  onPagesCountChange: (pages: string) => void;
  isMultilingual: boolean;
  onMultilingualChange: (multi: boolean) => void;
  onProceedToSummary: (builderState: {
    buildingId: string;
    pagesCount: string;
    isMultilingual: boolean;
    features: string[];
    estimatedScope: string;
    estimatedTimeline: string;
    estimatedPriceRange: string;
    difficultyLevel: string;
  }) => void;
}

export function VisualBuilder({
  selectedBuildingId,
  onBuildingChange,
  selectedFeatures,
  onFeaturesChange,
  pagesCount,
  onPagesCountChange,
  isMultilingual,
  onMultilingualChange,
  onProceedToSummary,
}: VisualBuilderProps) {
  const { t } = useLanguage();

  const currentBuilding = BUILDINGS_DATA.find((b) => b.id === selectedBuildingId) || BUILDINGS_DATA[0];

  // PAGE COUNT OPTIONS
  const pagesOptions = [
    { label: "1 Page (Landing)", value: "1 Page" },
    { label: "2–5 Pages", value: "2-5 Pages" },
    { label: "6–10 Pages", value: "6-10 Pages" },
    { label: "11–20 Pages", value: "11-20 Pages" },
    { label: "20+ Enterprise Pages", value: "20+ Pages" },
  ];

  const handleToggleFeature = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      onFeaturesChange(selectedFeatures.filter((id) => id !== featureId));
    } else {
      onFeaturesChange([...selectedFeatures, featureId]);
    }
  };

  // CALCULATE DYNAMIC ESTIMATES
  const baseCost = currentBuilding.basePrice;
  const featuresCost = selectedFeatures.reduce((acc, featId) => {
    const f = BUILDER_FEATURES.find((item) => item.id === featId);
    return acc + (f ? f.cost : 0);
  }, 0);

  const pagesMultiplier =
    pagesCount.includes("20+") ? 120 :
    pagesCount.includes("11-20") ? 80 :
    pagesCount.includes("6-10") ? 50 :
    pagesCount.includes("2-5") ? 30 : 0;

  const langCost = isMultilingual ? 40 : 0;

  const totalCalculated = baseCost + featuresCost + pagesMultiplier + langCost;

  // Estimated Price Range
  const priceMin = Math.round(totalCalculated * 0.9);
  const priceMax = Math.round(totalCalculated * 1.25);
  const estimatedPriceRange = `$${priceMin} – $${priceMax}`;

  // Estimated Timeline
  const estimatedTimeline =
    selectedFeatures.length > 7 || pagesCount.includes("20")
      ? "3–4 Weeks"
      : selectedFeatures.length > 4 || pagesCount.includes("11")
      ? "2–3 Weeks"
      : selectedFeatures.length > 2
      ? "1–2 Weeks"
      : "3–7 Days";

  // Estimated Scope
  const estimatedScope =
    totalCalculated > 800
      ? "Enterprise Cloud Platform"
      : totalCalculated > 450
      ? "Advanced Custom App"
      : totalCalculated > 250
      ? "Standard Business Suite"
      : "Essential Micro Portal";

  // Difficulty / Complexity Level
  const difficultyLevel =
    totalCalculated > 800
      ? "Level 5 — Cyber Architecture"
      : totalCalculated > 500
      ? "Level 4 — High Complexity"
      : totalCalculated > 300
      ? "Level 3 — Dynamic Full-Stack"
      : totalCalculated > 180
      ? "Level 2 — Interactive Portal"
      : "Level 1 — Streamlined Design";

  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="h-4 w-4 text-amber-400" />;
      case "Lock":
        return <Lock className="h-4 w-4 text-blue-400" />;
      case "LayoutDashboard":
        return <LayoutDashboard className="h-4 w-4 text-indigo-400" />;
      case "Rss":
        return <Rss className="h-4 w-4 text-rose-400" />;
      case "Calendar":
        return <Calendar className="h-4 w-4 text-cyan-400" />;
      case "Heart":
        return <Heart className="h-4 w-4 text-red-400" />;
      case "CreditCard":
        return <CreditCard className="h-4 w-4 text-emerald-400" />;
      case "Sparkles":
        return <Sparkles className="h-4 w-4 text-fuchsia-400" />;
      case "Workflow":
        return <Workflow className="h-4 w-4 text-purple-400" />;
      case "Search":
        return <Search className="h-4 w-4 text-teal-400" />;
      case "ShieldAlert":
        return <ShieldAlert className="h-4 w-4 text-yellow-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-brand-400" />;
    }
  };

  return (
    <div className="space-y-8 rounded-3xl border border-border/20 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              INTERACTIVE VISUAL BUILDER
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-semibold text-slate-400">
              No static quotes — Live calculation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t({ en: "Design Your Future Website Blueprint", bn: "ওয়েবসাইট ভিজ্যুয়াল বিল্ডার" })}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t({
              en: "Select your desired building category, number of pages, language support, and modules. Watch the 3D model and scope estimator update in real time.",
              bn: "আপনার সার্ভিস ক্যাটাগরি, পেজ সংখ্যা ও প্রয়োজনীয় ফিচারস সিলেক্ট করুন। ৩ডি লাইভ মডেল স্বয়ংক্রিয়ভাবে আপডেট হবে।",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
          <Sliders className="h-5 w-5 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            {selectedFeatures.length} Modules Selected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Options (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Select Building Category */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              1. {t({ en: "Website Category / Building Hub", bn: "সার্ভিস ক্যাটাগরি সিলেক্ট করুন" })}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BUILDINGS_DATA.map((b) => {
                const isSelected = b.id === selectedBuildingId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onBuildingChange(b.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500/15 text-white shadow-lg"
                        : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900"
                    }`}
                  >
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${b.color} text-white font-bold text-xs`}>
                      {b.title.en.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-white">
                        {t(b.title)}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        Starts at ${b.basePrice}
                      </p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Number of Pages & Multilingual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl border border-white/10 bg-white/5">
            {/* Pages count */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                2. {t({ en: "Number of Pages", bn: "পেজ সংখ্যা" })}
              </label>
              <select
                value={pagesCount}
                onChange={(e) => onPagesCountChange(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-cyan-500 outline-none transition-colors"
              >
                {pagesOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Multilingual Support */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                3. {t({ en: "Language Support", bn: "ভাষা সাপোর্ট" })}
              </label>
              <button
                type="button"
                onClick={() => onMultilingualChange(!isMultilingual)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  isMultilingual
                    ? "border-indigo-500 bg-indigo-500/15 text-white"
                    : "border-white/15 bg-slate-900 text-slate-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-400" />
                  {isMultilingual ? "Bilingual (English + Bangla)" : "Single Language"}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isMultilingual ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-slate-400"}`}>
                  {isMultilingual ? "+$40" : "Included"}
                </span>
              </button>
            </div>
          </div>

          {/* Step 3: Select Features & Modules */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
              4. {t({ en: "Select Required Modules & Features", bn: "প্রয়োজনীয় ফিচারস সিলেক্ট করুন" })}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUILDER_FEATURES.map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                return (
                  <div
                    key={feat.id}
                    onClick={() => handleToggleFeature(feat.id)}
                    className={`cursor-pointer group flex items-start justify-between gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/15 text-white shadow-md"
                        : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-purple-500/40 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/5 mt-0.5">
                        {renderFeatureIcon(feat.icon)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">
                          {t({ en: feat.name, bn: feat.nameBn })}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          {t(feat.description)}
                        </p>
                      </div>
                    </div>

                    <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold ${isSelected ? "bg-purple-500/30 text-purple-200" : "bg-white/5 text-slate-400"}`}>
                      +${feat.cost}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live 3D Model & Real-time Estimator (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Live 3D Model Canvas */}
          <WebsiteModel3D
            category={selectedBuildingId}
            pagesCount={pagesCount}
            isMultilingual={isMultilingual}
            features={selectedFeatures}
            estimatedScope={estimatedScope}
          />

          {/* Real-time Dynamic Estimates Card */}
          <div className="rounded-3xl border border-white/15 bg-slate-900/90 p-6 space-y-5 shadow-2xl backdrop-blur">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Gauge className="h-4 w-4 text-cyan-400" />
                {t({ en: "Live Scope & Price Estimate", bn: "লাইভ বাজেট ও সময় প্রাক্কলন" })}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Updates instantly as you select options.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Scope */}
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400 font-medium">Project Scope:</span>
                <span className="font-bold text-cyan-300">{estimatedScope}</span>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> Timeline:
                </span>
                <span className="font-bold text-white">{estimatedTimeline}</span>
              </div>

              {/* Complexity */}
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-slate-400 font-medium">Complexity Level:</span>
                <span className="font-bold text-purple-300">{difficultyLevel}</span>
              </div>

              {/* Price Range */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-emerald-400" /> Estimated Budget:
                </span>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {estimatedPriceRange}
                </span>
              </div>
            </div>

            {/* Submit / Next Button */}
            <button
              type="button"
              onClick={() =>
                onProceedToSummary({
                  buildingId: selectedBuildingId,
                  pagesCount,
                  isMultilingual,
                  features: selectedFeatures,
                  estimatedScope,
                  estimatedTimeline,
                  estimatedPriceRange,
                  difficultyLevel,
                })
              }
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-brand-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold py-3.5 px-6 shadow-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span>{t({ en: "Review Summary & Packages", bn: "প্যাকেজ ও প্রজেক্ট সামারি দেখুন" })}</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
