import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OrdersManager } from "./orders-manager";

export const metadata = {
  title: "Website Orders | Super Admin",
};

export default async function AdminOrdersPage() {
  const supabase = await getSupabaseServerClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load orders:", error);
  }

  return <OrdersManager initialOrders={orders || []} />;
}
