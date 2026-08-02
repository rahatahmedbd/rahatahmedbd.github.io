"use client";

import { useState } from "react";
import {
  Building2,
  ShoppingBag,
  Heart,
  Briefcase,
  GraduationCap,
  Building,
  Utensils,
  Code,
  Cpu,
  Sparkles,
  Bot,
  Sliders,
  Layers,
  Video,
  FileCheck,
  Rocket,
  ArrowRight,
  Eye,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { BUILDINGS_DATA, BuildingData } from "./data";
import { BuildingModal } from "./BuildingModal";
import { AiConsultant } from "./AiConsultant";
import { VisualBuilder } from "./VisualBuilder";
import { PortalsExperience } from "./PortalsExperience";
import { LiveConsultationRoom } from "./LiveConsultationRoom";
import { ProjectSummary } from "./ProjectSummary";
import { MissionLaunchCenter } from "./MissionLaunchCenter";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export function ServiceDistrictMain() {
  const { t } = useLanguage();

  // Active Tab View: "district" | "consultant" | "builder" | "portals" | "meeting" | "summary" | "launch"
  const [activeTab, setActiveTab] = useState<
    "district" | "consultant" | "builder" | "portals" | "meeting" | "summary" | "launch"
  >("district");

  // State for Building Explorer Modal
  const [activeBuildingModal, setActiveBuildingModal] = useState<BuildingData | null>(null);

  // Builder State
  const [selectedBuildingId, setSelectedBuildingId] = useState("business-website");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "admin-panel",
    "seo-package",
  ]);
  const [pagesCount, setPagesCount] = useState("2-5 Pages");
  const [isMultilingual, setIsMultilingual] = useState(false);
  const [selectedPortalId, setSelectedPortalId] = useState<
    "starter" | "professional" | "business" | "enterprise"
  >("professional");

  // Calculated summary state
  const [summaryState, setSummaryState] = useState({
    buildingId: "business-website",
    pagesCount: "2-5 Pages",
    isMultilingual: false,
    features: ["admin-panel", "seo-package"],
    estimatedScope: "Standard Business Suite",
    estimatedTimeline: "1–2 Weeks",
    estimatedPriceRange: "$250 – $400",
    difficultyLevel: "Level 2 — Interactive Portal",
  });

  const renderBuildingIcon = (iconName: string) => {
    switch (iconName) {
      case "Building2":
        return <Building2 className="h-7 w-7 text-cyan-400" />;
      case "ShoppingBag":
        return <ShoppingBag className="h-7 w-7 text-emerald-400" />;
      case "Heart":
        return <Heart className="h-7 w-7 text-rose-400" />;
      case "Briefcase":
        return <Briefcase className="h-7 w-7 text-purple-400" />;
      case "GraduationCap":
        return <GraduationCap className="h-7 w-7 text-amber-400" />;
      case "Hospital":
      case "Building":
        return <Building className="h-7 w-7 text-blue-400" />;
      case "Utensils":
        return <Utensils className="h-7 w-7 text-amber-500" />;
      case "Code":
        return <Code className="h-7 w-7 text-violet-400" />;
      case "Cpu":
        return <Cpu className="h-7 w-7 text-fuchsia-400" />;
      default:
        return <Sparkles className="h-7 w-7 text-brand-400" />;
    }
  };

  const handleSelectBuildingForBuilder = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setActiveTab("builder");
  };

  const handleApplyAiRecommendation = (rec: {
    buildingId: string;
    packageId: "starter" | "professional" | "business" | "enterprise";
    features: string[];
  }) => {
    setSelectedBuildingId(rec.buildingId);
    setSelectedPortalId(rec.packageId);
    if (rec.features.length > 0) {
      setSelectedFeatures(rec.features);
    }
    setActiveTab("builder");
  };

  const handleProceedToSummaryFromBuilder = (bState: {
    buildingId: string;
    pagesCount: string;
    isMultilingual: boolean;
    features: string[];
    estimatedScope: string;
    estimatedTimeline: string;
    estimatedPriceRange: string;
    difficultyLevel: string;
  }) => {
    setSummaryState(bState);
    setActiveTab("summary");
  };

  return (
    <Section id="service-district" className="relative min-h-screen py-12 sm:py-16">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-radial-fade opacity-40" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-20" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      <Container>
        {/* Section Heading */}
        <Reveal>
          <SectionHeading
            eyebrow={t({ en: "CHAPTER 7 · SERVICE DISTRICT", bn: "অধ্যায় ৭ · সার্ভিস ডিস্ট্রিক্ট" })}
            title={t({
              en: "Interactive Service District & Website Order Journey",
              enTitle: "Interactive Service District & Website Order Journey",
              bn: "ইন্টারেক্টিভ সার্ভিস ডিস্ট্রিক্ট ও ওয়েবসাইট অর্ডারিং সার্ভিস",
            })}
            subtitle={t({
              en: "Every service becomes an interactive experience. Explore futuristic building hubs, consult with AI, design your website in 3D visual builder, and launch your project.",
              bn: "প্রত্যেকটি সেবা এখানে একটি ইন্টারেক্টিভ অভিজ্ঞতা। ভবন ঘুরে দেখুন, এআই কনসাল্টেন্টের সাহায্য নিন এবং ৩ডি বিল্ডারে নিজের প্রজেক্ট সাজিয়ে রিলিজ করুন।",
            })}
          />
        </Reveal>

        {/* Step Navigation Tabs */}
        <div className="mt-8 mb-10 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex items-center justify-start md:justify-center gap-2 min-w-max bg-slate-950/80 p-2 rounded-3xl border border-white/10 backdrop-blur">
            <button
              type="button"
              onClick={() => setActiveTab("district")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === "district"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>{t({ en: "Service District Map", bn: "ডিস্ট্রিক্ট ম্যাপ" })}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("consultant")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === "consultant"
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="h-4 w-4" />
              <span>{t({ en: "AI Consultant", bn: "এআই কনসালটেন্ট" })}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("builder")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === "builder"
                  ? "bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>{t({ en: "Visual Builder (3D)", bn: "ভিজ্যুয়াল বিল্ডার" })}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("portals")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === "portals"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{t({ en: "Package Portals", bn: "প্যাকেজ পোর্টাল" })}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("meeting")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === "meeting"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Video className="h-4 w-4" />
              <span>{t({ en: "Consultation Room", bn: "মিটিং রুম" })}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === "summary"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>{t({ en: "Project Summary", bn: "প্রজেক্ট সামারি" })}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("launch")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                activeTab === "launch"
                  ? "bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Rocket className="h-4 w-4" />
              <span>{t({ en: "Mission Launch", bn: "মিশন লঞ্চ" })}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SERVICE DISTRICT BUILDINGS MAP */}
        {activeTab === "district" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {t({ en: "Futuristic Service District Buildings", bn: "ইন্টারেক্টিভ সার্ভিস বিল্ডিং হাব" })}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any building to explore real examples, key benefits, suggested tech, or customize.
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold">
                9 Interactive Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BUILDINGS_DATA.map((building, idx) => (
                <Reveal key={building.id} delay={idx * 50} direction="scale">
                  <div className="group relative rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/90 flex flex-col justify-between overflow-hidden">
                    {/* Glowing Top Accent Line */}
                    <div
                      className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${building.color}`}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${building.color} p-3 shadow-lg`}>
                          {renderBuildingIcon(building.icon)}
                        </div>
                        <span className="text-xs font-mono font-extrabold text-cyan-400">
                          Est. {building.typicalTimeline}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                          {t(building.title)}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-snug">
                          {t(building.subtitle)}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed border-t border-white/5 pt-3">
                        {t(building.description)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setActiveBuildingModal(building)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4 text-cyan-400" />
                        <span>{t({ en: "Explore Hub", bn: "বিল্ডিং বিবরণ" })}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectBuildingForBuilder(building.id)}
                        className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>{t({ en: "Customize", bn: "ডিজাইন করুন" })}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AI CONSULTANT */}
        {activeTab === "consultant" && (
          <div className="animate-fadeIn">
            <AiConsultant onApplyRecommendation={handleApplyAiRecommendation} />
          </div>
        )}

        {/* TAB 3: VISUAL WEBSITE BUILDER */}
        {activeTab === "builder" && (
          <div className="animate-fadeIn">
            <VisualBuilder
              selectedBuildingId={selectedBuildingId}
              onBuildingChange={setSelectedBuildingId}
              selectedFeatures={selectedFeatures}
              onFeaturesChange={setSelectedFeatures}
              pagesCount={pagesCount}
              onPagesCountChange={setPagesCount}
              isMultilingual={isMultilingual}
              onMultilingualChange={setIsMultilingual}
              onProceedToSummary={handleProceedToSummaryFromBuilder}
            />
          </div>
        )}

        {/* TAB 4: PACKAGE PORTALS */}
        {activeTab === "portals" && (
          <div className="animate-fadeIn">
            <PortalsExperience
              selectedPortalId={selectedPortalId}
              onSelectPortal={(pId) => {
                setSelectedPortalId(pId);
                setActiveTab("summary");
              }}
            />
          </div>
        )}

        {/* TAB 5: LIVE CONSULTATION ROOM */}
        {activeTab === "meeting" && (
          <div className="animate-fadeIn">
            <LiveConsultationRoom />
          </div>
        )}

        {/* TAB 6: INSTANT PROJECT SUMMARY */}
        {activeTab === "summary" && (
          <div className="animate-fadeIn">
            <ProjectSummary
              summaryState={summaryState}
              onEditChoices={() => setActiveTab("builder")}
              onProceedToLaunch={() => setActiveTab("launch")}
            />
          </div>
        )}

        {/* TAB 7: MISSION LAUNCH CENTER */}
        {activeTab === "launch" && (
          <div className="animate-fadeIn">
            <MissionLaunchCenter summaryState={summaryState} />
          </div>
        )}
      </Container>

      {/* BUILDING EXPLORER MODAL */}
      <BuildingModal
        building={activeBuildingModal}
        onClose={() => setActiveBuildingModal(null)}
        onSelectForBuilder={handleSelectBuildingForBuilder}
      />
    </Section>
  );
}
