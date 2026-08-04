import "server-only";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import { getServerEnvironment, isCloudinaryConfigured } from "@/config/env";

/** Returns a configured server-only Cloudinary SDK instance. */
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

export async function uploadMediaBuffer(
  buffer: Buffer,
  options: {
    folder: string;
    publicId?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
    tags?: string[];
  },
): Promise<UploadApiResponse> {
  const client = getCloudinaryServerClient();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: options.resourceType ?? "auto",
        tags: ["rahat-platform", ...(options.tags ?? [])],
        overwrite: false,
        invalidate: true,
        transformation:
          options.resourceType === "video"
            ? undefined
            : [
                {
                  quality: "auto:good",
                  fetch_format: "auto",
                },
              ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}

export function buildCloudinaryOptimizedUrl(publicId: string, width = 1200): string {
  const environment = getServerEnvironment();
  const cloudName = environment.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured.");
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}
