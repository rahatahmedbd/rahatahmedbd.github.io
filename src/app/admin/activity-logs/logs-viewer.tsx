"use client";

import { useState } from "react";
import {
  History,
  Search,
  Filter,
  Eye,
  X,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Reveal } from "@/components/ui/reveal";

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  meta: any;
  created_at: string;
  profiles?: { full_name: string | null; email: string } | null;
}

interface ActivityLogsViewerProps {
  initialLogs: ActivityLog[];
}

export function ActivityLogsViewer({ initialLogs }: ActivityLogsViewerProps) {
  const { t, lang } = useLanguage();
  const [logs] = useState<ActivityLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");

  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // List of unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  // Filter & Search Logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.profiles?.full_name && log.profiles.full_name.toLowerCase().includes(search.toLowerCase())) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.ip_address && log.ip_address.includes(search)) ||
      (log.meta && JSON.stringify(log.meta).toLowerCase().includes(search.toLowerCase()));

    const matchesAction = filterAction === "all" || log.action === filterAction;

    // Date range filter
    let matchesDate = true;
    const logDate = new Date(log.created_at);
    const now = new Date();

    if (filterDateRange === "today") {
      matchesDate = logDate.toDateString() === now.toDateString();
    } else if (filterDateRange === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesDate = logDate >= sevenDaysAgo;
    } else if (filterDateRange === "month") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      matchesDate = logDate >= thirtyDaysAgo;
    }

    return matchesSearch && matchesAction && matchesDate;
  });

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
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <Reveal direction="fade">
        <div>
          <h1 className="text-display-sm font-bold tracking-tight">
            <span className="text-gradient">অ্যাক্টিভিটি লগ (Security Activity Logs)</span>
          </h1>
          <p className="text-sm text-fg-soft mt-1">
            সুপার এডমিন এবং অন্যান্য কর্মকর্তা দ্বারা সম্পন্নকৃত সমস্ত অ্যাকশন এবং আইপি লগ তদারকি করুন।
          </p>
        </div>
      </Reveal>

      {/* Filters & Search */}
      <Reveal delay={60}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs by admin name, IP, action, metadata..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all"
            />
          </div>

          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map((act) => (
              <option key={act} value={act}>
                {act.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="h-12 px-5 rounded-full border border-border/10 bg-surface/30 text-sm focus:border-brand-500 outline-none transition-all text-fg"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </Reveal>

      {/* Table view */}
      <Reveal delay={120}>
        <div className="card-surface rounded-3xl border border-border/10 bg-surface/20 shadow-lift overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/10 bg-canvas/30 text-fg-muted uppercase tracking-wider font-semibold text-xs">
                  <th className="p-4 pl-6">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5 text-fg-soft">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-canvas-muted/10 transition-colors">
                      <td className="p-4 pl-6 font-medium whitespace-nowrap">{formatDate(log.created_at)}</td>
                      <td className="p-4">
                        <p className="font-semibold text-fg">{log.profiles?.full_name || "System"}</p>
                        <p className="text-xs text-fg-muted">{log.profiles?.email || "system@arena.ai"}</p>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-500/10">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs">{log.ip_address || "127.0.0.1"}</td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center italic text-fg-muted">
                      কোনো অ্যাক্টিভিটি লগ পাওয়া যায়নি
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* View Metadata Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          {/* Backdrop */}
          <div onClick={() => setSelectedLog(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-canvas border border-border/15 p-6 sm:p-8 rounded-3xl shadow-2xl z-10 space-y-6">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-5 right-5 p-1.5 text-fg-soft border border-border/10 rounded-full hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-fg flex items-center gap-2">
                <History className="h-5 w-5 text-brand-500" />
                Action Details
              </h3>
              <p className="text-xs text-fg-soft mt-1">
                Security metadata payload captured at transaction runtime.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-canvas-muted rounded-xl border border-border/5">
                  <p className="text-fg-muted font-semibold uppercase tracking-wider">Timestamp</p>
                  <p className="text-fg font-medium mt-1">{formatDate(selectedLog.created_at)}</p>
                </div>
                <div className="p-3 bg-canvas-muted rounded-xl border border-border/5">
                  <p className="text-fg-muted font-semibold uppercase tracking-wider">Client IP</p>
                  <p className="text-fg font-mono font-medium mt-1">{selectedLog.ip_address || "127.0.0.1"}</p>
                </div>
              </div>

              <div className="p-4 bg-canvas-muted rounded-2xl border border-border/5 space-y-2 text-xs">
                <p className="text-fg-muted font-semibold uppercase tracking-wider">User Agent</p>
                <p className="text-fg leading-relaxed font-mono truncate" title={selectedLog.user_agent || "Unknown"}>
                  {selectedLog.user_agent || "Unknown"}
                </p>
              </div>

              <div className="p-4 bg-canvas-muted rounded-2xl border border-border/5 space-y-2 text-xs">
                <p className="text-fg-muted font-semibold uppercase tracking-wider">Captured Payload (Meta)</p>
                <pre className="text-brand-500 font-mono text-xs overflow-x-auto p-2 bg-canvas rounded-lg max-h-48 border border-border/5">
                  {JSON.stringify(selectedLog.meta, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 h-10 rounded-full border border-border/10 hover:bg-surface/50 text-sm font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
