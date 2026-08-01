"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, Mail, Lock, Phone, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { initSuperAdminAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function SuperAdminInitForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await initSuperAdminAction({
        fullName,
        email,
        password,
        phone: phone || null,
      });

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        } else {
          setError(res.error || "An unexpected error occurred");
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
              <Shield className="h-7 w-7" />
              <div className="absolute -inset-1.5 -z-10 rounded-2xl bg-brand-600/15 blur-md" />
            </div>
            <h1 className="text-display-sm font-bold tracking-tight mb-2">
              <span className="text-gradient">
                {t({
                  bn: "সুপার এডমিন তৈরি করুন",
                  en: "Initialize Super Admin",
                })}
              </span>
            </h1>
            <p className="text-sm text-fg-soft max-w-sm">
              {t({
                bn: "প্রথম সুপার এডমিন অ্যাকাউন্ট তৈরি করুন। এটি তৈরি করার পর এই পদ্ধতিটি চিরতরে বন্ধ হয়ে যাবে।",
                en: "Create the initial Super Admin account. Once initialized, public admin registration is permanently locked.",
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
                    bn: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
                    en: "Super Admin Created!",
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

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="fullName">
                    {t({ bn: "পূর্ণ নাম", en: "Full Name" })}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t({ bn: "রাহাত আহমেদ", en: "Rahat Ahmed" })}
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-xs text-brand-500 pl-3">{fieldErrors.fullName[0]}</p>
                  )}
                </div>

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
                      placeholder="admin@example.com"
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-brand-500 pl-3">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="password">
                    {t({ bn: "পাসওয়ার্ড", en: "Password" })}
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

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="phone">
                    {t({ bn: "মোবাইল নম্বর (ঐচ্ছিক)", en: "Phone Number (Optional)" })}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-xs text-brand-500 pl-3">{fieldErrors.phone[0]}</p>
                  )}
                </div>

                <Button type="submit" disabled={isPending} className="w-full h-11 mt-2">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t({ bn: "তৈরি হচ্ছে...", en: "Initializing..." })}
                    </>
                  ) : (
                    t({ bn: "অ্যাকাউন্ট তৈরি করুন", en: "Create Super Admin" })
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
