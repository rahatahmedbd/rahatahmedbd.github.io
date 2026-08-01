import { getSupabaseServerClient } from "@/lib/supabase/server";
import { type Message } from "@/types/database";
import { type MessageInput } from "@/lib/validation/schemas";
import {
  type ListOptions,
  type ListResult,
  buildListResult,
  toServiceError,
} from "./base";

export async function createMessage(input: MessageInput): Promise<Message> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        subject: input.subject,
        body: input.body,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Message;
  } catch (err) {
    throw toServiceError(err, "Failed to create message");
  }
}

export async function listMessages(
  options: ListOptions & { isRead?: boolean } = {}
): Promise<ListResult<Message>> {
  try {
    const supabase = await getSupabaseServerClient();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const sortBy = options.sortBy ?? "id";
    const sortOrder = options.sortOrder ?? "desc";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("messages")
      .select("*", { count: "exact" })
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (typeof options.isRead === "boolean") {
      query = query.eq("is_read", options.isRead);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return buildListResult<Message>(data as Message[], count, page, limit);
  } catch (err) {
    throw toServiceError(err, "Failed to list messages");
  }
}

export async function markMessageRead(
  id: string,
  isRead = true
): Promise<Message> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .update({ is_read: isRead })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Message;
  } catch (err) {
    throw toServiceError(err, "Failed to mark message read status");
  }
}
