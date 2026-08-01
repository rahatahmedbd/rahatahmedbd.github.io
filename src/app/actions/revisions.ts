"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminAvailable } from "@/config/env";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Submit a project revision request.
 */
export async function createRevisionAction(input: {
  orderId: string;
  description: string;
  attachments?: { name: string; url: string; mimeType: string; sizeBytes: number }[];
}) {
  const { user, profile } = await getCurrentUser();
  if (!user || !profile) throw new Error("Unauthorized");

  try {
    const supabase = await getSupabaseServerClient();
    const { data: rev, error } = await supabase
      .from("revisions")
      .insert({
        order_id: input.orderId,
        client_id: user.id,
        description: input.description,
        attachments: input.attachments || [],
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Send a system notification to the Super Admin
    try {
      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      const { data: order } = await client
        .from("orders")
        .select("reference")
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
          type: "warning",
          title: `New Revision Request: ${order.reference}`,
          body: `${profile.full_name || "Client"} requested a revision on project ${order.reference}.`,
          link: `/admin/revisions?ref=${order.reference}`,
          is_read: false,
        });
      }
    } catch (notifErr) {
      console.error("Failed to generate revision notification:", notifErr);
    }

    revalidatePath("/dashboard/revisions");
    return { success: true, data: rev };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit revision request" };
  }
}

/**
 * Super Admin: Update revision status (Approve, Reject, Complete)
 */
export async function updateAdminRevisionAction(
  id: string,
  input: {
    status: "approved" | "rejected" | "completed";
    adminNotes?: string;
  }
) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", user.id)
      .single();

    if (profile?.role_id !== "super_admin" && profile?.role_id !== "admin") {
      throw new Error("Forbidden");
    }

    const { data: rev, error } = await supabase
      .from("revisions")
      .update({
        status: input.status,
        admin_notes: input.adminNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Send a system notification to the Client
    try {
      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      const { data: order } = await client
        .from("orders")
        .select("reference")
        .eq("id", rev.order_id)
        .single();

      if (order) {
        await client.from("notifications").insert({
          user_id: rev.client_id,
          type: input.status === "approved" ? "success" : "info",
          title: `Revision Request ${input.status.toUpperCase()}: ${order.reference}`,
          body: `Admin marked your revision request as ${input.status}. Notes: ${input.adminNotes || "None"}`,
          link: `/dashboard/revisions`,
          is_read: false,
        });
      }
    } catch (notifErr) {
      console.error("Failed to generate revision update notification:", notifErr);
    }

    revalidatePath("/dashboard/revisions");
    return { success: true, data: rev };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update revision" };
  }
}
