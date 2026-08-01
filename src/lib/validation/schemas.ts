import { z } from "zod";

export const messageInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email(),
  phone: z.string().max(30).optional().nullable(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  body: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export type MessageInput = z.infer<typeof messageInputSchema>;

export const orderInputSchema = z.object({
  reference: z.string().min(1).optional(),
  client_id: z.uuid(),
  project_id: z.uuid().optional().nullable(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "in_progress",
      "delivered",
      "completed",
      "cancelled",
    ])
    .default("pending"),
  total_amount: z.number().nonnegative(),
  currency: z.string().min(3).max(3).default("USD"),
  notes: z.string().max(2000).optional().nullable(),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export const testimonialInputSchema = z.object({
  author_name: z.string().min(2).max(100),
  author_title: z.string().max(100).optional().nullable(),
  author_avatar_url: z.string().url().optional().nullable(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10).max(2000),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export type TestimonialInput = z.infer<typeof testimonialInputSchema>;

export const faqInputSchema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(5).max(5000),
  category: z.string().min(2).max(100),
  sort_order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export type FaqInput = z.infer<typeof faqInputSchema>;

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationFailure = {
  success: false;
  error: string;
  errors: Record<string, string[]>;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const initSuperAdminSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional().nullable(),
});

export type InitSuperAdminInput = z.infer<typeof initSuperAdminSchema>;

/**
 * Helper using safeParse to validate data against any Zod schema.
 */
export function validate<T>(
  schema: z.ZodType<T>,
  value: unknown
): ValidationResult<T> {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};
  const zodErrors = result.error.issues ?? [];

  for (const err of zodErrors) {
    const path = err.path.join(".") || "_root";
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  }

  return {
    success: false,
    error: result.error.message || "Validation failed",
    errors,
  };
}
