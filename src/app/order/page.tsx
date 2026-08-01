import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OrderForm } from "./order-form";

export const metadata = {
  title: "Order Website | Premium Website Request System",
  description: "Request a custom, modern, high-performance website tailored to your goals.",
};

const defaultPrices = {
  starter: 80,
  professional: 180,
  businessPro: 350,
  categories: {
    "Landing Page": 80,
    "Portfolio Website": 100,
    "Business Website": 150,
    "Company Website": 180,
    "NGO Website": 140,
    "School / College Website": 160,
    "Restaurant Website": 120,
    "Hospital Website": 200,
    "E-commerce Website": 250,
    "Blog / News Website": 130,
    "Custom Web Application": 400,
    "AI-Powered Solution": 500,
  },
  features: {
    "Admin Panel": 50,
    "Dashboard": 60,
    "Authentication": 40,
    "User Login": 30,
    "Payment Gateway": 80,
    "Booking System": 70,
    "Appointment System": 70,
    "CMS": 50,
    "Blog": 40,
    "AI Integration": 120,
    "API Integration": 60,
    "Live Chat": 40,
    "Notifications": 30,
    "Search": 20,
    "Analytics": 30,
    "Multi-language": 40,
    "Custom Feature": 50,
  },
};

export default async function OrderWebsitePage() {
  const supabase = await getSupabaseServerClient();
  
  // Dynamically load custom pricing settings if configured, else fall back to default prices
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "order_package_prices")
    .maybeSingle();

  const pricing = data?.value || defaultPrices;

  return (
    <div className="relative min-h-screen py-12">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.35] mask-fade-b [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute -right-20 top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <OrderForm pricing={pricing} />
    </div>
  );
}
