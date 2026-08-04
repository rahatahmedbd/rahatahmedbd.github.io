"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { usePlatformAuth } from "@/hooks/use-platform-auth";

interface ClientOrder {
  id: string;
  order_number: string;
  website_type_id: string;
  package_id: string;
  extras: string[];
  pricing: { total?: number; currency?: string } | null;
  status: string;
  progress_percent: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface ClientMessage {
  id: string;
  order_id: string;
  sender_role: string;
  message: string;
  created_at: string;
}

interface ClientFile {
  id: string;
  order_id: string;
  label: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }
  return payload;
}

const statusLabels: Record<string, string> = {
  new: "Received",
  confirmed: "Confirmed",
  planning: "Planning",
  design: "Design",
  development: "Development",
  review: "Review",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function ClientDashboard() {
  const auth = usePlatformAuth();
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await auth.getAccessToken();
    if (!token) throw new Error("Please sign in again.");
    return { Authorization: `Bearer ${token}` };
  }, [auth]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null,
    [orders, selectedOrderId],
  );

  const loadClientData = useCallback(async () => {
    if (!auth.user) return;
    setIsLoading(true);
    setStatus("");
    try {
      const headers = await authHeaders();
      const [ordersPayload, filesPayload] = await Promise.all([
        fetch("/api/client/orders", { headers }).then((response) =>
          readJsonResponse<{ orders: ClientOrder[] }>(response),
        ),
        fetch("/api/client/files", { headers }).then((response) =>
          readJsonResponse<{ files: ClientFile[] }>(response),
        ),
      ]);
      setOrders(ordersPayload.orders);
      setFiles(filesPayload.files);
      setSelectedOrderId((current) => current || ordersPayload.orders[0]?.id || "");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [auth.user, authHeaders]);

  const loadMessages = useCallback(
    async (orderId: string) => {
      if (!auth.user || !orderId) return;
      try {
        const headers = await authHeaders();
        const payload = await fetch(`/api/client/messages?orderId=${orderId}`, { headers }).then(
          (response) => readJsonResponse<{ messages: ClientMessage[] }>(response),
        );
        setMessages(payload.messages);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Could not load messages.");
      }
    },
    [auth.user, authHeaders],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadClientData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadClientData]);

  useEffect(() => {
    if (!selectedOrder?.id) return undefined;
    const timer = window.setTimeout(() => {
      void loadMessages(selectedOrder.id);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadMessages, selectedOrder?.id]);

  const sendMessage = async () => {
    if (!selectedOrder || !message.trim()) return;
    try {
      const headers = await authHeaders();
      const payload = await fetch("/api/client/messages", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder.id, message }),
      }).then((response) => readJsonResponse<{ message: ClientMessage }>(response));
      setMessages((current) => [...current, payload.message]);
      setMessage("");
      setStatus("Message sent.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not send message.");
    }
  };

  if (!auth.user) {
    return (
      <AuthPanel
        mode="compact"
        title="Client dashboard sign in"
        description="Sign in with the same email used in your website order to track progress."
      />
    );
  }

  return (
    <div className="space-y-8">
      <AuthPanel mode="compact" title="Client session" description="" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Client Dashboard</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Track website orders, view project progress, download files, send messages, and follow
            payment status from one modern portal.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/order">
            <Button variant="outline">New order</Button>
          </Link>
          <Button onClick={loadClientData} disabled={isLoading}>
            {isLoading ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
      </div>

      {status && (
        <Card variant="bordered" className="p-4 text-sm text-[var(--color-text-secondary)]">
          {status}
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-semibold">Your Orders</h2>
          <div className="mt-5 space-y-4">
            {orders.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center">
                <p className="text-[var(--color-text-secondary)]">
                  No stored orders found for {auth.user.email}. Submit an order or ask the admin to
                  link your email.
                </p>
                <Link href="/order" className="mt-4 inline-block">
                  <Button>Start website order</Button>
                </Link>
              </div>
            )}
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className={`block w-full rounded-2xl border p-5 text-left transition ${
                  selectedOrder?.id === order.id
                    ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5"
                    : "border-[var(--color-border)]"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">{order.order_number}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      {order.website_type_id} · {order.package_id}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[var(--color-brand-primary)]">
                    {statusLabels[order.status] ?? order.status}
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-[var(--color-neutral-200)]">
                  <div
                    className="h-2 rounded-full bg-[var(--color-brand-primary)]"
                    style={{ width: `${order.progress_percent}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--color-text-secondary)]">
                  <span>Progress: {order.progress_percent}%</span>
                  <span>Payment: {order.payment_status.replace("_", " ")}</span>
                  <span>Total: ৳{order.pricing?.total ?? 0}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <h2 className="text-2xl font-semibold">Project Updates</h2>
          {selectedOrder ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[var(--color-surface-hover)] p-4">
                <div className="text-sm text-[var(--color-text-tertiary)]">Current project</div>
                <div className="font-semibold">{selectedOrder.order_number}</div>
                <div className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Status tracking and realtime-ready message architecture are connected to Supabase.
                </div>
              </div>
              <div className="max-h-80 space-y-3 overflow-auto pr-1">
                {messages.length === 0 && (
                  <p className="text-sm text-[var(--color-text-tertiary)]">No messages yet.</p>
                )}
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-3 text-sm ${
                      item.sender_role === "client"
                        ? "bg-[var(--color-brand-primary)] text-white"
                        : "bg-[var(--color-surface-hover)]"
                    }`}
                  >
                    <div>{item.message}</div>
                    <div className="mt-1 text-xs opacity-70">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write a project message…"
              />
              <Button onClick={sendMessage} disabled={!message.trim()}>
                Send message
              </Button>
            </div>
          ) : (
            <p className="mt-5 text-sm text-[var(--color-text-tertiary)]">
              Select an order to view updates.
            </p>
          )}
        </Card>
      </div>

      <Card variant="elevated" className="p-6">
        <h2 className="text-2xl font-semibold">Downloads</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {files.length === 0 && (
            <p className="text-sm text-[var(--color-text-tertiary)]">No files have been shared yet.</p>
          )}
          {files.map((file) => (
            <a
              key={file.id}
              href={file.file_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-[var(--color-border)] p-4"
            >
              <div className="font-medium">{file.label || file.file_name}</div>
              <div className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                {file.mime_type ?? "file"} · {file.file_size ? `${Math.round(file.file_size / 1024)} KB` : ""}
              </div>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
