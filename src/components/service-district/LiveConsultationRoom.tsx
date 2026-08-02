"use client";

import { useState, useTransition } from "react";
import { Video, Calendar, MessageSquare, FileText, Send, CheckCircle2, Loader2, Sparkles, User, Mail, Phone, Building } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { submitConsultationRequestAction } from "@/app/actions/orders";

export function LiveConsultationRoom() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [requestType, setRequestType] = useState<"consultation" | "meeting" | "message" | "custom_quote">("consultation");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("10:00 AM");
  const [notes, setNotes] = useState("");

  const [isSubmitted, setIsFinished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !notes) {
      alert("Please fill in your name, email, and message details.");
      return;
    }

    startTransition(async () => {
      const res = await submitConsultationRequestAction({
        fullName,
        email,
        phone,
        companyName,
        meetingDate,
        meetingTime,
        requestType,
        notes,
      });

      if (res.success) {
        setIsFinished(true);
      } else {
        alert(res.error || "Failed to submit request.");
      }
    });
  };

  return (
    <div className="relative rounded-3xl border border-border/20 bg-slate-950 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-100 space-y-8">
      {/* Ambient Room Glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-cyan-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-brand-600/15 blur-[120px]" />

      {/* Room Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              LIVE CONSULTATION ROOM
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-semibold text-slate-400">
              Direct Connection to Development Studio
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {t({ en: "Schedule a Virtual Meeting or Request Quote", bn: "ভার্চুয়াল মিটিং বুকিং ও কাস্টম বাজেট আলোচনা" })}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t({
              en: "Speak directly with Rahat Ahmed regarding your custom requirements, technical strategy, or request a tailored business quotation.",
              bn: "আপনার প্রজেক্টের রিকোয়ারমেন্টস নিয়ে সরাসরি মিটিং বা ফ্রি কনসাল্টেশনের অনুরোধ পাঠান।",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-2xl text-emerald-300 text-xs font-bold shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Consultant Available Online</span>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-900 border border-white/10">
            <button
              type="button"
              onClick={() => setRequestType("consultation")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                requestType === "consultation"
                  ? "bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Video className="h-4 w-4" />
              <span>Consultation</span>
            </button>

            <button
              type="button"
              onClick={() => setRequestType("meeting")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                requestType === "meeting"
                  ? "bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Book Meeting</span>
            </button>

            <button
              type="button"
              onClick={() => setRequestType("message")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                requestType === "message"
                  ? "bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Send Message</span>
            </button>

            <button
              type="button"
              onClick={() => setRequestType("custom_quote")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                requestType === "custom_quote"
                  ? "bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Custom Quote</span>
            </button>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-cyan-400" /> Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-cyan-400" /> Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-cyan-400" /> Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700-000000"
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-cyan-400" /> Company / Organization
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Conditional Date / Time Pickers if booking meeting */}
          {(requestType === "meeting" || requestType === "consultation") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Preferred Meeting Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Preferred Time Slot
                </label>
                <select
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
                >
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="06:00 PM">06:00 PM (Evening)</option>
                  <option value="09:00 PM">09:00 PM (Night)</option>
                </select>
              </div>
            </div>
          )}

          {/* Project Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Project Description / Request Details *
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your goals, project vision, key deadlines or questions..."
              className="w-full rounded-2xl border border-white/15 bg-slate-900 p-3.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-extrabold py-3 px-8 text-xs shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting to Admin Panel...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Success Screen */
        <div className="text-center py-8 space-y-4 max-w-md mx-auto animate-fadeIn">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h3 className="text-2xl font-extrabold text-white">
            {t({ en: "Consultation Request Dispatched!", bn: "কনসালটেশন রিকুয়েস্ট সফলভাবে জমা হয়েছে!" })}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {t({
              en: "Your request has been saved and routed directly to the Admin Panel. We will review your details and confirm via email/WhatsApp shortly.",
              bn: "আপনার রিকুয়েস্টটি সরাসরি এডমিন প্যানেলে পাঠানো হয়েছে। শীঘ্রই আপনার সাথে ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করা হবে।",
            })}
          </p>

          <button
            type="button"
            onClick={() => setIsFinished(false)}
            className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-2 text-xs font-bold text-slate-300 transition-colors"
          >
            {t({ en: "Submit Another Request", bn: "অন্য আরেকটি রিকুয়েস্ট পাঠান" })}
          </button>
        </div>
      )}
    </div>
  );
}
