import { NextRequest } from "next/server";

import { requireAdminAccount } from "@/lib/backend/auth";
import { apiError, apiJson } from "@/lib/backend/http";
import { logPlatformError } from "@/lib/backend/logger";
import { createSupabaseAdminClient } from "@/services/supabase/server";
import { uploadMediaBuffer } from "@/services/cloudinary/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_MIME_PREFIXES = ["image/", "video/", "application/pdf"];

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccount(request);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("media_assets")
      .select(
        "id, public_id, url, secure_url, resource_type, format, bytes, width, height, folder, alt_text, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return apiJson({ ok: true, media: data ?? [] });
  } catch (error) {
    await logPlatformError("admin.media.get", error);
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const account = await requireAdminAccount(request);
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "rahat-platform/media");
    const altText = String(formData.get("altText") ?? "").trim();

    if (!(file instanceof File)) {
      return apiJson({ error: "A media file is required." }, { status: 422 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiJson({ error: "File exceeds the 25 MB upload limit." }, { status: 413 });
    }

    const isAllowed = ALLOWED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix));
    if (!isAllowed) {
      return apiJson({ error: "Unsupported file type." }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await uploadMediaBuffer(buffer, {
      folder,
      resourceType: file.type.startsWith("video/") ? "video" : "auto",
      tags: ["admin-upload"],
    });

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("media_assets")
      .insert({
        public_id: upload.public_id,
        asset_id: upload.asset_id,
        url: upload.url,
        secure_url: upload.secure_url,
        resource_type: upload.resource_type,
        format: upload.format,
        bytes: upload.bytes,
        width: upload.width,
        height: upload.height,
        folder,
        alt_text: altText || null,
        uploaded_by: account.user.id,
        metadata: upload,
      })
      .select("id, public_id, secure_url, resource_type, format, bytes, width, height, created_at")
      .single();

    if (error) throw error;

    return apiJson({ ok: true, media: data }, { status: 201 });
  } catch (error) {
    await logPlatformError("admin.media.post", error);
    return apiError(error);
  }
}
