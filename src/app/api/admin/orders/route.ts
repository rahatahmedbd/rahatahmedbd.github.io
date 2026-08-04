import { NextRequest } from "next/server";

import { requireAdminAccount } from "@/lib/backend/auth";
import { apiError, apiJson } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { orderUpdateSchema } from "@/lib/order-validation";
import { createSupabaseAdminClient } from "@/services/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccount(request);
    const supabase = createSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("website_orders")
      .select(
        "id, order_number, contact_name, contact_email, contact_phone, business_name, website_type_id, package_id, extras, pricing, status, progress_percent, payment_status, created_at, updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return apiJson({ ok: true, orders: data ?? [] });
  } catch (error) {
    await logPlatformError("admin.orders.get", error);
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const account = await requireAdminAccount(request);
    const update = orderUpdateSchema.parse(await request.json());
    const supabase = createSupabaseAdminClient();

    const values = {
      ...(update.status ? { status: update.status } : {}),
      ...(typeof update.progressPercent === "number"
        ? { progress_percent: update.progressPercent }
        : {}),
      ...(update.paymentStatus ? { payment_status: update.paymentStatus } : {}),
      ...(typeof update.adminNotes === "string" ? { admin_notes: update.adminNotes } : {}),
      updated_by: account.user.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("website_orders")
      .update(values)
      .eq("id", update.id)
      .select("id, order_number, status, progress_percent, payment_status, updated_at")
      .single();

    if (error) throw error;

    await supabase.from("order_events").insert({
      order_id: update.id,
      actor_id: account.user.id,
      event_type: "order.updated",
      payload: values,
    });

    return apiJson({ ok: true, order: data });
  } catch (error) {
    await logPlatformError("admin.orders.patch", error);
    return apiError(error);
  }
}
