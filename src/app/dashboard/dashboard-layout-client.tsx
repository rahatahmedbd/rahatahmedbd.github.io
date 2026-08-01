"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  MessageSquare,
  RefreshCw,
  FileText,
  UserCog,
  Bell,
  LogOut,
  Menu,
  X,
  User,
  Globe,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

interface DashboardLayoutClientProps {
  profile: any;
  initialUnreadCount: number;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  profile,
  initialUnreadCount,
  children,
}: DashboardLayoutClientProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isPendingLogout, startLogoutTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      label: t({ bn: "ড্যাশবোর্ড", en: "Overview" }),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t({ bn: "আমার প্রজেক্ট সমূহ", en: "My Projects" }),
      href: "/dashboard/projects",
      icon: Briefcase,
    },
    {
      label: t({ bn: "ফাইল ম্যানেজার", en: "File Manager" }),
      href: "/dashboard/files",
      icon: FolderOpen,
    },
    {
      label: t({ bn: "প্রজেক্ট চ্যাট", en: "Project Chat" }),
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      label: t({ bn: "রিভিশন রিকুয়েস্ট", en: "Revisions" }),
      href: "/dashboard/revisions",
      icon: RefreshCw,
    },
    {
      label: t({ bn: "ইনভয়েস ও পেমেন্ট", en: "Invoices & Fees" }),
      href: "/dashboard/invoices",
      icon: FileText,
    },
    {
      label: t({ bn: "আমার প্রোফাইল", en: "My Profile" }),
      href: "/dashboard/profile",
      icon: UserCog,
    },
  ];

  const handleLogout = () => {
    startLogoutTransition(async () => {
      const res = await logoutAction();
      if (res.success) {
        router.refresh();
        router.push("/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-fg flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden flex h-16 items-center justify-between px-5 border-b border-border/10 bg-surface/60 backdrop-blur sticky top-0 z-40">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow">
            RA
          </span>
          <span className="text-sm font-semibold tracking-tight">Client Portal</span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="/dashboard/notifications"
            className="relative p-2 text-fg-soft hover:text-fg transition-colors"
          >
            <Bell className="h-5 w-5" />
            {initialUnreadCount > 0 && (
              <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 text-[10px] font-bold text-white px-1">
                {initialUnreadCount}
              </span>
            )}
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-fg-soft hover:text-fg border border-border/10 rounded-full"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border/10 bg-surface/40 backdrop-blur-lg min-h-screen sticky top-0 p-6 z-30">
        {/* Brand */}
        <div className="flex items-center justify-between mb-8 border-b border-border/5 pb-6">
          <a href="/" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
              RA
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">Rahat Ahmed</span>
              <span className="text-[10px] text-brand-500 uppercase font-bold tracking-widest mt-0.5">
                Client Portal
              </span>
            </div>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={t({ bn: "ওয়েবসাইট দেখুন", en: "View Live Site" })}
            className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-lg hover:bg-brand-500/5 transition-all"
          >
            <Globe className="h-4 w-4" />
          </a>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20"
                    : "text-fg-soft hover:bg-canvas-muted/40 hover:text-fg"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="border-t border-border/5 pt-6 mt-6 space-y-4">
          <a
            href="/dashboard/notifications"
            className={cn(
              "flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium transition-all",
              pathname === "/dashboard/notifications"
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20"
                : "text-fg-soft hover:bg-canvas-muted/40 hover:text-fg"
            )}
          >
            <span className="flex items-center gap-3">
              <Bell className="h-4 w-4" />
              {t({ bn: "নোটিফিকেশনস", en: "Notifications" })}
            </span>
            {initialUnreadCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 text-[10px] font-bold text-white px-1.5">
                {initialUnreadCount}
              </span>
            )}
          </a>

          <button
            onClick={handleLogout}
            disabled={isPendingLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-2xl text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/5 transition-all text-left"
          >
            {isPendingLogout ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            {t({ bn: "লগআউট", en: "Sign Out" })}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative flex flex-col w-[80%] max-w-sm h-full bg-canvas border-r border-border/10 p-6 pt-16 shadow-2xl z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Info */}
            <div className="flex items-center gap-3 mb-6 border-b border-border/5 pb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-500 font-bold">
                {profile.full_name?.slice(0, 2).toUpperCase() || <User className="h-4 w-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-fg">{profile.full_name}</span>
                <span className="text-[10px] text-brand-500 uppercase font-bold tracking-widest mt-0.5">
                  Client Account
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20"
                        : "text-fg-soft hover:bg-canvas-muted/40 hover:text-fg"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Logout button */}
            <div className="border-t border-border/5 pt-4 mt-4">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                disabled={isPendingLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-500/5 transition-all text-left"
              >
                {isPendingLogout ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <LogOut className="h-4 w-4 shrink-0" />
                )}
                {t({ bn: "লগআউট", en: "Sign Out" })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
