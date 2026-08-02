"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminAvailable } from "@/config/env";

/**
 * Generate a unique random capitalized alphanumeric reference.
 */
function generateOrderReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "ORD-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

/**
 * Public/Client Order Submission Action
 */
export async function submitProjectOrderAction(input: {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  country: string;
  websiteType: string;
  requiredFeatures: string[];
  designPreference: string[];
  budgetOption: string;
  deadlineOption: string;
  projectDetails: string;
  uploadedFiles: { name: string; url: string; mimeType: string; sizeBytes: number }[];
  estimatedCost: number;
  estimatedDelivery: string;
}) {
  try {
    const supabase = await getSupabaseServerClient();
    const reference = generateOrderReference();

    // Check if there is an authenticated user session to associate client_id
    const { data: { user } } = await supabase.auth.getUser();
    const clientId = user?.id || null;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        reference,
        client_id: clientId,
        status: "pending",
        total_amount: input.estimatedCost,
        currency: "USD",
        notes: input.projectDetails,
        client_info: {
          fullName: input.fullName,
          companyName: input.companyName || null,
          email: input.email,
          phone: input.phone,
          country: input.country,
        },
        website_type: input.websiteType,
        required_features: input.requiredFeatures,
        design_preference: input.designPreference,
        budget_option: input.budgetOption,
        deadline_option: input.deadlineOption,
        project_details: input.projectDetails,
        uploaded_files: input.uploadedFiles,
        estimated_cost: input.estimatedCost,
        estimated_delivery: input.estimatedDelivery,
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger an internal system notification for the Super Admin
    try {
      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      
      // Select first admin/super_admin user to associate the notification to
      const { data: admins } = await client
        .from("profiles")
        .select("id")
        .in("role_id", ["super_admin", "admin"])
        .limit(1);

      if (admins && admins.length > 0) {
        await client.from("notifications").insert({
          user_id: admins[0].id,
          type: "info",
          title: `New Project Request: ${reference}`,
          body: `${input.fullName} requested a ${input.websiteType} website with budget ${input.budgetOption}.`,
          link: `/admin/orders?ref=${reference}`,
          is_read: false,
        });
      }
    } catch (notifErr) {
      console.error("Failed to generate order notification:", notifErr);
    }

    revalidatePath("/admin");
    return { success: true, reference, order };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit project order" };
  }
}

/**
 * Public Consultation & Custom Quote Request Action
 */
export async function submitConsultationRequestAction(input: {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  meetingDate?: string;
  meetingTime?: string;
  requestType: "consultation" | "meeting" | "message" | "custom_quote";
  notes: string;
}) {
  try {
    const supabase = await getSupabaseServerClient();

    // 1. Insert into leads CRM table
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .insert({
        name: input.fullName,
        email: input.email,
        phone: input.phone || null,
        company_name: input.companyName || null,
        status: "new",
        notes: `[${input.requestType.toUpperCase()}] ${input.notes} ${
          input.meetingDate ? `| Preferred Meeting: ${input.meetingDate} at ${input.meetingTime}` : ""
        }`,
      })
      .select()
      .single();

    if (leadErr) {
      console.warn("Leads table insert warning, falling back to messages:", leadErr.message);
      // Fallback insert into messages table if leads schema isn't accessible to public RLS
      await supabase.from("messages").insert({
        name: input.fullName,
        email: input.email,
        phone: input.phone || null,
        subject: `Live Consultation Request (${input.requestType})`,
        body: `${input.notes} | Meeting: ${input.meetingDate || "N/A"} ${input.meetingTime || ""}`,
        is_read: false,
      });
    }

    // 2. Notify Super Admin Panel
    try {
      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      const { data: admins } = await client
        .from("profiles")
        .select("id")
        .in("role_id", ["super_admin", "admin"])
        .limit(1);

      if (admins && admins.length > 0) {
        await client.from("notifications").insert({
          user_id: admins[0].id,
          type: "info",
          title: `New Consultation Request: ${input.fullName}`,
          body: `${input.fullName} requested a ${input.requestType.replace("_", " ")}.`,
          link: `/admin/leads`,
          is_read: false,
        });
      }
    } catch {
      // ignore
    }

    revalidatePath("/admin");
    return { success: true, lead };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit consultation request" };
  }
}

/**
 * Super Admin: Update order parameters (price, status, delivery date, notes, etc.)
 */
export async function updateAdminOrderAction(
  id: string,
  input: {
    status: string;
    finalPrice?: number;
    finalDelivery?: string;
    isPriority?: boolean;
    internalNotes?: string;
    internalFiles?: { name: string; url: string; mimeType: string; sizeBytes: number }[];
  }
) {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Auth route guard inside Server Action
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

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: input.status,
        final_price: input.finalPrice !== undefined ? input.finalPrice : null,
        final_delivery: input.finalDelivery !== undefined ? input.finalDelivery : null,
        is_priority: input.isPriority ?? false,
        internal_notes: input.internalNotes || null,
        internal_files: input.internalFiles || [],
        // Sync original total_amount field if finalPrice is assigned
        total_amount: input.finalPrice !== undefined ? input.finalPrice : 0,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log the update
    try {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "update_order",
        meta: { id, reference: order.reference, status: input.status },
      });
    } catch {
      // ignore
    }

    revalidatePath("/admin");
    return { success: true, data: order };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update order" };
  }
}

/**
 * Super Admin: Delete an order record
 */
export async function deleteAdminOrderAction(id: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;

    // Log deletion
    try {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "delete_order",
        meta: { id },
      });
    } catch {
      // ignore
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete order" };
  }
}
