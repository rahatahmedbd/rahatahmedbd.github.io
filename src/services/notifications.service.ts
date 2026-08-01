import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { type Notification, type NotificationType } from "@/types/database";
import {
  type ListOptions,
  type ListResult,
  buildListResult,
  toServiceError,
} from "./base";

export interface NotifyInput {
  user_id: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
}

export async function notify(input: NotifyInput): Promise<Notification> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: input.user_id,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        link: input.link ?? null,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Notification;
  } catch (err) {
    throw toServiceError(err, "Failed to create notification");
  }
}

export async function listNotifications(
  userId: string,
  options: ListOptions & { isRead?: boolean } = {}
): Promise<ListResult<Notification>> {
  try {
    const supabase = getSupabaseAdminClient();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const sortBy = options.sortBy ?? "id";
    const sortOrder = options.sortOrder ?? "desc";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (typeof options.isRead === "boolean") {
      query = query.eq("is_read", options.isRead);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return buildListResult<Notification>(
      data as Notification[],
      count,
      page,
      limit
    );
  } catch (err) {
    throw toServiceError(err, "Failed to list notifications");
  }
}
