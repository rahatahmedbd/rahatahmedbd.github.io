"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Lock,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { updateClientDetailsAction, updateClientAvatarAction } from "@/app/actions/profile";
import { changePasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Profile } from "@/types/database";

interface ClientProfileFormProps {
  profile: Profile;
  email: string;
}

export function ClientProfileForm({ profile, email }: ClientProfileFormProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const [isPendingDetails, startDetailsTransition] = useTransition();
  const [isPendingPassword, startPasswordTransition] = useTransition();

  // Profile details states
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");

  const [detailsSuccess, setDetailsSuccess] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleUpdateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsSuccess(null);
    setDetailsError(null);

    startDetailsTransition(async () => {
      const resName = await updateClientDetailsAction({
        fullName,
        phone: phone || undefined,
      });

      if (!resName.success) {
        setDetailsError(resName.error || "Failed to update profile info");
        return;
      }

      if (avatarUrl !== profile.avatar_url) {
        const resAvatar = await updateClientAvatarAction(avatarUrl);
        if (!resAvatar.success) {
          setDetailsError(resAvatar.error || "Failed to update avatar photo");
          return;
        }
      }

      setDetailsSuccess("Your client profile has been updated successfully!");
      router.refresh();
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSuccess(null);
    setPwError(null);

    startPasswordTransition(async () => {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!res.success) {
        setPwError(res.error || "Failed to change password. Verify your current credentials.");
        return;
      }

      setPwSuccess("Your password has been successfully updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">আমার প্রোফাইল (My Profile Settings)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            আপনার ব্যক্তিগত যোগাযোগের তথ্য, প্রোফাইল ছবি এবং পাসওয়ার্ড নিরাপদ উপায়ে এখান থেকে ম্যানেজ করুন।
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: profile avatar details */}
        <div className="lg:col-span-1 space-y-6">
          <Reveal delay={60}>
            <div className="card-surface p-6 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-canvas border-2 border-brand-500 flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-fg-muted" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>

              <h3 className="font-bold text-fg leading-tight">{fullName}</h3>
              <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider mt-1">
                Client Portal Account
              </p>

              <div className="w-full text-left space-y-3 mt-6 text-xs text-fg-soft border-t border-border/5 pt-4">
                <div className="flex justify-between">
                  <span>Registered Email:</span>
                  <span className="font-semibold text-fg truncate max-w-[150px]">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Client Status:</span>
                  <span className="text-emerald-500 font-semibold">Active</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right column: Edit Details and Change Password Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Details Form */}
          <Reveal delay={100}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift space-y-5">
              <div className="flex items-center gap-2 border-b border-border/5 pb-3">
                <User className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg text-base">যোগাযোগের তথ্য (Contact Details)</h3>
              </div>

              <form onSubmit={handleUpdateDetails} className="space-y-4">
                {detailsError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{detailsError}</p>
                  </div>
                )}

                {detailsSuccess && (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{detailsSuccess}</p>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
                    <input
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Profile Photo URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="avatar">
                    Profile Photo URL
                  </label>
                  <input
                    id="avatar"
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/.../profile.jpg"
                    className="w-full h-11 px-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                  />
                </div>

                <Button type="submit" disabled={isPendingDetails} className="px-6 h-11 mt-2">
                  {isPendingDetails ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    "Save Contact Details"
                  )}
                </Button>
              </form>
            </div>
          </Reveal>

          {/* Change Password Form */}
          <Reveal delay={140}>
            <div className="card-surface p-6 sm:p-8 rounded-3xl border border-border/10 bg-surface/30 backdrop-blur shadow-lift space-y-5">
              <div className="flex items-center gap-2 border-b border-border/5 pb-3">
                <KeyRound className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-fg text-base">পাসওয়ার্ড পরিবর্তন (Change Password)</h3>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {pwError && (
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm text-brand-600 dark:text-brand-400">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{pwError}</p>
                  </div>
                )}

                {pwSuccess && (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{pwSuccess}</p>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="currentPassword">
                    Current Password
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
                      className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="newPassword">
                      New Password
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
                        className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted" htmlFor="confirmPassword">
                      Confirm New Password
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
                        className="w-full h-11 pl-11 pr-4 rounded-full border border-border/10 bg-canvas/30 text-sm focus:border-brand-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isPendingPassword} className="px-6 h-11 mt-2">
                  {isPendingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
