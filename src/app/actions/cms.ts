"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminAvailable } from "@/config/env";

/**
 * Log activity for CMS updates.
 */
async function logCmsActivity(action: string, meta: Record<string, any> = {}) {
  const headersList = headers();
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const userAgent = headersList.get("user-agent") || "unknown";

  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : supabase;
      await client.from("activity_logs").insert({
        user_id: user.id,
        action,
        ip_address: ipAddress,
        user_agent: userAgent,
        meta,
      });
    }
  } catch (err) {
    console.error("Failed to log CMS activity:", err);
  }
}

/**
 * Route protection helper for Server Actions.
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
   1. Portfolio / Project Management Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function createProjectAction(input: {
  slug: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  gallery_urls?: string | string[] | null;
  category_id?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  status: "draft" | "active" | "archived";
  featured?: boolean;
  sort_order?: number;
  tags?: string[] | null;
}) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        slug: input.slug,
        title: input.title,
        summary: input.summary || null,
        description: input.description || null,
        cover_image_url: input.cover_image_url || null,
        gallery_urls: JSON.stringify(input.gallery_urls || []),
        category_id: input.category_id || null,
        live_url: input.live_url || null,
        repo_url: input.repo_url || null,
        status: input.status,
        featured: input.featured ?? false,
        sort_order: input.sort_order ?? 0,
        tags: input.tags || [],
      })
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("create_project", { slug: input.slug, title: input.title });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create project" };
  }
}

export async function updateProjectAction(
  id: string,
  input: {
    slug: string;
    title: string;
    summary?: string | null;
    description?: string | null;
    cover_image_url?: string | null;
    gallery_urls?: string | string[] | null;
    category_id?: string | null;
    live_url?: string | null;
    repo_url?: string | null;
    status: "draft" | "active" | "archived";
    featured?: boolean;
    sort_order?: number;
    tags?: string[] | null;
  }
) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    
    // Parse gallery_urls
    let galleryString = "[]";
    if (input.gallery_urls) {
      galleryString = JSON.stringify(input.gallery_urls);
    } else if (typeof input.gallery_urls === "string") {
      galleryString = input.gallery_urls;
    }

    const { data, error } = await supabase
      .from("projects")
      .update({
        slug: input.slug,
        title: input.title,
        summary: input.summary || null,
        description: input.description || null,
        cover_image_url: input.cover_image_url || null,
        gallery_urls: galleryString,
        category_id: input.category_id || null,
        live_url: input.live_url || null,
        repo_url: input.repo_url || null,
        status: input.status,
        featured: input.featured ?? false,
        sort_order: input.sort_order ?? 0,
        tags: input.tags || [],
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("update_project", { id, slug: input.slug });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;

    await logCmsActivity("delete_project", { id });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete project" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. Services Management Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function createServiceAction(input: {
  title_en: string;
  title_bn: string;
  description_en?: string | null;
  description_bn?: string | null;
  icon?: string | null;
  sort_order?: number;
  is_enabled?: boolean;
}) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("services")
      .insert({
        title_en: input.title_en,
        title_bn: input.title_bn,
        description_en: input.description_en || null,
        description_bn: input.description_bn || null,
        icon: input.icon || "Sparkles",
        sort_order: input.sort_order ?? 0,
        is_enabled: input.is_enabled ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("create_service", { title: input.title_en });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create service" };
  }
}

export async function updateServiceAction(
  id: string,
  input: {
    title_en: string;
    title_bn: string;
    description_en?: string | null;
    description_bn?: string | null;
    icon?: string | null;
    sort_order?: number;
    is_enabled?: boolean;
  }
) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("services")
      .update({
        title_en: input.title_en,
        title_bn: input.title_bn,
        description_en: input.description_en || null,
        description_bn: input.description_bn || null,
        icon: input.icon || "Sparkles",
        sort_order: input.sort_order ?? 0,
        is_enabled: input.is_enabled ?? true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("update_service", { id, title: input.title_en });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update service" };
  }
}

export async function deleteServiceAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;

    await logCmsActivity("delete_service", { id });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete service" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. Testimonials Management Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function createTestimonialAction(input: {
  author_name: string;
  author_title?: string;
  author_avatar_url?: string;
  rating: number;
  content: string;
  status: "pending" | "approved" | "rejected";
}) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        author_name: input.author_name,
        author_title: input.author_title || null,
        author_avatar_url: input.author_avatar_url || null,
        rating: input.rating,
        content: input.content,
        status: input.status,
      })
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("create_testimonial", { author: input.author_name });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create testimonial" };
  }
}

export async function updateTestimonialAction(
  id: string,
  input: {
    author_name: string;
    author_title?: string;
    author_avatar_url?: string;
    rating: number;
    content: string;
    status: "pending" | "approved" | "rejected";
  }
) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("testimonials")
      .update({
        author_name: input.author_name,
        author_title: input.author_title || null,
        author_avatar_url: input.author_avatar_url || null,
        rating: input.rating,
        content: input.content,
        status: input.status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("update_testimonial", { id, author: input.author_name });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update testimonial" };
  }
}

export async function deleteTestimonialAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;

    await logCmsActivity("delete_testimonial", { id });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete testimonial" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. FAQ Management Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function createFaqAction(input: {
  question: string;
  answer: string;
  category: string;
  sort_order?: number;
  published?: boolean;
}) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("faqs")
      .insert({
        question: input.question,
        answer: input.answer,
        category: input.category,
        sort_order: input.sort_order ?? 0,
        published: input.published ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("create_faq", { question: input.question.slice(0, 30) });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create FAQ" };
  }
}

export async function updateFaqAction(
  id: string,
  input: {
    question: string;
    answer: string;
    category: string;
    sort_order?: number;
    published?: boolean;
  }
) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("faqs")
      .update({
        question: input.question,
        answer: input.answer,
        category: input.category,
        sort_order: input.sort_order ?? 0,
        published: input.published ?? true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("update_faq", { id, question: input.question.slice(0, 30) });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update FAQ" };
  }
}

export async function deleteFaqAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;

    await logCmsActivity("delete_faq", { id });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete FAQ" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. General Settings Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function saveSettingsAction(key: string, value: any) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("settings")
      .upsert({
        key,
        value,
      })
      .select()
      .single();

    if (error) throw error;

    await logCmsActivity("save_settings", { key });
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save settings" };
  }
}

export async function updateAdminProfilePhotoAction(avatarUrl: string) {
  const user = await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (error) throw error;

    await logCmsActivity("update_profile_photo", { avatarUrl });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile photo" };
  }
}

export async function updateAdminNameAction(fullName: string, phone?: string) {
  const user = await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone: phone || null })
      .eq("id", user.id);

    if (error) throw error;

    await logCmsActivity("update_profile_name", { fullName });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile details" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   6. Notification Management Actions
   ───────────────────────────────────────────────────────────────────────────── */

export async function markNotificationReadAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/notifications");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update notification" };
  }
}

export async function markAllNotificationsReadAction() {
  const user = await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) throw error;

    revalidatePath("/admin/notifications");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to clear notifications" };
  }
}

export async function deleteNotificationAction(id: string) {
  await requireCmsAdmin();
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/notifications");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete notification" };
  }
}
