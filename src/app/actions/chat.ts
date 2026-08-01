"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminAvailable } from "@/config/env";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Send a message within a specific project conversation thread.
 */
export async function sendProjectMessageAction(input: {
  orderId: string;
  message: string;
  attachments?: { name: string; url: string; mimeType: string; sizeBytes: number }[];
}) {
  const { user, profile } = await getCurrentUser();
  if (!user || !profile) throw new Error("Unauthorized");

  try {
    const supabase = await getSupabaseServerClient();
    const { data: msg, error } = await supabase
      .from("project_messages")
      .insert({
        order_id: input.orderId,
        sender_id: user.id,
        message: input.message,
        attachments: input.attachments || [],
      })
      .select()
      .single();

    if (error) throw error;

    // Notify administrators of the incoming client message
    try {
      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      const { data: order } = await client
        .from("orders")
        .select("reference, client_info")
        .eq("id", input.orderId)
        .single();

      const { data: admins } = await client
        .from("profiles")
        .select("id")
        .in("role_id", ["super_admin", "admin"])
        .limit(1);

      if (admins && admins.length > 0 && order) {
        await client.from("notifications").insert({
          user_id: admins[0].id,
          type: "info",
          title: `New Message: ${order.reference}`,
          body: `${profile.full_name || "Client"} shared a message on project ${order.reference}.`,
          link: `/admin/messages?id=${input.orderId}`,
          is_read: false,
        });
      }
    } catch (notifErr) {
      console.error("Failed to generate message notification:", notifErr);
    }

    revalidatePath("/dashboard/messages");
    return { success: true, data: msg };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send message" };
  }
}
