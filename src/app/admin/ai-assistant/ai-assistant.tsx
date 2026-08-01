"use client";

import { useState, useTransition } from "react";
import {
  Cpu,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  HelpCircle,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Reveal } from "@/components/ui/reveal";

interface Order {
  id: string;
  reference: string;
  website_type: string | null;
  required_features: string[] | null;
  budget_option: string | null;
  deadline_option: string | null;
  project_details: string | null;
  uploaded_files: any[] | null;
  estimated_cost: number | null;
  estimated_delivery: string | null;
  client_info: any;
}

interface AiAssistantProps {
  orders: Order[];
}

export function AiAssistant({ orders }: AiAssistantProps) {
  const { t } = useLanguage();
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"analysis" | "proposal" | "email" | "faq">("analysis");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Output States
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [proposalResult, setProposalResult] = useState<any | null>(null);
  const [emailResult, setEmailResult] = useState<string>("");
  const [faqResult, setFaqResult] = useState<any | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleAskAi = () => {
    if (!selectedOrder) return;
    setLoading(true);
    setProgress(20);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      // Generate highly customized heuristic outputs based on order details
      const clientName = selectedOrder.client_info?.fullName || "Valued Client";
      const type = selectedOrder.website_type || "Landing Page";
      const features = selectedOrder.required_features || [];
      const budget = selectedOrder.budget_option || "$250–500";
      const deadline = selectedOrder.deadline_option || "2 Weeks";
      const details = selectedOrder.project_details || "No details provided.";

      // 1. Analysis Output
      const missingInfo = [];
      if (!selectedOrder.uploaded_files || selectedOrder.uploaded_files.length === 0) {
        missingInfo.push("Client logo and branding assets are missing.");
      }
      if (details.length < 50) {
        missingInfo.push("Detail copy guidelines or requirements are brief.");
      }
      if (!details.toLowerCase().includes("http")) {
        missingInfo.push("No reference website links provided.");
      }

      setAnalysisResult({
        summary: `Client ${clientName} requested a premium ${type} website. Requirements include integrating ${
          features.length > 0 ? features.join(", ") : "standard responsive layouts"
        }.`,
        suggestedPriceRange: `$${Math.round((selectedOrder.estimated_cost || 100) * 0.9)} – $${Math.round(
          (selectedOrder.estimated_cost || 100) * 1.25
        )}`,
        suggestedTimeline: deadline === "ASAP" ? "1 Week (Urgent delivery)" : `${deadline} (Optimal)`,
        missingInfo: missingInfo.length > 0 ? missingInfo : ["No critical missing information detected!"],
      });

      // 2. Proposal Output
      setProposalResult({
        overview: `PROPOSAL AGREEMENT: PREMIUM ${type.toUpperCase()} WEBSITE\nPrepared for: ${clientName}\nReference: ${selectedOrder.reference}`,
        milestones: [
          `Phase 1: UI/UX Wireframe & Design acceptance (Estimated 3 Days)`,
          `Phase 2: Core Development & Database Integration (${features.join(", ") || "Layout"}) (Estimated 7 Days)`,
          `Phase 3: Testing, revision & Optimization (Estimated 2 Days)`,
          `Phase 4: Domain launch and final delivery (Estimated 1 Day)`,
        ],
        terms: "Standard Agency terms apply. 50% upfront payment prior to project kickoff, 50% upon final delivery acceptance.",
      });

      // 3. Email Output
      setEmailResult(
        `Subject: Proposal & Kickoff details for your ${type} - ${selectedOrder.reference}\n\nHi ${clientName},\n\nThank you for reaching out to us! We have carefully reviewed your project request for a premium ${type} website.\n\nWe have generated an official quote of $${
          selectedOrder.estimated_cost
        } with an estimated delivery timeline of ${deadline}.\n\nTo begin wireframing, could you please provide us with:\n- Your official logo assets\n- Copy contents / references you like\n\nPlease let us know if you would like to schedule a quick meeting to finalize terms!\n\nBest regards,\nRahat Ahmed Agency Team`
      );

      // 4. FAQ Suggester
      setFaqResult({
        question: `How long will it take to build my ${type}?`,
        answer: `Building a premium ${type} with advanced features like ${
          features.slice(0, 3).join(", ") || "responsive grid"
        } typically takes about ${deadline}. We offer an expedited track for urgent projects.`,
      });

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
              <Cpu className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-display-sm font-bold tracking-tight">
                <span className="text-gradient">এআই বিজনেস অ্যাসিস্ট্যান্ট (AI Assistant)</span>
              </h1>
              <p className="text-sm text-fg-soft mt-1">
                আপনার আগত প্রজেক্ট অর্ডারগুলোর ডিটেইলস বিশ্লেষণ করে ইনস্ট্যান্ট রিকোয়ারমেন্ট সামারি, ইমেইল এবং কোটেশন খসড়া তৈরি করুন।
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar selector - 1 col */}
          <div className="lg:col-span-1 space-y-6">
            <Reveal delay={60}>
              <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Select Project to Analyze</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/40 text-sm focus:border-brand-500 outline-none text-fg"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.website_type} ({o.reference})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAskAi}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white w-full h-11 font-semibold hover:bg-brand-500 hover:-translate-y-0.5 shadow-soft transition-all duration-300 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  Analyze with AI
                </button>
              </div>
            </Reveal>

            {/* Tab navigation links */}
            {analysisResult && (
              <Reveal delay={100}>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                      activeTab === "analysis"
                        ? "bg-brand-500/10 border-brand-500/20 text-brand-500"
                        : "border-transparent text-fg-soft hover:bg-canvas-muted"
                    }`}
                  >
                    <Compass className="h-4 w-4" />
                    Requirements Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab("proposal")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                      activeTab === "proposal"
                        ? "bg-brand-500/10 border-brand-500/20 text-brand-500"
                        : "border-transparent text-fg-soft hover:bg-canvas-muted"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Proposal Generator
                  </button>
                  <button
                    onClick={() => setActiveTab("email")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                      activeTab === "email"
                        ? "bg-brand-500/10 border-brand-500/20 text-brand-500"
                        : "border-transparent text-fg-soft hover:bg-canvas-muted"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    Draft Client Email
                  </button>
                  <button
                    onClick={() => setActiveTab("faq")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${
                      activeTab === "faq"
                        ? "bg-brand-500/10 border-brand-500/20 text-brand-500"
                        : "border-transparent text-fg-soft hover:bg-canvas-muted"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    FAQ Answer Suggestor
                  </button>
                </div>
              </Reveal>
            )}
          </div>

          {/* AI Outputs - 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <Reveal direction="fade">
                <div className="card-surface p-12 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift text-center space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-brand-500 mx-auto" />
                  <div>
                    <h3 className="font-bold text-fg text-sm">AI Assistant is analyzing requirement parameters...</h3>
                    <p className="text-xs text-fg-muted mt-1">Generating proposals and timelines ({progress}%)...</p>
                  </div>
                </div>
              </Reveal>
            ) : analysisResult ? (
              <Reveal delay={120}>
                <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift">
                  {/* Analysis Tab View */}
                  {activeTab === "analysis" && (
                    <div className="space-y-6">
                      <div className="border-b border-border/5 pb-4">
                        <h3 className="text-lg font-bold text-fg">Client Requirements Summary</h3>
                        <p className="text-xs text-fg-soft mt-1 leading-relaxed whitespace-pre-line">{analysisResult.summary}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-canvas/30 rounded-2xl border border-border/5 space-y-1">
                          <p className="font-bold text-fg-muted uppercase tracking-wider">Recommended Pricing Range</p>
                          <p className="text-gradient font-extrabold text-lg mt-1">{analysisResult.suggestedPriceRange}</p>
                        </div>

                        <div className="p-4 bg-canvas/30 rounded-2xl border border-border/5 space-y-1">
                          <p className="font-bold text-fg-muted uppercase tracking-wider">Suggested Timeline</p>
                          <p className="text-fg font-bold text-sm mt-1">{analysisResult.suggestedTimeline}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-brand-500/5 rounded-2xl border border-brand-500/10 text-xs space-y-2">
                        <p className="font-bold text-brand-500 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          Missing Project Information Detected
                        </p>
                        <ul className="list-disc pl-5 text-fg-soft space-y-1 mt-1 font-medium">
                          {analysisResult.missingInfo.map((info: string, idx: number) => (
                            <li key={idx}>{info}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Proposal Tab View */}
                  {activeTab === "proposal" && (
                    <div className="space-y-6 text-xs">
                      <div>
                        <h3 className="text-lg font-bold text-fg mb-2">Generated Proposal Agreement Draft</h3>
                        <pre className="p-4 bg-canvas/40 border border-border/5 text-fg font-mono leading-relaxed whitespace-pre-wrap rounded-2xl">
                          {proposalResult.overview}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-fg-muted uppercase tracking-widest">Suggested Milestones Roadmap</h4>
                        <div className="space-y-2">
                          {proposalResult.milestones.map((ms: string, idx: number) => (
                            <div key={idx} className="p-3 bg-canvas/20 rounded-xl border border-border/5 flex items-center gap-3">
                              <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-500/10 text-brand-500 font-mono font-bold">{idx + 1}</span>
                              <span className="text-fg-soft font-semibold">{ms}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-canvas/30 border border-border/5 rounded-2xl">
                        <p className="font-bold text-fg-muted uppercase tracking-wider">Suggested Terms & Conditions</p>
                        <p className="text-fg-soft mt-1 leading-relaxed font-medium">{proposalResult.terms}</p>
                      </div>
                    </div>
                  )}

                  {/* Email Tab View */}
                  {activeTab === "email" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-fg">Draft Client Response Email</h3>
                      <textarea
                        rows={12}
                        value={emailResult}
                        onChange={(e) => setEmailResult(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-border/10 bg-canvas/30 text-xs font-mono leading-relaxed focus:border-brand-500 outline-none resize-none"
                      />
                    </div>
                  )}

                  {/* FAQ Tab View */}
                  {activeTab === "faq" && (
                    <div className="space-y-4 text-xs">
                      <h3 className="text-lg font-bold text-fg">Suggested FAQ QA Details</h3>
                      
                      <div className="space-y-3">
                        <div className="p-4 bg-canvas/30 rounded-2xl border border-border/5">
                          <p className="font-bold text-fg-muted uppercase tracking-wider">Suggested FAQ Question</p>
                          <p className="text-fg font-bold text-sm mt-1">{faqResult.question}</p>
                        </div>

                        <div className="p-4 bg-canvas/30 rounded-2xl border border-border/5">
                          <p className="font-bold text-fg-muted uppercase tracking-wider">Suggested FAQ Answer</p>
                          <p className="text-fg-soft leading-relaxed mt-1 font-medium">{faqResult.answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            ) : (
              <Reveal direction="fade">
                <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
                  <Cpu className="h-10 w-10 text-border mx-auto mb-3" />
                  Select an active website project from the sidebar list, then click &quot;Analyze with AI&quot; to begin.
                </div>
              </Reveal>
            )}
          </div>
        </div>
      ) : (
        <Reveal direction="fade">
          <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
            <Cpu className="h-10 w-10 text-border mx-auto mb-3" />
            AI অ্যাসিস্ট্যান্ট ব্যবহারের জন্য ডাটাবেসে অর্ডার রিকুয়েস্ট থাকতে হবে।
          </div>
        </Reveal>
      )}
    </div>
  );
}
