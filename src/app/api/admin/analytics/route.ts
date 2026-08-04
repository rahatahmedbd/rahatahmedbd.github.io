import { NextRequest } from "next/server";

import { requireAdminAccount } from "@/lib/backend/auth";
import { apiError, apiJson } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { createSupabaseAdminClient } from "@/services/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccount(request);
    const supabase = createSupabaseAdminClient();

    const [orders, media, content] = await Promise.all([
      supabase
        .from("website_orders")
        .select("status, payment_status, pricing, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("media_assets").select("id", { count: "exact", head: true }),
      supabase.from("content_entries").select("id", { count: "exact", head: true }),
    ]);

    if (orders.error) throw orders.error;
    if (media.error) throw media.error;
    if (content.error) throw content.error;

    const rows = orders.data ?? [];
    const statusCounts = rows.reduce<Record<string, number>>((accumulator, order) => {
      const status = String(order.status ?? "unknown");
      accumulator[status] = (accumulator[status] ?? 0) + 1;
      return accumulator;
    }, {});

    const potentialRevenue = rows.reduce((sum, order) => {
      const pricing = order.pricing as { total?: unknown } | null;
      return sum + (typeof pricing?.total === "number" ? pricing.total : 0);
    }, 0);

    const paidRevenue = rows.reduce((sum, order) => {
      const pricing = order.pricing as { total?: unknown } | null;
      return order.payment_status === "paid" && typeof pricing?.total === "number"
        ? sum + pricing.total
        : sum;
    }, 0);

    return apiJson({
      ok: true,
      analytics: {
        totalOrders: rows.length,
        statusCounts,
        potentialRevenue,
        paidRevenue,
        mediaAssets: media.count ?? 0,
        contentEntries: content.count ?? 0,
        recentOrders: rows.slice(0, 8),
      },
    });
  } catch (error) {
    await logPlatformError("admin.analytics.get", error);
    return apiError(error);
  }
}
