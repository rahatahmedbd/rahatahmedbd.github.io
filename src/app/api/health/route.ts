import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/config/env";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { isCloudinarySigningReady } from "@/lib/cloudinary/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    integrations: {
      supabase: isSupabaseConfigured,
      cloudinaryDelivery: isCloudinaryConfigured(),
      cloudinarySigning: isCloudinarySigningReady(),
    },
  });
}
