import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AiAssistant } from "./ai-assistant";

export const metadata = {
  title: "AI Business Assistant | Super Admin",
};

export default async function AdminAiAssistantPage() {
  const supabase = await getSupabaseServerClient();

  // Fetch all orders/requests to let the AI analyze them
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load orders for AI:", error);
  }

  return <AiAssistant orders={orders || []} />;
}
