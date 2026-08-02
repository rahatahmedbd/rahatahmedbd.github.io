import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OrdersManager } from "./orders-manager";

export const metadata = {
  title: "Website Orders | Super Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    orders = data ?? [];
  } catch {
    // Render an empty panel rather than a 500.
  }

  return <OrdersManager initialOrders={orders} />;
}
