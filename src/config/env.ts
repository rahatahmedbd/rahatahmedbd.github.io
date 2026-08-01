export interface PublicEnv {
  siteUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  formspreeId: string;
}

export interface ServerEnv {
  supabaseServiceRoleKey: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

export const publicEnv: PublicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rahatahmedbd.github.io",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryUploadPreset:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",
};

export const serverEnv: ServerEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};

export const isSupabaseConfigured: boolean = Boolean(
  publicEnv.supabaseUrl && publicEnv.supabaseAnonKey
);

export const isCloudinaryConfigured: boolean = Boolean(
  publicEnv.cloudinaryCloudName
);

export const isSupabaseAdminAvailable: boolean = Boolean(
  isSupabaseConfigured && serverEnv.supabaseServiceRoleKey
);
