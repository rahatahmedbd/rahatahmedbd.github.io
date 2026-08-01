"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Route protection helper for Business actions.
 */
async function requireCmsAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, role_id")
    .eq("id", user.id)
    .single();

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role_id === "super_admin" ||
    profile?.role_id === "admin";

  if (!isAdmin) throw new Error("Forbidden");
  return user;
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. Lead Management (CRM) Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function createLeadAction(input: {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  status: "new" | "contacted" | "qualified" | "proposal_sent" | "won" | "lost";
  notes?: string;
}) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        company_name: input.companyName || null,
        status: input.status,
        notes: input.notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/leads");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create lead" };
  }
}

export async function updateLeadAction(
  id: string,
  input: {
    name: string;
    email: string;
    phone?: string;
    companyName?: string;
    status: string;
    notes?: string;
    followUpAt?: string;
  }
) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .update({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        company_name: input.companyName || null,
        status: input.status,
        notes: input.notes || null,
        follow_up_at: input.followUpAt || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/leads");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update lead" };
  }
}

export async function deleteLeadAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete lead" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. Proposal & Quote Generator Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function createQuoteAction(input: {
  orderId?: string;
  clientId: string;
  title: string;
  services: { name: string; cost: number }[];
  timeline?: string;
  pricing: number;
  notes?: string;
  terms?: string;
  status: "draft" | "sent" | "accepted" | "declined" | "converted";
}) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        order_id: input.orderId || null,
        client_id: input.clientId,
        title: input.title,
        services: input.services,
        timeline: input.timeline || null,
        pricing: input.pricing,
        notes: input.notes || null,
        terms: input.terms || null,
        status: input.status,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/quotes");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create quote" };
  }
}

export async function updateQuoteAction(
  id: string,
  input: {
    title: string;
    services: { name: string; cost: number }[];
    timeline?: string;
    pricing: number;
    notes?: string;
    terms?: string;
    status: string;
  }
) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("quotes")
      .update({
        title: input.title,
        services: input.services,
        timeline: input.timeline || null,
        pricing: input.pricing,
        notes: input.notes || null,
        terms: input.terms || null,
        status: input.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/quotes");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update quote" };
  }
}

export async function convertQuoteToProjectAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    
    // Select quote details
    const { data: quote, error: selectErr } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (selectErr) throw selectErr;

    // 1. Update quote status to 'converted'
    const { error: quoteUpdateErr } = await supabase
      .from("quotes")
      .update({ status: "converted", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (quoteUpdateErr) throw quoteUpdateErr;

    // 2. If it is attached to an order, update that order status to 'quote accepted' (begins project!)
    if (quote.order_id) {
      await supabase
        .from("orders")
        .update({
          status: "quote accepted",
          final_price: quote.pricing,
          final_delivery: quote.timeline,
        })
        .eq("id", quote.order_id);
    }

    revalidatePath("/admin/quotes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to convert quote to project" };
  }
}

export async function deleteQuoteAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/quotes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete quote" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. Invoice System Management Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function createInvoiceAction(input: {
  orderId?: string;
  clientId: string;
  number: string;
  amount: number;
  status: "draft" | "issued" | "paid" | "overdue" | "cancelled";
  issuedAt?: string;
  dueAt?: string;
}) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("invoices")
      .insert({
        order_id: input.orderId || null,
        client_id: input.clientId,
        number: input.number,
        amount: input.amount,
        status: input.status,
        issued_at: input.issuedAt || new Date().toISOString(),
        due_at: input.dueAt || null,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/invoices");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create invoice" };
  }
}

export async function updateInvoiceStatusAction(id: string, status: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("invoices")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/invoices");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update invoice" };
  }
}

export async function deleteInvoiceAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/invoices");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete invoice" };
  }
}
