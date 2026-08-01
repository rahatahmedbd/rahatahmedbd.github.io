import { getSupabaseServerClient } from "@/lib/supabase/server";
import { type Order, type OrderStatus } from "@/types/database";
import { type OrderInput } from "@/lib/validation/schemas";
import {
  type ListOptions,
  type ListResult,
  buildListResult,
  toServiceError,
} from "./base";

export async function createOrder(input: OrderInput): Promise<Order> {
  try {
    const supabase = await getSupabaseServerClient();
    const reference =
      input.reference ??
      `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        reference,
        client_id: input.client_id,
        project_id: input.project_id ?? null,
        status: input.status,
        total_amount: input.total_amount,
        currency: input.currency,
        notes: input.notes ?? null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Order;
  } catch (err) {
    throw toServiceError(err, "Failed to create order");
  }
}

export async function listOrders(
  options: ListOptions & { clientId?: string; status?: OrderStatus } = {}
): Promise<ListResult<Order>> {
  try {
    const supabase = await getSupabaseServerClient();
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const sortBy = options.sortBy ?? "id";
    const sortOrder = options.sortOrder ?? "desc";
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (options.clientId) {
      query = query.eq("client_id", options.clientId);
    }
    if (options.status) {
      query = query.eq("status", options.status);
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return buildListResult<Order>(data as Order[], count, page, limit);
  } catch (err) {
    throw toServiceError(err, "Failed to list orders");
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Order;
  } catch (err) {
    throw toServiceError(err, "Failed to update order status");
  }
}
