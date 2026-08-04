"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlatformAuth } from "@/hooks/use-platform-auth";

interface AdminOrder {
  id: string;
  order_number: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  business_name: string | null;
  website_type_id: string;
  package_id: string;
  extras: string[];
  pricing: { total?: number; currency?: string } | null;
  status: string;
  progress_percent: number;
  payment_status: string;
  created_at: string;
}

interface AdminAnalytics {
  totalOrders: number;
  statusCounts: Record<string, number>;
  potentialRevenue: number;
  paidRevenue: number;
  mediaAssets: number;
  contentEntries: number;
}

interface ContentEntry {
  id?: string;
  resource: string;
  key: string;
  title: string;
  data: Record<string, unknown>;
  status: string;
}

interface MediaAsset {
  id: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
  width: number | null;
  height: number | null;
  created_at: string;
}

const resources = ["portfolio", "services", "pricing", "gallery", "achievements", "education", "contact"];
const orderStatuses = [
  "new",
  "confirmed",
  "planning",
  "design",
  "development",
  "review",
  "delivered",
  "completed",
  "cancelled",
];

async function readJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload;
}

export function AdminDashboard() {
  const auth = usePlatformAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [contentEntries, setContentEntries] = useState<ContentEntry[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [selectedResource, setSelectedResource] = useState(resources[0]);
  const [contentKey, setContentKey] = useState("homepage-note");
  const [contentTitle, setContentTitle] = useState("Homepage note");
  const [contentJson, setContentJson] = useState('{\n  "text": ""\n}');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);

  const authHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await auth.getAccessToken();
    if (!token) throw new Error("Please sign in again.");
    return { Authorization: `Bearer ${token}` };
  }, [auth]);

  const loadData = useCallback(async () => {
    if (!auth.user) return;
    setIsLoadingData(true);
    setStatus("");
    try {
      const headers = await authHeaders();
      const [analyticsPayload, ordersPayload, contentPayload, mediaPayload] = await Promise.all([
        fetch("/api/admin/analytics", { headers }).then((response) =>
          readJsonResponse<{ analytics: AdminAnalytics }>(response),
        ),
        fetch("/api/admin/orders", { headers }).then((response) =>
          readJsonResponse<{ orders: AdminOrder[] }>(response),
        ),
        fetch("/api/admin/content", { headers }).then((response) =>
          readJsonResponse<{ entries: ContentEntry[] }>(response),
        ),
        fetch("/api/admin/media", { headers }).then((response) =>
          readJsonResponse<{ media: MediaAsset[] }>(response),
        ),
      ]);
      setAnalytics(analyticsPayload.analytics);
      setOrders(ordersPayload.orders);
      setContentEntries(contentPayload.entries);
      setMedia(mediaPayload.media);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load admin data.");
    } finally {
      setIsLoadingData(false);
    }
  }, [auth.user, authHeaders]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const resourceEntries = useMemo(
    () => contentEntries.filter((entry) => entry.resource === selectedResource),
    [contentEntries, selectedResource],
  );

  const saveContent = async () => {
    try {
      const parsedData = JSON.parse(contentJson) as Record<string, unknown>;
      const headers = await authHeaders();
      const payload = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: [
            {
              resource: selectedResource,
              key: contentKey,
              title: contentTitle,
              data: parsedData,
              status: "published",
            },
          ],
        }),
      }).then((response) => readJsonResponse<{ entries: ContentEntry[] }>(response));
      setStatus("Content saved successfully.");
      setContentEntries((current) => [
        ...current.filter(
          (entry) => !(entry.resource === selectedResource && entry.key === contentKey),
        ),
        ...payload.entries,
      ]);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save content.");
    }
  };

  const updateOrderStatus = async (order: AdminOrder, nextStatus: string) => {
    try {
      const headers = await authHeaders();
      const progressPercent = nextStatus === "completed" ? 100 : Math.max(order.progress_percent, 10);
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: nextStatus, progressPercent }),
      }).then((response) => readJsonResponse(response));
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? { ...item, status: nextStatus, progress_percent: progressPercent }
            : item,
        ),
      );
      setStatus(`Order ${order.order_number} updated.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not update order.");
    }
  };

  const uploadMedia = async () => {
    if (!mediaFile) return;
    try {
      const headers = await authHeaders();
      const formData = new FormData();
      formData.append("file", mediaFile);
      formData.append("folder", `rahat-platform/${selectedResource}`);
      formData.append("altText", mediaFile.name);
      const payload = await fetch("/api/admin/media", {
        method: "POST",
        headers,
        body: formData,
      }).then((response) => readJsonResponse<{ media: MediaAsset }>(response));
      setMedia((current) => [payload.media, ...current]);
      setMediaFile(null);
      setStatus("Media uploaded to Cloudinary.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not upload media.");
    }
  };

  if (!auth.user) {
    return (
      <AuthPanel
        mode="compact"
        title="Admin sign in"
        description="Only approved administrators can manage platform content and orders."
      />
    );
  }

  return (
    <div className="space-y-8">
      <AuthPanel mode="compact" title="Admin session" description="" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Backend Admin Panel</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Manage orders, content, pricing, gallery assets, services, education, contact details,
            media uploads, and analytics from one secure surface.
          </p>
        </div>
        <Button onClick={loadData} disabled={isLoadingData}>
          {isLoadingData ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {status && (
        <Card variant="bordered" className="p-4 text-sm text-[var(--color-text-secondary)]">
          {status}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Metric label="Orders" value={analytics?.totalOrders ?? 0} />
        <Metric label="Pipeline" value={`৳${analytics?.potentialRevenue ?? 0}`} />
        <Metric label="Paid" value={`৳${analytics?.paidRevenue ?? 0}`} />
        <Metric label="Media" value={analytics?.mediaAssets ?? 0} />
        <Metric label="Content" value={analytics?.contentEntries ?? 0} />
        <Metric label="Active" value={Object.keys(analytics?.statusCounts ?? {}).length} />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-semibold">Website Orders</h2>
          <div className="mt-5 space-y-4">
            {orders.length === 0 && (
              <p className="text-sm text-[var(--color-text-tertiary)]">No backend orders found yet.</p>
            )}
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-[var(--color-border)] p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="font-semibold">{order.order_number}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      {order.contact_name} · {order.contact_email} · {order.contact_phone}
                    </div>
                    <div className="mt-2 text-sm">
                      {order.website_type_id} / {order.package_id} · ৳{order.pricing?.total ?? 0}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {orderStatuses.map((nextStatus) => (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() => updateOrderStatus(order, nextStatus)}
                        className={`rounded-full px-3 py-1 text-xs ${
                          order.status === nextStatus
                            ? "bg-[var(--color-brand-primary)] text-white"
                            : "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {nextStatus}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-[var(--color-neutral-200)]">
                  <div
                    className="h-2 rounded-full bg-[var(--color-brand-primary)]"
                    style={{ width: `${order.progress_percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-semibold">Content Management</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Store editable content without replacing the canonical portfolio fallback.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {resources.map((resource) => (
              <button
                key={resource}
                type="button"
                onClick={() => setSelectedResource(resource)}
                className={`rounded-xl px-3 py-2 text-sm capitalize ${
                  selectedResource === resource
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : "bg-[var(--color-surface-hover)]"
                }`}
              >
                {resource}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            <Input value={contentKey} onChange={(event) => setContentKey(event.target.value)} />
            <Input value={contentTitle} onChange={(event) => setContentTitle(event.target.value)} />
            <Textarea
              value={contentJson}
              onChange={(event) => setContentJson(event.target.value)}
              rows={8}
            />
            <Button onClick={saveContent}>Save {selectedResource}</Button>
          </div>
          <div className="mt-5 space-y-2">
            {resourceEntries.map((entry) => (
              <button
                key={`${entry.resource}:${entry.key}`}
                type="button"
                onClick={() => {
                  setContentKey(entry.key);
                  setContentTitle(entry.title);
                  setContentJson(JSON.stringify(entry.data, null, 2));
                }}
                className="block w-full rounded-xl border border-[var(--color-border)] p-3 text-left text-sm"
              >
                <span className="font-medium">{entry.title}</span>
                <span className="ml-2 text-[var(--color-text-tertiary)]">{entry.key}</span>
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-semibold">Cloudinary Media Upload</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Images, gallery assets, portfolio files, PDFs, and future videos are uploaded through
            the server so API secrets never reach the browser.
          </p>
          <div className="mt-5 space-y-4">
            <Input type="file" onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)} />
            <Button onClick={uploadMedia} disabled={!mediaFile}>
              Upload media
            </Button>
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-semibold">Recent Media</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {media.slice(0, 6).map((asset) => (
              <a
                key={asset.id}
                href={asset.secure_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-[var(--color-border)] p-3 text-sm"
              >
                <div className="truncate font-medium">{asset.public_id}</div>
                <div className="text-[var(--color-text-tertiary)]">
                  {asset.resource_type}/{asset.format} · {Math.round(asset.bytes / 1024)} KB
                </div>
              </a>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card variant="bordered" className="p-4">
      <div className="text-sm text-[var(--color-text-tertiary)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </Card>
  );
}
