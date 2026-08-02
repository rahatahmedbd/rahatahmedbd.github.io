import type { Metadata } from "next";
import { OrderPageClient } from "@/components/order/order-page-client";

export const metadata: Metadata = {
  title: "Order a Website | Rahat Ahmed",
  description:
    "Order a custom, modern, high-performance website in four short steps. Pick a category, choose a package, get an instant price estimate — or explore the full interactive Service District.",
};

export default function OrderWebsitePage() {
  return <OrderPageClient />;
}
