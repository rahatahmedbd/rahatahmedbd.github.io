import { apiJson } from "@/lib/backend/http";

export const runtime = "nodejs";

export async function GET() {
  return apiJson({
    ok: true,
    backend: {
      supabase: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
      supabaseAdmin: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      cloudinary: Boolean(
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET,
      ),
      adminBootstrap: Boolean(process.env.ADMIN_EMAILS),
    },
  });
}
