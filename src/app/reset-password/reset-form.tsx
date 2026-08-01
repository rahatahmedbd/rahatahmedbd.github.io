"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, AlertCircle, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { resetPasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await resetPasswordAction({ password, confirmPassword });

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        } else {
          setError(res.error || "Failed to reset password");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
              <KeyRound className="h-7 w-7" />
              <div className="absolute -inset-1.5 -z-10 rounded-2xl bg-brand-600/15 blur-md" />
            </div>
            <h1 className="text-display-sm font-bold tracking-tight mb-2">
              <span className="text-gradient">
                {t({
                  bn: "নতুন পাসওয়ার্ড সেট করুন",
                  en: "Reset Password",
                })}
              </span>
            </h1>
            <p className="text-sm text-fg-soft max-w-sm">
              {t({
                bn: "আপনার অ্যাকাউন্টের জন্য একটি নতুন এবং শক্তিশালী পাসওয়ার্ড সেট করুন।",
                en: "Set a new, strong password to secure your account access.",
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
                    bn: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!",
                    en: "Password Reset Complete!",
                  })}
                </h3>
                <p className="text-sm text-fg-soft mb-4">
                  {t({
                    bn: "আপনাকে লগইন পাতায় রিডাইরেক্ট করা হচ্ছে...",
                    en: "Redirecting you to the login page...",
                  })}
                </p>
                <Loader2 className="h-5 w-5 text-brand-500 animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="password">
                    {t({ bn: "নতুন পাসওয়ার্ড", en: "New Password" })}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-brand-500 pl-3">{fieldErrors.password[0]}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="confirmPassword">
                    {t({ bn: "পাসওয়ার্ড নিশ্চিত করুন", en: "Confirm Password" })}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-brand-500 pl-3">{fieldErrors.confirmPassword[0]}</p>
                  )}
                </div>

                <Button type="submit" disabled={isPending} className="w-full h-11 mt-2">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t({ bn: "রিসেট হচ্ছে...", en: "Resetting..." })}
                    </>
                  ) : (
                    t({ bn: "পাসওয়ার্ড পরিবর্তন করুন", en: "Reset Password" })
                  )}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
