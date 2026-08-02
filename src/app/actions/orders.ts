"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminAvailable } from "@/config/env";

/** Collision-resistant order reference. */
function generateOrderReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "ORD-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export interface ProjectOrderInput {
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
}

export interface ProjectOrderResult {
  success: boolean;
  reference?: string;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Server-side validation. The UI validates too, but never trust the client. */
function validateOrderInput(input: ProjectOrderInput): string | null {
  if (!input.fullName?.trim() || input.fullName.trim().length < 2)
    return "Please enter your full name.";
  if (!input.email?.trim() || !EMAIL_RE.test(input.email.trim()))
    return "Please enter a valid email address.";
  if (!input.phone?.trim() || input.phone.replace(/\D/g, "").length < 6)
    return "Please enter a valid phone number.";
  if (!input.websiteType?.trim()) return "Please choose a website type.";
  return null;
}

/**
 * Public / client project order submission.
 *
 * Guest submissions are supported (client_id stays null). We deliberately do
 * NOT chain `.select().single()` onto the insert: the SELECT policy on
 * `orders` restricts rows to the owning client or an admin, so a guest insert
 * returns zero rows through RETURNING and PostgREST reports a failure even
 * though the row was written. We generate the reference here instead and
 * return it directly.
 */
export async function submitProjectOrderAction(
  input: ProjectOrderInput
): Promise<ProjectOrderResult> {
  const validationError = validateOrderInput(input);
  if (validationError) return { success: false, error: validationError };

  let supabase;
  try {
    supabase = await getSupabaseServerClient();
  } catch {
    return {
      success: false,
      error:
        "Ordering is temporarily unavailable. Please email rahatbd20505@gmail.com and we will pick it up right away.",
    };
  }

  let clientId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    clientId = user?.id ?? null;
  } catch {
    clientId = null;
  }

  const estimatedCost = Number.isFinite(input.estimatedCost)
    ? Math.max(0, Math.round(input.estimatedCost))
    : 0;

  // Retry guards against the (astronomically unlikely) reference collision.
  let reference = "";
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    reference = generateOrderReference();

    const { error } = await supabase.from("orders").insert({
      reference,
      client_id: clientId,
      status: "pending",
      total_amount: estimatedCost,
      currency: "USD",
      notes: input.projectDetails?.slice(0, 5000) || null,
      client_info: {
        fullName: input.fullName.trim(),
        companyName: input.companyName?.trim() || null,
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        country: input.country?.trim() || null,
      },
      website_type: input.websiteType,
      required_features: input.requiredFeatures ?? [],
      design_preference: input.designPreference ?? [],
      budget_option: input.budgetOption || null,
      deadline_option: input.deadlineOption || null,
      project_details: input.projectDetails?.slice(0, 5000) || null,
      uploaded_files: input.uploadedFiles ?? [],
      estimated_cost: estimatedCost,
      estimated_delivery: input.estimatedDelivery || null,
    });

    if (!error) {
      lastError = null;
      break;
    }

    // 23505 = unique violation on `reference` -> retry with a new one.
    if ((error as { code?: string }).code === "23505") {
      lastError = error.message;
      continue;
    }

    return {
      success: false,
      error:
        "We could not save your request. Please check your details and try again, or email rahatbd20505@gmail.com.",
    };
  }

  if (lastError) {
    return {
      success: false,
      error: "We could not save your request. Please try again in a moment.",
    };
  }

  // Notify admins. Best-effort only: a notification failure must never turn a
  // successfully saved order into a failed submission for the visitor.
  void notifyAdmins(
    supabase,
    `New Project Request: ${reference}`,
    `${input.fullName} requested a ${input.websiteType} website (budget ${
      input.budgetOption || "unspecified"
    }).`,
    `/admin/orders?ref=${reference}`
  );

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { success: true, reference };
}

/** Best-effort admin notification fan-out. Never throws. */
async function notifyAdmins(
  fallbackClient: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  title: string,
  body: string,
  link: string
) {
  try {
    const client = isSupabaseAdminAvailable
      ? getSupabaseAdminClient()
      : fallbackClient;

    const { data: admins } = await client
      .from("profiles")
      .select("id")
      .in("role_id", ["super_admin", "admin"])
      .limit(5);

    if (!admins?.length) return;

    await client.from("notifications").insert(
      admins.map((a: { id: string }) => ({
        user_id: a.id,
        type: "info",
        title,
        body,
        link,
        is_read: false,
      }))
    );
  } catch {
    // Intentionally silent.
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
      // Fallback to messages if the leads table is not reachable under public RLS.
      await supabase.from("messages").insert({
        name: input.fullName,
        email: input.email,
        phone: input.phone || null,
        subject: `Live Consultation Request (${input.requestType})`,
        body: `${input.notes} | Meeting: ${input.meetingDate || "N/A"} ${input.meetingTime || ""}`,
        is_read: false,
      });
    }

    void notifyAdmins(
      supabase,
      `New Consultation Request: ${input.fullName}`,
      `${input.fullName} requested a ${input.requestType.replace("_", " ")}.`,
      "/admin/leads"
    );

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
 * Client: Update own project's uploaded files (File Vault)
 * Allows clients to manage their own requirement files.
 * Syncs instantly to Admin Panel via notification + activity log.
 */
export async function updateClientOrderFilesAction(
  id: string,
  input: {
    uploadedFiles: { name: string; url: string; mimeType: string; sizeBytes: number }[];
  }
) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Verify ownership (client_id or email)
    const { data: order, error: fetchErr } = await supabase.from("orders").select("id, client_id, client_info, reference, status").eq("id", id).single();
    if (fetchErr) throw fetchErr;

    const isOwner =
      order.client_id === user.id ||
      (order.client_info as any)?.email === user.email;

    if (!isOwner) {
      // allow admin override but already checked inside file vault as client
      const { data: profile } = await supabase.from("profiles").select("role_id").eq("id", user.id).single();
      if (profile?.role_id !== "super_admin" && profile?.role_id !== "admin") {
        throw new Error("Forbidden: Not owner");
      }
    }

    // Only allow file updates when status pending (or allow always but log)
    const { data: updated, error } = await supabase
      .from("orders")
      .update({ uploaded_files: input.uploadedFiles })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log activity + notify admin
    try {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action: "client_upload_file",
        meta: { id, reference: order.reference, filesCount: input.uploadedFiles.length, status: order.status },
      });

      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      const { data: admins } = await client.from("profiles").select("id").in("role_id", ["super_admin", "admin"]).limit(1);
      if (admins && admins.length > 0) {
        await client.from("notifications").insert({
          user_id: admins[0].id,
          type: "info",
          title: `Client File Upload: ${order.reference}`,
          body: `Client uploaded ${input.uploadedFiles.length} file(s) to mission ${order.reference}.`,
          link: `/admin/orders?ref=${order.reference}`,
          is_read: false,
        });
      }
    } catch {
      // ignore log errors
    }

    revalidatePath("/dashboard/files");
    revalidatePath("/admin/orders");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update files" };
  }
}

/**
 * Client: Approve milestone or request revision from Approval Bay
 * Creates activity log + admin notification instantly.
 */
export async function clientApprovalAction(
  orderId: string,
  input: {
    milestoneId: string;
    action: "approve" | "revision";
    feedback?: string;
  }
) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: order } = await supabase.from("orders").select("reference, client_id, client_info").eq("id", orderId).single();
    if (!order) throw new Error("Order not found");

    const isOwner = order.client_id === user.id || (order.client_info as any)?.email === user.email;
    if (!isOwner) {
      const { data: profile } = await supabase.from("profiles").select("role_id").eq("id", user.id).single();
      if (profile?.role_id !== "super_admin" && profile?.role_id !== "admin") throw new Error("Forbidden");
    }

    // Log approval action
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: input.action === "approve" ? "client_approve_milestone" : "client_request_revision",
      meta: { orderId, reference: order.reference, milestoneId: input.milestoneId, feedback: input.feedback || null },
    });

    // Notify admin
    try {
      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      const { data: admins } = await client.from("profiles").select("id").in("role_id", ["super_admin", "admin"]).limit(1);
      if (admins && admins.length > 0) {
        await client.from("notifications").insert({
          user_id: admins[0].id,
          type: input.action === "approve" ? "success" : "warning",
          title: input.action === "approve" ? `Milestone Approved: ${order.reference}` : `Revision Requested: ${order.reference}`,
          body: input.action === "approve"
            ? `Client approved milestone ${input.milestoneId} for ${order.reference}.`
            : `Client requested revision on ${input.milestoneId}: ${input.feedback?.slice(0,120) || "No feedback"}`,
          link: `/admin/orders?ref=${order.reference}`,
          is_read: false,
        });
      }
    } catch {}

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Approval action failed" };
  }
}

/**
 * Client: Request meeting / support escalation from Support AI
 */
export async function clientMeetingRequestAction(input: {
  orderId?: string;
  type: "meeting" | "support";
  notes: string;
}) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action: input.type === "meeting" ? "client_request_meeting" : "client_contact_support",
      meta: { orderId: input.orderId || null, notes: input.notes },
    });

    const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
    const { data: admins } = await client.from("profiles").select("id").in("role_id", ["super_admin", "admin"]).limit(1);
    if (admins && admins.length > 0) {
      await client.from("notifications").insert({
        user_id: admins[0].id,
        type: "info",
        title: input.type === "meeting" ? "New Meeting Request" : "Support Request",
        body: input.notes.slice(0,180),
        link: input.orderId ? `/admin/orders?ref=${input.orderId}` : "/admin/leads",
        is_read: false,
      });
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Request failed" };
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
