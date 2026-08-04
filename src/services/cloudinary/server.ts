import "server-only";

import { v2 as cloudinary } from "cloudinary";

import { getServerEnvironment, isCloudinaryConfigured } from "@/config/env";

/**
 * Returns a configured server-only Cloudinary SDK instance. This is an
 * integration boundary only; no uploads or media features are implemented in
 * Phase 0.
 */
export function getCloudinaryServerClient() {
  const environment = getServerEnvironment();
  const cloudName = environment.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = environment.CLOUDINARY_API_KEY;
  const apiSecret = environment.CLOUDINARY_API_SECRET;

  if (!isCloudinaryConfigured(environment) || !cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the server environment.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}
