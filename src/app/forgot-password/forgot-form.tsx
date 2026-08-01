"use client";

import { useState, useTransition } from "react";
import { HelpCircle, Mail, AlertCircle, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { forgotPasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await forgotPasswordAction({ email });

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        } else {
          setError(res.error || "Failed to process request");
        }
        return;
      }

      setSuccess(true);
    });
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-16 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.35] mask-fade-b [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md px-5">
        <Reveal direction="scale">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
              <HelpCircle className="h-7 w-7" />
              <div className="absolute -inset-1.5 -z-10 rounded-2xl bg-brand-600/15 blur-md" />
            </div>
            <h1 className="text-display-sm font-bold tracking-tight mb-2">
              <span className="text-gradient">
                {t({
                  bn: "পাসওয়ার্ড ভুলে গেছেন?",
                  en: "Forgot Password?",
                })}
              </span>
            </h1>
            <p className="text-sm text-fg-soft max-w-sm">
              {t({
                bn: "আপনার অ্যাকাউন্টের ইমেইল দিন। আমরা সেখানে পাসওয়ার্ড রিসেট করার একটি লিংক পাঠাবো।",
                en: "Enter your registered email address and we'll send you a secure link to reset your password.",
              })}
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/40 backdrop-blur-md shadow-lift">
            {success ? (
              <div className="flex flex-col items-center text-center py-6">
                <CheckCircle className="h-14 w-14 text-emerald-500 mb-4 animate-bounce" />
                <h3 className="text-lg font-semibold text-fg mb-2">
                  {t({
                    bn: "লিংক পাঠানো হয়েছে!",
                    en: "Reset Link Sent!",
                  })}
                </h3>
                <p className="text-sm text-fg-soft mb-6 leading-relaxed">
                  {t({
                    bn: "আপনার ইমেইল চেক করুন। আমরা পাসওয়ার্ড রিসেট করার জন্য একটি সুরক্ষিত লিংক পাঠিয়েছি।",
                    en: "Check your inbox. We have sent a secure password reset link to your email address.",
                  })}
                </p>
                <Button href="/login" variant="secondary" className="w-full h-11">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t({ bn: "লগইন পাতায় ফিরে যান", en: "Back to Login" })}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="email">
                    {t({ bn: "ইমেইল ঠিকানা", en: "Email Address" })}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-brand-500 pl-3">{fieldErrors.email[0]}</p>
                  )}
                </div>

                <Button type="submit" disabled={isPending} className="w-full h-11 mt-2">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t({ bn: "পাঠানো হচ্ছে...", en: "Sending..." })}
                    </>
                  ) : (
                    t({ bn: "রিসেট লিংক পাঠান", en: "Send Reset Link" })
                  )}
                </Button>

                <div className="text-center pt-2">
                  <a
                    href="/login"
                    className="inline-flex items-center text-xs text-fg-soft hover:text-fg font-medium gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {t({ bn: "লগইন পাতায় ফিরে যান", en: "Back to Login" })}
                  </a>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
