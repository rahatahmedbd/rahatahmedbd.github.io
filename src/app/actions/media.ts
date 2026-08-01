"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Register a newly uploaded media asset in the database.
 */
export async function createFileAssetAction(input: {
  name: string;
  path: string; // Cloudinary Public ID
  publicUrl: string;
  sizeBytes?: number;
  mimeType?: string;
}) {
  const { user } = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("file_assets")
      .insert({
        owner_id: user.id,
        bucket: "cloudinary",
        path: input.path,
        name: input.name,
        mime_type: input.mimeType || "image/jpeg",
        size_bytes: input.sizeBytes || 0,
        public_url: input.publicUrl,
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    try {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "upload_media",
        meta: { name: input.name, url: input.publicUrl },
      });
    } catch {
      // ignore
    }

    revalidatePath("/admin/media");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register asset" };
  }
}

/**
 * List all registered media assets.
 */
export async function listFileAssetsAction() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("file_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to list media" };
  }
}

/**
 * Delete a media asset from the database.
 */
export async function deleteFileAssetAction(id: string) {
  const { user } = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("file_assets").delete().eq("id", id);
    if (error) throw error;

    // Log activity
    try {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "delete_media",
        meta: { id },
      });
    } catch {
      // ignore
    }

    revalidatePath("/admin/media");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete media asset" };
  }
}
