"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, Loader2, Info } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface LoginFormProps {
  adminExists: boolean;
}

export function LoginForm({ adminExists }: LoginFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Destination URL after successful login
  const nextDestination = searchParams.get("next") || "/dashboard";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await loginAction({
        email,
        password,
        rememberMe,
      });

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        } else {
          setError(res.error || "Invalid email or password");
        }
        return;
      }

      // Successful login, refresh router and redirect
      router.refresh();
      router.push(nextDestination);
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
              <LogIn className="h-7 w-7" />
              <div className="absolute -inset-1.5 -z-10 rounded-2xl bg-brand-600/15 blur-md" />
            </div>
            <h1 className="text-display-sm font-bold tracking-tight mb-2">
              <span className="text-gradient">
                {t({
                  bn: "অ্যাকাউন্টে লগইন করুন",
                  en: "Secure Sign In",
                })}
              </span>
            </h1>
            <p className="text-sm text-fg-soft max-w-sm">
              {t({
                bn: "আপনার ইমেইল ও পাসওয়ার্ড ব্যবহার করে লগইন করুন।",
                en: "Log in using your email and password to access your dashboard.",
              })}
            </p>
          </div>
        </Reveal>

        {/* First admin initialization prompt */}
        {!adminExists && (
          <Reveal delay={60}>
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 text-sm text-gold-600 dark:text-gold-400">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">
                  {t({
                    bn: "কোনো সুপার এডমিন পাওয়া যায়নি",
                    en: "No Super Admin Configured",
                  })}
                </p>
                <p className="text-xs text-fg-soft mb-2.5 leading-relaxed">
                  {t({
                    bn: "আপনার ওয়েবসাইটটি ব্যবহারের জন্য প্রথম সুপার এডমিন অ্যাকাউন্ট তৈরি করুন।",
                    en: "This system needs an initial Super Admin account setup to manage other staff and features.",
                  })}
                </p>
                <a
                  href="/init-super-admin"
                  className="inline-flex items-center text-xs font-semibold underline hover:text-gold-500 transition-colors"
                >
                  {t({
                    bn: "সুপার এডমিন অ্যাকাউন্ট তৈরি করুন →",
                    en: "Initialize Super Admin Now →",
                  })}
                </a>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={120}>
          <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/40 backdrop-blur-md shadow-lift">
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

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="password">
                    {t({ bn: "পাসওয়ার্ড", en: "Password" })}
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-brand-500 hover:text-brand-400 font-medium transition-colors"
                  >
                    {t({ bn: "পাসওয়ার্ড ভুলে গেছেন?", en: "Forgot password?" })}
                  </a>
                </div>
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

              {/* Remember Me */}
              <div className="flex items-center gap-2 px-1">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border/20 text-brand-500 focus:ring-brand-500 h-4 w-4 bg-canvas/30"
                />
                <label htmlFor="rememberMe" className="text-xs text-fg-soft cursor-pointer font-medium select-none">
                  {t({ bn: "আমাকে মনে রাখুন", en: "Remember me" })}
                </label>
              </div>

              <Button type="submit" disabled={isPending} className="w-full h-11 mt-2">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t({ bn: "লগইন হচ্ছে...", en: "Signing In..." })}
                  </>
                ) : (
                  t({ bn: "লগইন করুন", en: "Sign In" })
                )}
              </Button>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
