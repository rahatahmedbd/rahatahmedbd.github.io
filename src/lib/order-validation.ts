import { z } from "zod";

/** Shared input contract for the order flow before any future server action. */
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
