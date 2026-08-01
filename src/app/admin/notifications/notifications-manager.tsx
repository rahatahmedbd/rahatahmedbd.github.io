"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Loader2,
  CheckSquare,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
} from "@/app/actions/cms";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationsManagerProps {
  initialNotifications: Notification[];
}

export function NotificationsManager({ initialNotifications }: NotificationsManagerProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      const res = await markNotificationReadAction(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        router.refresh();
      }
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const res = await markAllNotificationsReadAction();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        router.refresh();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteNotificationAction(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        router.refresh();
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />;
      case "error":
        return <XCircle className="h-5 w-5 text-brand-500 shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
    }
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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-6">
          <div>
            <h1 className="text-display-sm font-bold tracking-tight">
              <span className="text-gradient">নোটিফিকেশনস (System Notifications)</span>
            </h1>
            <p className="text-sm text-fg-soft mt-1">
              ওয়েবসাইটের নতুন মেসেজ, রিভিউ সাবমিশন বা সার্ভার ত্রুটি সম্পর্কিত রিয়েল-টাইম এলার্ট দেখুন।
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={isPending}
              className="flex items-center gap-2 rounded-full border border-border/10 hover:border-brand-500/20 hover:bg-brand-500/5 text-fg-soft hover:text-fg px-4 h-10 text-xs font-semibold transition-all self-start"
            >
              <CheckSquare className="h-4 w-4 text-brand-500" />
              Mark All as Read
            </button>
          )}
        </div>
      </Reveal>

      {/* List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif, idx) => (
            <Reveal key={notif.id} delay={idx * 30} direction="fade">
              <div
                className={`card-surface p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  notif.is_read
                    ? "bg-surface/10 border-border/5 opacity-75"
                    : "bg-brand-500/5 border-brand-500/15"
                }`}
              >
                {/* Type Icon */}
                {getTypeIcon(notif.type)}

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h4
                      className={`text-sm font-bold text-fg leading-tight truncate ${
                        !notif.is_read && "text-brand-500"
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {!notif.is_read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    )}
                  </div>
                  {notif.body && (
                    <p className="text-xs text-fg-soft leading-relaxed">{notif.body}</p>
                  )}
                  <p className="text-[10px] text-fg-muted font-medium pt-1">
                    {formatDate(notif.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 ml-4 self-center">
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      disabled={isPending}
                      className="p-1.5 text-emerald-500 hover:bg-emerald-500/5 border border-border/10 rounded-full transition-all"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    disabled={isPending}
                    className="p-1.5 text-fg-soft hover:text-brand-500 border border-border/10 rounded-full hover:bg-brand-500/5 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))
        ) : (
          <Reveal direction="fade">
            <div className="card-surface border border-border/10 rounded-3xl bg-surface/10 p-12 text-center text-fg-muted italic text-sm">
              <Bell className="h-10 w-10 text-border mx-auto mb-3" />
              কোনো নোটিফিকেশন পাওয়া যায়নি
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
