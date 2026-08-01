"use client";

import { useState, useTransition } from "react";
import {
  Code,
  Layout,
  Briefcase,
  Layers,
  Heart,
  GraduationCap,
  Utensils,
  Building,
  ShoppingBag,
  Rss,
  Cpu,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FileCode,
  FileText,
  User,
  Mail,
  Phone,
  Globe,
  Loader2,
  Info,
  DollarSign,
  Clock,
  Sparkles,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { submitProjectOrderAction } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { isCloudinaryConfigured, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary";

interface OrderFormProps {
  pricing: any;
}

export function OrderForm({ pricing }: OrderFormProps) {
  const { t, lang } = useLanguage();
  const [step, setStep] = useState(0); // 0 = Hero, 1-7 = Steps, 8 = Success
  const [isPending, startTransition] = useTransition();

  // Step 1: Client Info
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  // Step 2: Website Type
  const [websiteType, setWebsiteType] = useState("Landing Page");

  // Step 3: Required Features
  const [requiredFeatures, setRequiredFeatures] = useState<string[]>([]);

  // Step 4: Design Preferences
  const [designPreference, setDesignPreference] = useState<string[]>(["Modern"]);
  const [referenceUrls, setReferenceUrls] = useState("");
  const [designNotes, setDesignNotes] = useState("");

  // Step 5: Budget
  const [budgetOption, setBudgetOption] = useState("$100–250");

  // Step 6: Deadline
  const [deadlineOption, setDeadlineOption] = useState("2 Weeks");

  // Step 7: Project Details & Uploads
  const [projectDetails, setProjectDetails] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Success state
  const [orderRef, setOrderRef] = useState("");

  const websiteCategories = [
    { name: "Landing Page", icon: Layout, desc: "Single page product showcase or lead landing form.", basePrice: pricing.categories["Landing Page"] || 80 },
    { name: "Portfolio Website", icon: Briefcase, desc: "Showcase personal work, achievements, and contacts.", basePrice: pricing.categories["Portfolio Website"] || 100 },
    { name: "Business Website", icon: Layers, desc: "Informational business site detailing services and values.", basePrice: pricing.categories["Business Website"] || 150 },
    { name: "Company Website", icon: Building, desc: "Multi-departmental corporation showcase portal.", basePrice: pricing.categories["Company Website"] || 180 },
    { name: "NGO Website", icon: Heart, desc: "Voluntary organization, charity and social support project.", basePrice: pricing.categories["NGO Website"] || 140 },
    { name: "School / College Website", icon: GraduationCap, desc: "Institution catalog, result notices and files.", basePrice: pricing.categories["School / College Website"] || 160 },
    { name: "Restaurant Website", icon: Utensils, desc: "Food menu board with reservation forms and photos.", basePrice: pricing.categories["Restaurant Website"] || 120 },
    { name: "Hospital Website", icon: Building, desc: "Clinics/doctors appointments and medical records.", basePrice: pricing.categories["Hospital Website"] || 200 },
    { name: "E-commerce Website", icon: ShoppingBag, desc: "Digital store, product inventory, and online payments.", basePrice: pricing.categories["E-commerce Website"] || 250 },
    { name: "Blog / News Website", icon: Rss, desc: "Dynamic news publishing and category feed portal.", basePrice: pricing.categories["Blog / News Website"] || 130 },
    { name: "Custom Web Application", icon: Code, desc: "Full SaaS portals, CRM/ERPs or databases.", basePrice: pricing.categories["Custom Web Application"] || 400 },
    { name: "AI-Powered Solution", icon: Cpu, desc: "Chatbots, dynamic AI generations and custom model layers.", basePrice: pricing.categories["AI-Powered Solution"] || 500 },
  ];

  const featuresList = [
    { name: "Admin Panel", cost: pricing.features["Admin Panel"] || 50 },
    { name: "Dashboard", cost: pricing.features["Dashboard"] || 60 },
    { name: "Authentication", cost: pricing.features["Authentication"] || 40 },
    { name: "User Login", cost: pricing.features["User Login"] || 30 },
    { name: "Payment Gateway", cost: pricing.features["Payment Gateway"] || 80 },
    { name: "Booking System", cost: pricing.features["Booking System"] || 70 },
    { name: "Appointment System", cost: pricing.features["Appointment System"] || 70 },
    { name: "CMS", cost: pricing.features["CMS"] || 50 },
    { name: "Blog", cost: pricing.features["Blog"] || 40 },
    { name: "AI Integration", cost: pricing.features["AI Integration"] || 120 },
    { name: "API Integration", cost: pricing.features["API Integration"] || 60 },
    { name: "Live Chat", cost: pricing.features["Live Chat"] || 40 },
    { name: "Notifications", cost: pricing.features["Notifications"] || 30 },
    { name: "Search", cost: pricing.features["Search"] || 20 },
    { name: "Analytics", cost: pricing.features["Analytics"] || 30 },
    { name: "Multi-language", cost: pricing.features["Multi-language"] || 40 },
    { name: "Custom Feature", cost: pricing.features["Custom Feature"] || 50 },
  ];

  const designPreferencesList = ["Modern", "Minimal", "Premium", "Corporate", "Luxury", "Creative", "Dark Theme"];

  // DYNAMIC COST ESTIMATOR
  const baseCategoryPrice = websiteCategories.find((c) => c.name === websiteType)?.basePrice || 80;
  const featuresPrice = requiredFeatures.reduce((total, featName) => {
    const cost = featuresList.find((f) => f.name === featName)?.cost || 0;
    return total + cost;
  }, 0);

  const estimatedCost = baseCategoryPrice + featuresPrice;

  // ESTIMATED DELIVERY
  const estimatedDelivery =
    requiredFeatures.length > 5
      ? "3-4 Weeks"
      : requiredFeatures.length > 2
      ? "2 Weeks"
      : "1 Week";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const filesArr = Array.from(files);

    try {
      const uploaded: any[] = [];

      for (const file of filesArr) {
        let fileUrl = "";

        if (file.type.startsWith("image") && isCloudinaryConfigured() && CLOUDINARY_UPLOAD_PRESET) {
          // Cloudinary Upload
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          fileUrl = data.secure_url;
        } else {
          // Fallback or Document Mock link
          fileUrl = URL.createObjectURL(file);
        }

        uploaded.push({
          name: file.name,
          url: fileUrl,
          mimeType: file.type,
          sizeBytes: file.size,
        });
      }

      setUploadedFiles((prev) => [...prev, ...uploaded]);
    } catch (err) {
      alert("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleFeatureToggle = (name: string) => {
    setRequiredFeatures((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const handleDesignToggle = (name: string) => {
    setDesignPreference((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await submitProjectOrderAction({
        fullName,
        companyName,
        email,
        phone,
        country,
        websiteType,
        requiredFeatures,
        designPreference,
        budgetOption,
        deadlineOption,
        projectDetails,
        uploadedFiles,
        estimatedCost,
        estimatedDelivery,
      });

      if (!res.success) {
        alert(res.error || "Failed to submit project order");
        return;
      }

      setOrderRef(res.reference || "");
      setStep(8); // success step
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 py-8">
      {/* STEP 0: HERO VIEW */}
      {step === 0 && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-8 py-12">
          <Reveal direction="scale">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/15 bg-surface/60 px-4 py-1.5 text-xs font-semibold text-brand-500 uppercase tracking-widest backdrop-blur">
              <Sparkles className="h-4 w-4 animate-spin text-brand-500" />
              {t({ bn: "প্রিমিয়াম ওয়েবসাইট অর্ডারিং সিস্টেম", en: "Premium Project Request System" })}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-display-lg sm:text-display-xl font-bold tracking-tight">
              <span className="text-gradient">
                {t({ bn: "আসুন আপনার পরবর্তী ওয়েবসাইট তৈরি করি", en: "Let's Build Your Next Website" })}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-base sm:text-lg text-fg-soft leading-relaxed max-w-xl mx-auto">
              {t({
                bn: "আপনার ব্র্যান্ড বা ব্যবসায়িক লক্ষ্য অর্জনে আমি তৈরি করি আধুনিক, দ্রুতগতিসম্পন্ন এবং অত্যন্ত সুরক্ষিত ওয়েবসাইট। নিচের বাটনটিতে ক্লিক করে আপনার প্রজেক্ট প্ল্যানিং শুরু করুন।",
                en: "I design and develop modern, ultra-responsive, high-performance websites tailored to align with each client's unique brand, goals and operational needs.",
              })}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <button
              onClick={() => setStep(1)}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 text-white font-bold h-12 px-8 shadow-[0_10px_30px_-12px_rgba(244,63,94,0.6)] hover:bg-brand-500 hover:shadow-[0_16px_40px_-12px_rgba(244,63,94,0.7)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t({ bn: "আপনার প্রজেক্ট শুরু করুন", en: "Start Your Project" })}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      )}

      {/* FORM STEPS VIEW */}
      {step >= 1 && step <= 7 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start py-8">
          {/* Form container - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Steps indicator */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-fg-muted uppercase tracking-wider mb-2">
              <span className="text-brand-500">Step {step} of 7</span>
              <span>•</span>
              <span>
                {step === 1 && t({ bn: "ক্লায়েন্ট তথ্য", en: "Client Info" })}
                {step === 2 && t({ bn: "ওয়েবসাইটের ধরন", en: "Website Type" })}
                {step === 3 && t({ bn: "প্রয়োজনীয় ফিচারসমূহ", en: "Required Features" })}
                {step === 4 && t({ bn: "ডিজাইন পছন্দ", en: "Design & Reference" })}
                {step === 5 && t({ bn: "বাজেট অপশন", en: "Budget Option" })}
                {step === 6 && t({ bn: "সময়সীমা (Deadline)", en: "Deadline Timeline" })}
                {step === 7 && t({ bn: "প্রজেক্ট বিবরণী ও আপলোড", en: "Details & Upload" })}
              </span>
            </div>

            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift">
              {/* STEP 1: Client Info Form */}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-fg">{t({ bn: "আপনার প্রাথমিক তথ্য প্রদান করুন", en: "Tell Us About Yourself" })}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Rahat Ahmed"
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Company Name (Optional)</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Agency Inc."
                        className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="client@example.com"
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">WhatsApp Number / Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+8801XXXXXXXXX"
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Country</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Bangladesh"
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Website Type */}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-fg">{t({ bn: "ওয়েবসাইটের ক্যাটাগরি নির্ধারণ করুন", en: "Select Your Website Category" })}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {websiteCategories.map((cat) => {
                      const Icon = cat.icon;
                      const selected = websiteType === cat.name;
                      return (
                        <div
                          key={cat.name}
                          onClick={() => setWebsiteType(cat.name)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                            selected
                              ? "bg-brand-500/10 border-brand-500/20 text-fg"
                              : "border-border/10 bg-canvas/30 hover:bg-canvas-muted/40 text-fg-soft"
                          }`}
                        >
                          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected ? "bg-brand-500 text-white" : "bg-canvas text-fg-muted"}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-fg">{cat.name}</h4>
                            <p className="text-xs text-fg-muted mt-1 leading-relaxed">{cat.desc}</p>
                            <p className="text-xs font-semibold text-brand-500 mt-2">
                              Starting from ${cat.basePrice}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Required Features */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-fg">{t({ bn: "প্রয়োজনীয় ফিচারসমূহ সিলেক্ট করুন", en: "Choose Required Features" })}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {featuresList.map((feat) => {
                      const selected = requiredFeatures.includes(feat.name);
                      return (
                        <div
                          key={feat.name}
                          onClick={() => handleFeatureToggle(feat.name)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            selected
                              ? "bg-brand-500/10 border-brand-500/20 text-fg font-semibold"
                              : "border-border/10 bg-canvas/30 hover:bg-canvas-muted/30 text-fg-soft"
                          }`}
                        >
                          <span className="text-xs block">{feat.name}</span>
                          <span className="text-[10px] text-brand-500 font-medium block mt-1">+${feat.cost}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Design preferences */}
              {step === 4 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-fg">{t({ bn: "আপনার পছন্দের ডিজাইন ধরন", en: "Design Preferences" })}</h3>
                  
                  {/* Pref List */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Theme / Layout Style</label>
                    <div className="flex flex-wrap gap-2">
                      {designPreferencesList.map((pref) => {
                        const selected = designPreference.includes(pref);
                        return (
                          <span
                            key={pref}
                            onClick={() => handleDesignToggle(pref)}
                            className={`px-4 py-2 rounded-full border text-xs cursor-pointer select-none transition-all ${
                              selected
                                ? "bg-brand-500/10 border-brand-500/25 text-brand-500 font-bold"
                                : "border-border/10 bg-canvas/30 hover:bg-canvas-muted text-fg-soft"
                            }`}
                          >
                            {pref}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reference URLs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="referenceUrls">
                      Reference Website URLs (comma-separated)
                    </label>
                    <input
                      id="referenceUrls"
                      type="text"
                      value={referenceUrls}
                      onChange={(e) => setReferenceUrls(e.target.value)}
                      placeholder="https://site1.com, https://site2.com"
                      className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Design Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="designNotes">
                      Design Theme / Note details
                    </label>
                    <textarea
                      id="designNotes"
                      rows={3}
                      value={designNotes}
                      onChange={(e) => setDesignNotes(e.target.value)}
                      placeholder="We prefer dark luxurious themes with glowing cards, smooth scroll and clean grids..."
                      className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Budget */}
              {step === 5 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-fg">{t({ bn: "আপনার লক্ষ্য বাজেট কত?", en: "What's Your Budget Target?" })}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Under $100", "$100–250", "$250–500", "$500–1000", "$1000+"].map((opt) => {
                      const selected = budgetOption === opt;
                      return (
                        <div
                          key={opt}
                          onClick={() => setBudgetOption(opt)}
                          className={`p-4 rounded-2xl border text-center cursor-pointer font-bold transition-all ${
                            selected
                              ? "bg-brand-500/10 border-brand-500/25 text-brand-500"
                              : "border-border/10 bg-canvas/30 hover:bg-canvas-muted text-fg-soft"
                          }`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: Deadline */}
              {step === 6 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-fg">{t({ bn: "প্রজেক্ট ডেলিভারি সময়সীমা", en: "Delivery Deadline Goal" })}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["ASAP", "1 Week", "2 Weeks", "1 Month", "Flexible"].map((opt) => {
                      const selected = deadlineOption === opt;
                      return (
                        <div
                          key={opt}
                          onClick={() => setDeadlineOption(opt)}
                          className={`p-4 rounded-2xl border text-center cursor-pointer font-bold transition-all ${
                            selected
                              ? "bg-brand-500/10 border-brand-500/25 text-brand-500"
                              : "border-border/10 bg-canvas/30 hover:bg-canvas-muted text-fg-soft"
                          }`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 7: Project details & uploads */}
              {step === 7 && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-fg">{t({ bn: "বিস্তারিত প্রজেক্ট বিবরণ ও ফাইল", en: "Project Details & Attachments" })}</h3>
                  
                  {/* Large Details textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="details">
                      Full Project Requirements Description
                    </label>
                    <textarea
                      id="details"
                      required
                      rows={5}
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="Write details about your project needs, sections, contents, logos, references or any integrations required..."
                      className="w-full p-4 rounded-3xl border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Upload file triggers */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Attach Files (Logo, Brief, Doc, Zip)</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        multiple
                        id="formFiles"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("formFiles")?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 rounded-full border border-border/15 bg-canvas hover:bg-canvas-muted text-fg-soft px-4 h-10 text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {uploading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        Select Files
                      </button>
                    </div>

                    {/* Files list */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {uploadedFiles.map((f, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2.5 bg-canvas-muted/40 p-2.5 rounded-xl border border-border/5 text-xs text-fg-soft">
                            {f.mimeType?.startsWith("image") ? (
                              <ImageIcon className="h-4 w-4 text-brand-500" />
                            ) : (
                              <FileText className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="truncate flex-1 font-medium">{f.name}</span>
                            <span className="text-[10px] text-fg-muted">{(f.sizeBytes / 1024).toFixed(1)} KB</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Navigation Buttons */}
              <div className="flex justify-between border-t border-border/5 pt-6 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fg-soft hover:text-fg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step === 7 ? (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isPending || uploading || projectDetails.trim().length < 10}
                    className="flex items-center gap-2 rounded-full bg-brand-600 text-white font-bold h-11 px-6 shadow-soft hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Project Request"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Simple validations per step
                      if (step === 1 && (!fullName || !email || !phone || !country)) {
                        alert("Please fill in all required contact fields.");
                        return;
                      }
                      setStep(step + 1);
                    }}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500 hover:text-brand-400 transition-colors"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Sidebar Estimator */}
          <div className="lg:col-span-1 space-y-6">
            <Reveal delay={200}>
              <div className="card-surface p-6 rounded-3xl border border-border/10 bg-surface/40 backdrop-blur shadow-lift space-y-6 sticky top-24">
                <div>
                  <h3 className="font-bold text-fg leading-tight">প্রজেক্ট বাজেট ও সময় প্রাক্কলন (Estimator)</h3>
                  <p className="text-[10px] text-fg-muted uppercase font-semibold tracking-wider mt-1">Live Cost Estimator</p>
                </div>

                <div className="space-y-4">
                  {/* Category select display */}
                  <div className="flex justify-between text-sm py-2 border-b border-border/5">
                    <span className="text-fg-soft font-medium">Type: {websiteType}</span>
                    <span className="font-bold text-fg">${baseCategoryPrice}</span>
                  </div>

                  {/* Feature lists count */}
                  <div className="flex justify-between text-sm py-2 border-b border-border/5">
                    <span className="text-fg-soft font-medium">Features ({requiredFeatures.length}):</span>
                    <span className="font-bold text-fg">+${featuresPrice}</span>
                  </div>

                  {/* Estimation pricing summary */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-bold text-fg flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-brand-500" />
                      Estimated Price:
                    </span>
                    <span className="text-display-xs font-extrabold text-gradient">${estimatedCost}</span>
                  </div>

                  {/* Delivery summary */}
                  <div className="flex justify-between items-center py-2 border-t border-border/5 pt-4">
                    <span className="text-sm font-bold text-fg flex items-center gap-1">
                      <Clock className="h-4 w-4 text-brand-500" />
                      Delivery Timeline:
                    </span>
                    <span className="text-sm font-bold text-fg">{estimatedDelivery}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-[10px] text-fg-soft leading-relaxed border-t border-border/5 pt-4">
                  <Info className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                  <p>
                    {t({
                      bn: "এটি শুধুমাত্র একটি সাময়িক অনুমান। আপনার পুরো রিকোয়ারমেন্টস এবং ফাইল রিভিউ করে চূড়ান্ত বাজেট সুপার এডমিন কর্তৃক নিশ্চিত করা হবে।",
                      en: "This estimation is indicative. The final quote and actual budget will be carefully reviewed, finalized, and confirmed by the Super Admin.",
                    })}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      )}

      {/* STEP 8: SUCCESS PAGE */}
      {step === 8 && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6 py-12">
          <Reveal direction="scale">
            <div className="relative mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
              <CheckCircle className="h-10 w-10 animate-pulse" />
              <div className="absolute -inset-2 -z-10 rounded-3xl bg-brand-600/15 blur-lg" />
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">
                {t({ bn: "প্রজেক্ট রিকুয়েস্ট জমা হয়েছে!", en: "Project Request Received!" })}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <div className="card-surface p-6 rounded-2xl border border-border/10 bg-surface/30 backdrop-blur max-w-md mx-auto space-y-4">
              <p className="text-sm text-fg-soft leading-relaxed">
                {t({
                  bn: "আপনার প্রজেক্ট রিকুয়েস্টটি সফলভাবে সিস্টেমে জমা হয়েছে। আমরা কিছুক্ষণের মধ্যে আপনার প্রয়োজনীয়তা এবং বাজেটটি পর্যালোচনা করে আপনার সাথে যোগাযোগ করব।",
                  en: "Your multi-step project request order has been successfully generated in our web agency database. We will review details and reach out to you shortly.",
                })}
              </p>

              <div className="p-3 bg-canvas-muted rounded-xl border border-border/5 text-xs text-fg-soft">
                <span className="font-semibold uppercase tracking-wider text-fg-muted block mb-1">Unique Order ID</span>
                <span className="font-mono font-bold text-brand-500 text-lg">{orderRef}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="pt-4">
              <Button href="/" className="px-6 h-11">
                {t({ bn: "হোমে ফিরে যান", en: "Back to Home" })}
              </Button>
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}
