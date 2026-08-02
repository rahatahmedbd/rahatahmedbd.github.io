"use client";

import { useState, useTransition } from "react";
import { Rocket, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2, User, Mail, Phone, Globe, FileText, Cpu, LayoutDashboard, Copy, Check } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { submitProjectOrderAction } from "@/app/actions/orders";
import { BUILDINGS_DATA } from "./data";
import { Button } from "@/components/ui/button";

interface MissionLaunchCenterProps {
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
}

export function MissionLaunchCenter({ summaryState }: MissionLaunchCenterProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  // Client Details Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [companyName, setCompanyName] = useState("");
  const [projectDetails, setProjectDetails] = useState("");

  // Result state
  const [launched, setIsLaunched] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [copied, setCopied] = useState(false);

  const building = BUILDINGS_DATA.find((b) => b.id === summaryState.buildingId) || BUILDINGS_DATA[0];

  const handleLaunchProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }

    startTransition(async () => {
      // Calculate estimated cost number from price range
      const numericEstCost = parseInt(summaryState.estimatedPriceRange.replace(/[^0-9]/g, "")) || 250;

      const res = await submitProjectOrderAction({
        fullName,
        companyName,
        email,
        phone,
        country,
        websiteType: building.title.en,
        requiredFeatures: summaryState.features,
        designPreference: ["Modern", "Futuristic", "Interactive Cyber"],
        budgetOption: summaryState.estimatedPriceRange,
        deadlineOption: summaryState.estimatedTimeline,
        projectDetails: projectDetails || `Order for ${building.title.en} (${summaryState.pagesCount}, Scope: ${summaryState.estimatedScope})`,
        uploadedFiles: [],
        estimatedCost: numericEstCost,
        estimatedDelivery: summaryState.estimatedTimeline,
      });

      if (res.success && res.reference) {
        setOrderRef(res.reference);
        setIsLaunched(true);
      } else {
        alert(res.error || "Failed to launch project order.");
      }
    });
  };

  const handleCopyRef = () => {
    if (orderRef) {
      navigator.clipboard.writeText(orderRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative rounded-3xl border border-border/20 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-100 space-y-8">
      {/* Holographic Glowing Table Effect Background */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-30" />
      <div className="pointer-events-none absolute -top-32 inset-x-0 h-64 bg-gradient-to-b from-brand-500/20 to-transparent blur-3xl" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-white/10 pb-6 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3.5 py-1 text-xs font-mono font-bold text-brand-400">
          <Rocket className="h-3.5 w-3.5 animate-bounce" />
          <span>MISSION LAUNCH CENTER · COMMAND POST</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t({ en: "Holographic Launch Console", bn: "মিশন লঞ্চ কমান্ড সেন্টার" })}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {t({
            en: "Your custom blueprint is finalized. Complete your contact profile to ignite the project and dispatch it to Supabase.",
            bn: "আপনার প্রজেক্ট ব্লুপ্রিন্ট তৈরি। নাম ও যোগাযোগের তথ্য পূরণ করে প্রজেক্ট অর্ডার রিলিজ করুন।",
          })}
        </p>
      </div>

      {!launched ? (
        <form onSubmit={handleLaunchProject} className="space-y-8 relative z-10">
          {/* Holographic Table Display Box */}
          <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 space-y-4 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
              <span className="font-mono font-bold text-cyan-400">BLUEPRINT STATUS: READY</span>
              <span className="font-mono font-bold text-emerald-400">SYSTEMS NOMINAL</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Category:</span>
                <span className="font-extrabold text-white">{building.title.en}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Pages:</span>
                <span className="font-extrabold text-white">{summaryState.pagesCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Timeline:</span>
                <span className="font-extrabold text-amber-400">{summaryState.estimatedTimeline}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Estimated Price:</span>
                <span className="font-extrabold text-emerald-400">{summaryState.estimatedPriceRange}</span>
              </div>
            </div>
          </div>

          {/* Contact Details Form */}
          <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Client Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahat Ahmed"
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1626-224878"
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company / Agency Name"
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Additional Project Notes</label>
                <input
                  type="text"
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Any specific instructions..."
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Large Prominent Launch Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto min-w-[320px] rounded-full bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-black py-4 px-10 text-base shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mx-auto uppercase tracking-wider"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Igniting Engine & Storing in Supabase...</span>
                </>
              ) : (
                <>
                  <Rocket className="h-6 w-6 animate-pulse" />
                  <span>🚀 Launch My Project</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 mt-3">
              {t({
                en: "Saves order in Supabase database, triggers real-time admin alert & prepares client portal.",
                bn: "ডাটাবেসে প্রজেক্ট রিকোয়েস্ট সেভ করবে এবং এডমিন প্যানেলে অ্যালার্ট পাঠাবে।",
              })}
            </p>
          </div>
        </form>
      ) : (
        /* Launch Success State */
        <div className="text-center max-w-xl mx-auto py-8 space-y-6 animate-fadeIn relative z-10">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-slate-950 font-extrabold mx-auto shadow-2xl">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase">
              PROJECT MISSION INITIALIZED
            </span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight mt-2">
              {t({ en: "Project Request Successfully Launched!", bn: "প্রজেক্ট রিকোয়েস্ট সফলভাবে লঞ্চ হয়েছে!" })}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              {t({
                en: "Your order blueprint has been transmitted to Supabase and notified to Rahat Ahmed's Super Admin Panel.",
                bn: "আপনার অর্ডার ডাটাবেসে সেভ করা হয়েছে এবং এডমিন প্যানেলে নোটিফিকেশন পৌছে গেছে।",
              })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Unique Project ID:
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xl font-extrabold text-cyan-400">{orderRef}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Copy Reference"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/dashboard" className="w-full sm:w-auto px-8 py-3 h-auto text-xs font-bold">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span>Go to Client Portal</span>
            </Button>
            <Button href="/" variant="outline" className="w-full sm:w-auto px-6 py-3 h-auto text-xs font-bold">
              <span>Return to Home</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
