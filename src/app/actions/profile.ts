"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Update current authenticated client's name and contact phone.
 */
export async function updateClientDetailsAction(input: {
  fullName: string;
  phone?: string;
}) {
  const { user } = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: input.fullName,
        phone: input.phone || null,
      })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile details" };
  }
}

/**
 * Update current authenticated client's avatar image URL.
 */
export async function updateClientAvatarAction(avatarUrl: string) {
  const { user } = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile avatar" };
  }
}
