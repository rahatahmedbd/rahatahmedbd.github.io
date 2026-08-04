import { NextRequest } from "next/server";

import { requireAuthenticatedAccount } from "@/lib/backend/auth";
import { apiError, apiJson } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { createSupabaseAdminClient } from "@/services/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const account = await requireAuthenticatedAccount(request);
    const supabase = createSupabaseAdminClient();

    const { data: orders, error: ordersError } = await supabase
      .from("website_orders")
      .select("id")
      .or(`user_id.eq.${account.user.id},contact_email.eq.${account.email.toLowerCase()}`)
      .limit(100);

    if (ordersError) throw ordersError;

    const orderIds = (orders ?? []).map((order) => order.id);
    if (orderIds.length === 0) {
      return apiJson({ ok: true, files: [] });
    }

    const { data, error } = await supabase
      .from("project_files")
      .select("id, order_id, label, file_name, file_url, file_size, mime_type, created_at")
      .in("order_id", orderIds)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return apiJson({ ok: true, files: data ?? [] });
  } catch (error) {
    await logPlatformError("client.files.get", error);
    return apiError(error);
  }
}
