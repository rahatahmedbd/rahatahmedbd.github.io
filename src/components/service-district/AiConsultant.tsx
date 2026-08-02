"use client";

import { useState } from "react";
import { Bot, Sparkles, Check, ArrowRight, RotateCcw, HelpCircle, Lightbulb, ChevronRight, Zap } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { AI_CONSULTANT_QUESTIONS, BUILDINGS_DATA, PORTAL_PACKAGES } from "./data";
import { Button } from "@/components/ui/button";

interface AiConsultantProps {
  onApplyRecommendation: (recommendation: {
    buildingId: string;
    packageId: "starter" | "professional" | "business" | "enterprise";
    features: string[];
  }) => void;
}

export function AiConsultant({ onApplyRecommendation }: AiConsultantProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = AI_CONSULTANT_QUESTIONS[currentStep];

  const handleSelectOption = (questionId: string, optionId: string) => {
    const updatedAnswers = { ...answers, [questionId]: optionId };
    setAnswers(updatedAnswers);

    if (currentStep < AI_CONSULTANT_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsFinished(false);
  };

  // Compute AI Recommendation based on answers
  const computeRecommendation = () => {
    let buildingId = "business-website";
    let packageId: "starter" | "professional" | "business" | "enterprise" = "professional";
    const featuresSet = new Set<string>();

    AI_CONSULTANT_QUESTIONS.forEach((q) => {
      const selectedOptionId = answers[q.id];
      if (!selectedOptionId) return;

      const option = q.options.find((o) => o.id === selectedOptionId);
      if (!option) return;

      if (option.recommendBuilding) buildingId = option.recommendBuilding;
      if (option.recommendPackage) packageId = option.recommendPackage;
      if (option.addFeatures) {
        option.addFeatures.forEach((f) => {
          // Convert human friendly names to feature IDs if needed
          if (f === "Admin Panel" || f === "CMS") featuresSet.add("admin-panel");
          if (f === "User Login" || f === "Authentication") featuresSet.add("user-login");
          if (f === "Dashboard") featuresSet.add("dashboard");
          if (f === "Payment Gateway") featuresSet.add("payment-gateway");
          if (f === "Donation System") featuresSet.add("donation-system");
          if (f === "Booking System" || f === "Appointment System") featuresSet.add("booking-system");
          if (f === "AI Integration" || f === "AI Features") featuresSet.add("ai-features");
          if (f === "API Integration") featuresSet.add("custom-integrations");
          if (f === "SEO Package") featuresSet.add("seo-package");
          if (f === "Maintenance Plan") featuresSet.add("maintenance-plan");
        });
      }
    });

    const recommendedBuilding = BUILDINGS_DATA.find((b) => b.id === buildingId) || BUILDINGS_DATA[0];
    const recommendedPortal = PORTAL_PACKAGES.find((p) => p.id === packageId) || PORTAL_PACKAGES[1];

    return {
      building: recommendedBuilding,
      portal: recommendedPortal,
      features: Array.from(featuresSet),
    };
  };

  const recommendation = computeRecommendation();

  return (
    <div className="relative rounded-3xl border border-border/20 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-100 space-y-6">
      {/* Background Neon Accent Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-600/15 blur-[100px]" />

      {/* Header Banner */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg">
            <Bot className="h-6 w-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-fuchsia-400">
                AI CONSULTANT & ADVISOR
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
              <span className="text-[10px] font-semibold text-slate-400">
                Chapter 7 Interactive Guide
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              {t({ en: "Need Help Choosing? Let AI Recommend", bn: "কোন সার্ভিস সিলেক্ট করবেন বুঝতে সাহায্য প্রয়োজন?" })}
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t({ en: "Reset AI", bn: "পুনরায় শুরু" })}</span>
        </button>
      </div>

      {!isFinished ? (
        /* Questionnaire Steps */
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>
                {t({ en: `Question ${currentStep + 1} of ${AI_CONSULTANT_QUESTIONS.length}`, bn: `প্রশ্ন ${currentStep + 1} / ${AI_CONSULTANT_QUESTIONS.length}` })}
              </span>
              <span className="text-fuchsia-400">
                {Math.round(((currentStep + 1) / AI_CONSULTANT_QUESTIONS.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / AI_CONSULTANT_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <HelpCircle className="h-5 w-5 text-fuchsia-400 shrink-0 mt-0.5" />
              <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                {t(currentQuestion.question)}
              </h4>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`group relative flex items-center justify-between text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "border-fuchsia-500 bg-fuchsia-500/15 text-white shadow-lg"
                        : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-fuchsia-500/50 hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-semibold leading-tight">
                      {t(opt.label)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-fuchsia-400 transition-colors shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* AI Recommendation Result Box */
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Zap className="h-4 w-4" />
            {t({ en: "AI Advisor Analysis Complete", bn: "এআই অ্যানালাইসিস সম্পন্ন হয়েছে" })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/80 p-6 rounded-2xl border border-fuchsia-500/30">
            {/* Recommended Building */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {t({ en: "Recommended Service Building", bn: "প্রস্তাবিত সার্ভিস বিল্ডিং" })}
              </span>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold text-sm">
                {t(recommendation.building.title)}
              </div>
              <p className="text-xs text-slate-400">
                {t(recommendation.building.subtitle)}
              </p>
            </div>

            {/* Recommended Package */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {t({ en: "Recommended Package Portal", bn: "প্রস্তাবিত প্যাকেজ পোর্টাল" })}
              </span>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-sm">
                {recommendation.portal.title} ({recommendation.portal.priceRange})
              </div>
              <p className="text-xs text-slate-400">
                Est. Delivery: {recommendation.portal.deliveryTime}
              </p>
            </div>

            {/* Key Suggested Features */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {t({ en: "Recommended Key Features", bn: "প্রস্তাবিত ফিচারস" })}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recommendation.features.length > 0 ? (
                  recommendation.features.map((fId, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold"
                    >
                      {fId}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Standard essential layout</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            * {t({ en: "Note: The AI acts solely as an advisor. You retain 100% control to modify any building or feature in the builder.", bn: "নোট: এটি একটি পরামর্শক এআই। আপনি আপনার সুবিধামতো যেকোন সিলেক্টশন পরিবর্তন করতে পারবেন।" })}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 transition-colors"
            >
              {t({ en: "Re-take AI Assessment", bn: "পুনরায় প্রশ্নগুলোর উত্তর দিন" })}
            </button>
            <button
              type="button"
              onClick={() =>
                onApplyRecommendation({
                  buildingId: recommendation.building.id,
                  packageId: recommendation.portal.id,
                  features: recommendation.features,
                })
              }
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white px-6 py-2.5 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t({ en: "Apply AI Recommendations to Visual Builder", bn: "এআই সাজেশন বিল্ডারে অ্যাপ্লাই করুন" })}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
