"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  KeyRound,
  LogOut,
  History,
  Activity,
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  Smartphone,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { changePasswordAction, logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Profile } from "@/types/database";

interface AccountSettingsFormProps {
  profile: Profile & { role_id?: string | null };
  permissions: string[];
  loginHistory: any[];
  activityLogs: any[];
}

export function AccountSettingsForm({
  profile,
  permissions,
  loginHistory,
  activityLogs,
}: AccountSettingsFormProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [isPendingChange, startChangeTransition] = useTransition();
  const [isPendingLogout, startLogoutTransition] = useTransition();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string[]>>({});

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwFieldErrors({});
    setPwSuccess(false);

    startChangeTransition(async () => {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!res.success) {
        if (res.errors) {
          setPwFieldErrors(res.errors);
        } else {
          setPwError(res.error || "Failed to change password");
        }
        return;
      }

      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  };

  const handleLogout = () => {
    startLogoutTransition(async () => {
      const res = await logoutAction();
      if (res.success) {
        router.refresh();
        router.push("/login");
      }
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return lang === "bn"
      ? d.toLocaleDateString("bn-BD", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="relative min-h-[90vh] py-24 sm:py-28 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.35] mask-fade-b [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8">
        <Reveal direction="fade">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-border/10 pb-6">
            <div>
              <h1 className="text-display-sm font-bold tracking-tight">
                <span className="text-gradient">
                  {t({
                    bn: "অ্যাকাউন্ট ও নিরাপত্তা সেটিংস",
                    en: "Account & Security Settings",
                  })}
                </span>
              </h1>
              <p className="text-sm text-fg-soft mt-1">
                {t({
                  bn: "আপনার ব্যক্তিগত তথ্য, পাসওয়ার্ড ও নিরাপত্তা লগ ম্যানেজ করুন।",
                  en: "Manage your personal profile, credentials, active sessions and security history.",
                })}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleLogout}
              disabled={isPendingLogout}
              className="sm:w-auto h-11 self-start"
            >
              {isPendingLogout ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              {t({ bn: "লগআউট করুন", en: "Log Out" })}
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card and Permissions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Info Card */}
            <Reveal delay={80}>
              <div className="card-surface p-6 rounded-3xl border border-border/10 bg-surface/40 backdrop-blur-md shadow-lift">
                <div className="flex items-center gap-4 mb-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-500 font-bold text-lg">
                    {profile.full_name?.slice(0, 2).toUpperCase() || <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-fg leading-tight">{profile.full_name}</h3>
                    <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mt-0.5">
                      {profile.role_id?.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/5">
                    <span className="text-fg-soft">{t({ bn: "ইমেইল", en: "Email" })}</span>
                    <span className="font-medium text-fg">{profile.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/5">
                    <span className="text-fg-soft">{t({ bn: "ফোন", en: "Phone" })}</span>
                    <span className="font-medium text-fg">{profile.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/5">
                    <span className="text-fg-soft">{t({ bn: "সদস্য হয়েছেন", en: "Member Since" })}</span>
                    <span className="font-medium text-fg">{formatDate(profile.created_at).split(" ")[0]}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Permissions Card */}
            <Reveal delay={140}>
              <div className="card-surface p-6 rounded-3xl border border-border/10 bg-surface/40 backdrop-blur-md shadow-lift">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-brand-500" />
                  <h3 className="font-bold text-fg">
                    {t({ bn: "আপনার পারমিশন সমূহ", en: "Your Permissions" })}
                  </h3>
                </div>
                <p className="text-xs text-fg-soft mb-4 leading-relaxed">
                  {t({
                    bn: "আপনার অর্পিত রোলের প্রেক্ষিতে নিম্নোক্ত পাতা ও সুবিধাসমূহ আপনার জন্য অনুমোদিত:",
                    en: "Based on your assigned role, you are authorized to perform the following actions:",
                  })}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {permissions.length > 0 ? (
                    permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center gap-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-brand-500/10"
                      >
                        <Check className="h-3 w-3" />
                        {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-fg-muted italic">
                      {t({ bn: "কোনো পারমিশন সেট করা নেই", en: "No specific permissions assigned" })}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Security forms and logs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Change Password Card */}
            <Reveal delay={100}>
              <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/40 backdrop-blur-md shadow-lift">
                <div className="flex items-center gap-2.5 mb-6">
                  <KeyRound className="h-5 w-5 text-brand-500" />
                  <h3 className="font-bold text-fg">
                    {t({ bn: "পাসওয়ার্ড পরিবর্তন করুন", en: "Change Password" })}
                  </h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {pwError && (
                    <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <p>{pwError}</p>
                    </div>
                  )}

                  {pwSuccess && (
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <p>
                        {t({
                          bn: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
                          en: "Your password has been successfully updated!",
                        })}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Current Password */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="currentPassword">
                        {t({ bn: "বর্তমান পাসওয়ার্ড", en: "Current Password" })}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          id="currentPassword"
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                      {pwFieldErrors.currentPassword && (
                        <p className="text-xs text-brand-500 pl-3">{pwFieldErrors.currentPassword[0]}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="newPassword">
                        {t({ bn: "নতুন পাসওয়ার্ড", en: "New Password" })}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                        <input
                          id="newPassword"
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        />
                      </div>
                      {pwFieldErrors.newPassword && (
                        <p className="text-xs text-brand-500 pl-3">{pwFieldErrors.newPassword[0]}</p>
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
                      {pwFieldErrors.confirmPassword && (
                        <p className="text-xs text-brand-500 pl-3">{pwFieldErrors.confirmPassword[0]}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" disabled={isPendingChange} className="w-full sm:w-auto h-11 mt-2">
                    {isPendingChange ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t({ bn: "আপডেট হচ্ছে...", en: "Updating Password..." })}
                      </>
                    ) : (
                      t({ bn: "পাসওয়ার্ড আপডেট করুন", en: "Update Password" })
                    )}
                  </Button>
                </form>
              </div>
            </Reveal>

            {/* Login History & Activity Logs */}
            <Reveal delay={180}>
              <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/40 backdrop-blur-md shadow-lift space-y-6">
                {/* Login History */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <History className="h-5 w-5 text-brand-500" />
                    <h3 className="font-bold text-fg">
                      {t({ bn: "লগইন হিস্ট্রি", en: "Recent Login History" })}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/10 text-fg-muted uppercase tracking-wider font-semibold">
                          <th className="py-2.5">{t({ bn: "তারিখ ও সময়", en: "Date" })}</th>
                          <th className="py-2.5">{t({ bn: "আইপি ঠিকানা", en: "IP Address" })}</th>
                          <th className="py-2.5">{t({ bn: "অবস্থা", en: "Status" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/5 text-fg-soft">
                        {loginHistory.length > 0 ? (
                          loginHistory.map((log) => (
                            <tr key={log.id} className="hover:bg-canvas-muted/10">
                              <td className="py-2.5 font-medium">{formatDate(log.created_at)}</td>
                              <td className="py-2.5 font-mono">{log.ip_address || "127.0.0.1"}</td>
                              <td className="py-2.5">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    log.status === "success"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-brand-500/10 text-brand-500"
                                  }`}
                                >
                                  {log.status === "success"
                                    ? t({ bn: "সফল", en: "Success" })
                                    : t({ bn: "ব্যর্থ", en: "Failed" })}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-4 text-center italic text-fg-muted">
                              {t({ bn: "কোনো লগইন রেকর্ড নেই", en: "No login history records found" })}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activity Logs */}
                <div className="pt-4 border-t border-border/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-brand-500" />
                    <h3 className="font-bold text-fg">
                      {t({ bn: "নিরাপত্তা অ্যাক্টিভিটি লগ", en: "Security Activity Logs" })}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/10 text-fg-muted uppercase tracking-wider font-semibold">
                          <th className="py-2.5">{t({ bn: "তারিখ ও সময়", en: "Date" })}</th>
                          <th className="py-2.5">{t({ bn: "অ্যাকশন", en: "Action" })}</th>
                          <th className="py-2.5">{t({ bn: "আইপি", en: "IP" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/5 text-fg-soft">
                        {activityLogs.length > 0 ? (
                          activityLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-canvas-muted/10">
                              <td className="py-2.5 font-medium">{formatDate(log.created_at)}</td>
                              <td className="py-2.5 font-mono capitalize">
                                {log.action?.replace(/_/g, " ")}
                              </td>
                              <td className="py-2.5 font-mono">{log.ip_address || "127.0.0.1"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-4 text-center italic text-fg-muted">
                              {t({ bn: "কোনো অ্যাক্টিভিটি রেকর্ড নেই", en: "No activity records found" })}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
