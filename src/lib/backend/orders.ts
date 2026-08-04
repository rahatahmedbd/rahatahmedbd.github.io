import "server-only";

import { extraFeatures, websitePackages, websiteTypes } from "@/data/platform";
import type { WebsiteOrderSubmission } from "@/lib/order-validation";
import { createSupabaseAdminClient } from "@/services/supabase/server";

export interface OrderPricingSnapshot {
  currency: "BDT";
  packagePrice: number;
  extrasTotal: number;
  total: number;
  selectedTypeStartingPrice: number;
}

export interface OrderCatalogSnapshot {
  websiteType: {
    id: string;
    title: string;
    startingPrice: number;
    delivery: string;
  };
  websitePackage: {
    id: string;
    name: string;
    price: number;
    delivery: string;
    features: readonly string[];
  };
  extras: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>;
}

export interface PreparedWebsiteOrder {
  orderNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  businessName: string | null;
  message: string | null;
  websiteTypeId: string;
  packageId: string;
  extras: string[];
  source: string;
  pricing: OrderPricingSnapshot;
  catalogSnapshot: OrderCatalogSnapshot;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${timestamp}-${suffix}`;
}

export function prepareWebsiteOrder(submission: WebsiteOrderSubmission): PreparedWebsiteOrder {
  const selectedType = websiteTypes.find((type) => type.id === submission.selectedTypeId);
  const selectedPackage = websitePackages.find((pkg) => pkg.id === submission.selectedPackageId);
  const selectedExtras = extraFeatures.filter((feature) =>
    submission.selectedExtras.includes(feature.id),
  );

  if (!selectedType || !selectedPackage) {
    throw new Error("Invalid order catalog selection.");
  }

  const extrasTotal = selectedExtras.reduce((sum, feature) => sum + feature.price, 0);
  const pricing: OrderPricingSnapshot = {
    currency: "BDT",
    packagePrice: selectedPackage.price,
    extrasTotal,
    total: selectedPackage.price + extrasTotal,
    selectedTypeStartingPrice: selectedType.startingPrice,
  };

  return {
    orderNumber: generateOrderNumber(),
    contactName: submission.contact.name,
    contactEmail: submission.contact.email.toLowerCase(),
    contactPhone: submission.contact.phone,
    businessName: submission.contact.businessName || null,
    message: submission.contact.message || null,
    websiteTypeId: selectedType.id,
    packageId: selectedPackage.id,
    extras: selectedExtras.map((feature) => feature.id),
    source: submission.source,
    pricing,
    catalogSnapshot: {
      websiteType: {
        id: selectedType.id,
        title: selectedType.title,
        startingPrice: selectedType.startingPrice,
        delivery: selectedType.delivery,
      },
      websitePackage: {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.price,
        delivery: selectedPackage.delivery,
        features: selectedPackage.features,
      },
      extras: selectedExtras.map((feature) => ({
        id: feature.id,
        name: feature.name,
        price: feature.price,
        description: feature.description,
      })),
    },
  };
}

export async function storeWebsiteOrder(
  preparedOrder: PreparedWebsiteOrder,
  userId: string | null,
): Promise<{ id: string; orderNumber: string; status: string; progressPercent: number }> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("website_orders")
    .insert({
      order_number: preparedOrder.orderNumber,
      user_id: userId,
      contact_name: preparedOrder.contactName,
      contact_email: preparedOrder.contactEmail,
      contact_phone: preparedOrder.contactPhone,
      business_name: preparedOrder.businessName,
      message: preparedOrder.message,
      website_type_id: preparedOrder.websiteTypeId,
      package_id: preparedOrder.packageId,
      extras: preparedOrder.extras,
      source: preparedOrder.source,
      pricing: preparedOrder.pricing,
      catalog_snapshot: preparedOrder.catalogSnapshot,
      status: "new",
      progress_percent: 5,
      payment_status: "not_started",
    })
    .select("id, order_number, status, progress_percent")
    .single();

  if (error) throw error;

  await supabase.from("notification_jobs").insert({
    event_type: "order.created",
    channel: "internal",
    recipient: "admin",
    payload: {
      orderId: data.id,
      orderNumber: data.order_number,
      contactEmail: preparedOrder.contactEmail,
      total: preparedOrder.pricing.total,
    },
  });

  return {
    id: data.id,
    orderNumber: data.order_number,
    status: data.status,
    progressPercent: data.progress_percent,
  };
}
