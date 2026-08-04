import { z } from "zod";

import { extraFeatures, websitePackages, websiteTypes } from "@/data/platform";

const websiteTypeIds = new Set(websiteTypes.map((type) => type.id));
const websitePackageIds = new Set(websitePackages.map((pkg) => pkg.id));
const extraFeatureIds = new Set(extraFeatures.map((feature) => feature.id));

/** Shared input contract for the order flow. */
export const orderContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long."),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9()\s-]{7,20}$/u, "Please enter a valid phone number."),
  businessName: z.string().trim().max(120, "Organization name is too long."),
  message: z.string().trim().max(2_000, "Project details are too long."),
});

export const websiteOrderSubmissionSchema = z.object({
  selectedTypeId: z
    .string()
    .trim()
    .refine((value) => websiteTypeIds.has(value), "Please choose a valid website type."),
  selectedPackageId: z
    .string()
    .trim()
    .refine((value) => websitePackageIds.has(value), "Please choose a valid package."),
  selectedExtras: z
    .array(
      z
        .string()
        .trim()
        .refine((value) => extraFeatureIds.has(value), "One or more selected extras are invalid."),
    )
    .max(12, "Too many extra features selected.")
    .default([]),
  contact: orderContactSchema,
  source: z.enum(["website", "rahatverse", "admin", "client"]).default("website"),
});

export const orderStatusSchema = z.enum([
  "new",
  "confirmed",
  "planning",
  "design",
  "development",
  "review",
  "delivered",
  "completed",
  "cancelled",
]);

export const paymentStatusSchema = z.enum([
  "not_started",
  "pending",
  "partial",
  "paid",
  "refunded",
]);

export const orderUpdateSchema = z.object({
  id: z.string().uuid(),
  status: orderStatusSchema.optional(),
  progressPercent: z.number().int().min(0).max(100).optional(),
  paymentStatus: paymentStatusSchema.optional(),
  adminNotes: z.string().trim().max(2_000).optional(),
});

export type WebsiteOrderSubmission = z.infer<typeof websiteOrderSubmissionSchema>;
export type WebsiteOrderStatus = z.infer<typeof orderStatusSchema>;
export type WebsitePaymentStatus = z.infer<typeof paymentStatusSchema>;
