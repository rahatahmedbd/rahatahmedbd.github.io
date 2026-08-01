import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ClientsDatabase } from "./clients-database";

export const metadata = {
  title: "Client Database | Super Admin",
};

export default async function AdminClientsPage() {
  const supabase = await getSupabaseServerClient();

  // Select client profiles (and join with orders to get total spend / order counts)
  const [
    { data: profiles, error: prfErr },
    { data: orders, error: ordErr },
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("id, client_id, total_amount, status, client_info"),
  ]);

  if (prfErr) console.error("Failed to load profiles:", prfErr);
  if (ordErr) console.error("Failed to load orders:", ordErr);

  // Group orders by client email or client_id to calculate total spending
  const clientSpendingMap: Record<string, { totalSpend: number; totalOrders: number; activeProjects: number }> = {};

  orders?.forEach((ord) => {
    const key = ord.client_id || ord.client_info?.email || "";
    if (!key) return;

    if (!clientSpendingMap[key]) {
      clientSpendingMap[key] = { totalSpend: 0, totalOrders: 0, activeProjects: 0 };
    }

    clientSpendingMap[key].totalOrders += 1;
    if (ord.status === "completed") {
      clientSpendingMap[key].totalSpend += Number(ord.total_amount || 0);
    }
    if (ord.status !== "completed" && ord.status !== "cancelled") {
      clientSpendingMap[key].activeProjects += 1;
    }
  });

  const clientsData = profiles?.map((prf) => {
    // try matching by ID first, then email
    const spendingInfo = clientSpendingMap[prf.id] || clientSpendingMap[prf.email] || { totalSpend: 0, totalOrders: 0, activeProjects: 0 };
    return {
      ...prf,
      totalSpend: spendingInfo.totalSpend,
      totalOrders: spendingInfo.totalOrders,
      activeProjects: spendingInfo.activeProjects,
    };
  }) || [];

  return <ClientsDatabase initialClients={clientsData} />;
}
