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

    const { data, error } = await supabase
      .from("website_orders")
      .select(
        "id, order_number, website_type_id, package_id, extras, pricing, status, progress_percent, payment_status, created_at, updated_at",
      )
      .or(`user_id.eq.${account.user.id},contact_email.eq.${account.email.toLowerCase()}`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return apiJson({ ok: true, orders: data ?? [] });
  } catch (error) {
    await logPlatformError("client.orders.get", error);
    return apiError(error);
  }
}
