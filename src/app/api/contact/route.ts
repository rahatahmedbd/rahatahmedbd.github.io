import { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiJson } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { checkRateLimit, pruneRateLimitBuckets } from "@/lib/backend/rate-limit";
import { createSupabaseServerClient } from "@/services/supabase/server";

export const runtime = "nodejs";

const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: z.string().trim().toLowerCase().email("Please provide a valid email.").max(320),
  message: z.string().trim().min(1, "Message is required.").max(5000),
});

/**
 * POST /api/contact
 * Public endpoint used by the portfolio contact form. Inserts a row into
 * public.contact_messages using the anon-key server client — the table's RLS
 * policy allows anonymous inserts but no public reads (admins only).
 */
export async function POST(request: NextRequest) {
  try {
    pruneRateLimitBuckets();

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const limit = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return apiJson({ error: "Too many messages. Please try again later." }, { status: 429 });
    }

    const payload = contactMessageSchema.parse(await request.json());

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: payload.name,
      email: payload.email,
      message: payload.message,
    });

    if (error) {
      throw error;
    }

    return apiJson({ ok: true }, { status: 201 });
  } catch (error) {
    await logPlatformError("contact.post", error);
    return apiError(error);
  }
}
