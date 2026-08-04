import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAuthenticatedAccount } from "@/lib/backend/auth";
import { apiError, apiJson } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { checkRateLimit, pruneRateLimitBuckets } from "@/lib/backend/rate-limit";
import { createSupabaseAdminClient } from "@/services/supabase/server";

export const runtime = "nodejs";

const orderIdSchema = z.string().uuid();
const messageSchema = z.object({
  orderId: z.string().uuid(),
  message: z.string().trim().min(1).max(2_000),
});

async function assertOrderAccess(orderId: string, userId: string, email: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("website_orders")
    .select("id")
    .eq("id", orderId)
    .or(`user_id.eq.${userId},contact_email.eq.${email.toLowerCase()}`)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("Order not found.");
  }
}

export async function GET(request: NextRequest) {
  try {
    const account = await requireAuthenticatedAccount(request);
    const { searchParams } = new URL(request.url);
    const orderId = orderIdSchema.parse(searchParams.get("orderId"));
    await assertOrderAccess(orderId, account.user.id, account.email);

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("order_messages")
      .select("id, order_id, sender_id, sender_role, message, created_at")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return apiJson({ ok: true, messages: data ?? [] });
  } catch (error) {
    await logPlatformError("client.messages.get", error);
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    pruneRateLimitBuckets();
    const account = await requireAuthenticatedAccount(request);
    const limit = checkRateLimit(`message:${account.user.id}`, 20, 60 * 60 * 1000);
    if (!limit.allowed) {
      return apiJson({ error: "Message limit reached. Please try again later." }, { status: 429 });
    }

    const payload = messageSchema.parse(await request.json());
    await assertOrderAccess(payload.orderId, account.user.id, account.email);

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("order_messages")
      .insert({
        order_id: payload.orderId,
        sender_id: account.user.id,
        sender_role: "client",
        message: payload.message,
      })
      .select("id, order_id, sender_role, message, created_at")
      .single();

    if (error) throw error;

    await supabase.from("notification_jobs").insert({
      event_type: "message.created",
      channel: "internal",
      recipient: "admin",
      payload: { orderId: payload.orderId, messageId: data.id },
    });

    return apiJson({ ok: true, message: data }, { status: 201 });
  } catch (error) {
    await logPlatformError("client.messages.post", error);
    return apiError(error);
  }
}
