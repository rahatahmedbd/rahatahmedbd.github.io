import { NextRequest } from "next/server";

import { requireAdminAccount } from "@/lib/backend/auth";
import { contentUpdateSchema, adminResourceSchema } from "@/lib/backend/content";
import { apiError, apiJson } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { createSupabaseAdminClient } from "@/services/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccount(request);
    const supabase = createSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    const resourceParam = searchParams.get("resource");
    const resource = resourceParam ? adminResourceSchema.parse(resourceParam) : null;

    let query = supabase
      .from("content_entries")
      .select("id, resource, key, title, data, status, updated_at")
      .order("resource", { ascending: true })
      .order("key", { ascending: true });

    if (resource) {
      query = query.eq("resource", resource);
    }

    const { data, error } = await query;
    if (error) throw error;

    return apiJson({ ok: true, entries: data ?? [] });
  } catch (error) {
    await logPlatformError("admin.content.get", error);
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const account = await requireAdminAccount(request);
    const payload = contentUpdateSchema.parse(await request.json());
    const supabase = createSupabaseAdminClient();

    const rows = payload.entries.map((entry) => ({
      resource: entry.resource,
      key: entry.key,
      title: entry.title,
      data: entry.data,
      status: entry.status,
      updated_by: account.user.id,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("content_entries")
      .upsert(rows, { onConflict: "resource,key" })
      .select("id, resource, key, title, status, updated_at");

    if (error) throw error;

    return apiJson({ ok: true, entries: data ?? [] });
  } catch (error) {
    await logPlatformError("admin.content.put", error);
    return apiError(error);
  }
}
