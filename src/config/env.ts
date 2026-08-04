import "server-only";

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

const serverEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalHttpsUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,
  ADMIN_EMAILS: optionalString,
  NEXT_PUBLIC_APP_URL: optionalHttpsUrl,
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function getServerEnvironment(): ServerEnvironment {
  const parsedEnvironment = serverEnvironmentSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsedEnvironment.success) {
    const fields = parsedEnvironment.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");
    throw new Error(`Invalid server environment configuration: ${fields}.`);
  }

  const environment = parsedEnvironment.data;
  const hasSupabaseUrl = Boolean(environment.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnonKey = Boolean(environment.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasCloudinaryApiKey = Boolean(environment.CLOUDINARY_API_KEY);
  const hasCloudinaryApiSecret = Boolean(environment.CLOUDINARY_API_SECRET);

  if (hasSupabaseUrl !== hasSupabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured together.",
    );
  }

  if (hasCloudinaryApiKey !== hasCloudinaryApiSecret) {
    throw new Error("CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be configured together.");
  }

  return environment;
}

export function isSupabaseConfigured(environment = getServerEnvironment()): boolean {
  return Boolean(environment.NEXT_PUBLIC_SUPABASE_URL && environment.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isSupabaseAdminConfigured(environment = getServerEnvironment()): boolean {
  return Boolean(isSupabaseConfigured(environment) && environment.SUPABASE_SERVICE_ROLE_KEY);
}

export function isCloudinaryConfigured(environment = getServerEnvironment()): boolean {
  return Boolean(
    environment.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    environment.CLOUDINARY_API_KEY &&
    environment.CLOUDINARY_API_SECRET,
  );
}
