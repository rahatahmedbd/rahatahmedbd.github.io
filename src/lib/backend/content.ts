import "server-only";

import { z } from "zod";

export const adminResourceSchema = z.enum([
  "portfolio",
  "services",
  "pricing",
  "gallery",
  "achievements",
  "education",
  "contact",
]);

export const contentEntrySchema = z.object({
  resource: adminResourceSchema,
  key: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9_.-]+$/u),
  title: z.string().trim().min(1).max(160),
  data: z.record(z.string(), z.unknown()),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export const contentUpdateSchema = z.object({
  entries: z.array(contentEntrySchema).min(1).max(50),
});

export type AdminResource = z.infer<typeof adminResourceSchema>;
