"use client";

import { useState } from "react";
import { Sparkles, Check, ArrowRight, Layers, Sliders, Zap, ShieldCheck, ChevronRight, X, Scale } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { PORTAL_PACKAGES, PortalPackage } from "./data";
import { Button } from "@/components/ui/button";

interface PortalsExperienceProps {
  selectedPortalId: string;
  onSelectPortal: (portalId: "starter" | "professional" | "business" | "enterprise") => void;
}

export function PortalsExperience({
  selectedPortalId,
  onSelectPortal,
}: PortalsExperienceProps) {
  const { t } = useLanguage();
  const [activePortalModal, setActivePortalModal] = useState<PortalPackage | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <div className="space-y-8 rounded-3xl border border-border/20 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              PACKAGE PORTAL EXPERIENCE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span className="text-xs font-semibold text-slate-400">
              4 Futuristic Dimensional Gateways
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t({ en: "Choose Your Gateway Portal", bn: "ভবিষ্যতের ডিজিটাল প্যাকেজ পোর্টাল" })}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t({
              en: "Step into one of our 4 portals to discover features, recommended audiences, delivery estimates, scalability scores, and upgrade paths.",
              bn: "আপনার প্রজেক্টের স্কেল অনুযায়ী উপযুক্ত প্যাকেজ পোর্টাল বেছে নিন। প্রতিটি পোর্টালে রয়েছে বিস্তারিত বিবরণ।",
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 px-5 py-2.5 text-xs font-bold text-purple-300 transition-colors shrink-0"
        >
          <Scale className="h-4 w-4" />
          <span>{t({ en: "Compare Portals Side-by-Side", bn: "পাশাপাশি প্যাকেজ তুলনা করুন" })}</span>
        </button>
      </div>

      {/* 4 Futuristic Portals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PORTAL_PACKAGES.map((portal) => {
          const isSelected = portal.id === selectedPortalId;

          return (
            <div
              key={portal.id}
              className={`group relative rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                isSelected
                  ? "border-purple-500 bg-slate-900/90 shadow-2xl scale-[1.02]"
                  : "border-white/10 bg-slate-900/50 hover:border-purple-500/40 hover:bg-slate-900"
              }`}
            >
              {/* Top Portal Glow Line */}
              <div
                className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${portal.color}`}
              />

              <div className="space-y-4 relative z-10">
                {/* Badge & Title */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-slate-300 border border-white/10">
                    {portal.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3" /> Selected
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {t({ en: portal.title, bn: portal.titleBn })}
                  </h3>
                  <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mt-1">
                    {portal.priceRange}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Est. Delivery: {portal.deliveryTime}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {t(portal.description)}
                </p>

                {/* Key Features preview */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Highlights:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {portal.features.slice(0, 3).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px]">{t(feat)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Portal Action Buttons */}
              <div className="space-y-2 pt-6 relative z-10 border-t border-white/5 mt-4">
                <button
                  type="button"
                  onClick={() => setActivePortalModal(portal)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 py-2 px-4 text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{t({ en: "Step Into Portal Details", bn: "পোর্টালের বিস্তারিত দেখুন" })}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectPortal(portal.id)}
                  className={`w-full rounded-2xl py-2.5 px-4 text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 font-black shadow-lg"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{t({ en: "Current Gateway Selected", bn: "প্যাকেজটি সিলেক্ট করা আছে" })}</span>
                    </>
                  ) : (
                    <span>{t({ en: "Select Portal", bn: "এই পোর্টাল সিলেক্ট করুন" })}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PORTAL DETAILS MODAL */}
      {activePortalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setActivePortalModal(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  PORTAL REVEAL
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">
                  {t({ en: activePortalModal.title, bn: activePortalModal.titleBn })}
                </h3>
              </div>
              <button
                onClick={() => setActivePortalModal(null)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
                  Recommended Audience:
                </span>
                <p className="font-medium text-slate-200">{t(activePortalModal.recommendedAudience)}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Complete Portal Features:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activePortalModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-slate-300">{t(feat)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">Scalability Rating:</span>
                  <p className="font-semibold text-white">{activePortalModal.scalability}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Upgrade Path:</span>
                  <p className="text-xs text-slate-300">{t(activePortalModal.upgradePath)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => {
                  onSelectPortal(activePortalModal.id);
                  setActivePortalModal(null);
                }}
                className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 text-xs shadow-lg"
              >
                {t({ en: "Select This Portal", bn: "এই পোর্টাল সিলেক্ট করুন" })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDE BY SIDE COMPARISON MODAL */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setIsCompareOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />

          <div className="relative w-full max-w-5xl rounded-3xl border border-white/20 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  SIDE-BY-SIDE MATRIX
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">
                  {t({ en: "Compare All 4 Portals Side-by-Side", bn: "সকল পোর্টালগুলোর পাশাপাশি তুলনা" })}
                </h3>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 text-slate-400 font-bold uppercase tracking-wider">Metric</th>
                    {PORTAL_PACKAGES.map((p) => (
                      <th key={p.id} className="p-3 font-extrabold text-white text-sm min-w-[160px]">
                        {p.title}
                        <span className="block text-cyan-400 font-bold text-xs mt-0.5">{p.priceRange}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 text-slate-400 font-semibold">Delivery Time</td>
                    {PORTAL_PACKAGES.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-slate-200">{p.deliveryTime}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-semibold">Target Audience</td>
                    {PORTAL_PACKAGES.map((p) => (
                      <td key={p.id} className="p-3 text-slate-300">{t(p.recommendedAudience)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-semibold">Scalability</td>
                    {PORTAL_PACKAGES.map((p) => (
                      <td key={p.id} className="p-3 text-purple-300 font-bold">{p.scalability}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-400 font-semibold">Key Highlights</td>
                    {PORTAL_PACKAGES.map((p) => (
                      <td key={p.id} className="p-3 text-slate-300 space-y-1">
                        {p.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span>{t(f)}</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
