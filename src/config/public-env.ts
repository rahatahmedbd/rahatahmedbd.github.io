import { z } from "zod";

const emptyToUndefined = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length === 0 ? undefined : trimmedValue;
};

const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());
const optionalHttpsUrl = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .url()
    .refine((value) => new URL(value).protocol === "https:", {
      message: "must use https",
    })
    .optional(),
);

export const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalHttpsUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: optionalString,
  NEXT_PUBLIC_APP_URL: optionalHttpsUrl,
});

export type PublicEnvironment = z.infer<typeof publicEnvironmentSchema>;

export function getPublicEnvironment(): PublicEnvironment {
  const parsedEnvironment = publicEnvironmentSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsedEnvironment.success) {
    const fields = parsedEnvironment.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");
    throw new Error(`Invalid public environment configuration: ${fields}.`);
  }

  const environment = parsedEnvironment.data;
  const hasSupabaseUrl = Boolean(environment.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnonKey = Boolean(environment.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabaseUrl !== hasSupabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured together.",
    );
  }

  return environment;
}

export function isPublicSupabaseConfigured(environment = getPublicEnvironment()): boolean {
  return Boolean(environment.NEXT_PUBLIC_SUPABASE_URL && environment.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
