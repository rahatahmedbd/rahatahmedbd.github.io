import { publicEnv } from "@/config/env";

export const CLOUDINARY_CLOUD_NAME = publicEnv.cloudinaryCloudName;
export const CLOUDINARY_UPLOAD_PRESET = publicEnv.cloudinaryUploadPreset;

export function isCloudinaryConfigured(): boolean {
  return CLOUDINARY_CLOUD_NAME.length > 0;
}

export interface CloudinaryTransform {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "scale" | "fit";
  gravity?: "auto" | "face" | "center";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg";
  radius?: number | "max";
}

/** Build an optimized Cloudinary delivery URL for a public id / remote path. */
export function cloudinaryUrl(
  publicId: string,
  transform: CloudinaryTransform = {}
): string {
  if (!isCloudinaryConfigured()) {
    return publicId.startsWith("/") ? publicId : `/images/${publicId}`;
  }

  const parts: string[] = [];
  if (transform.width) parts.push(`w_${transform.width}`);
  if (transform.height) parts.push(`h_${transform.height}`);
  if (transform.crop) parts.push(`c_${transform.crop}`);
  if (transform.gravity) parts.push(`g_${transform.gravity}`);
  parts.push(`q_${transform.quality ?? "auto"}`);
  parts.push(`f_${transform.format ?? "auto"}`);
  if (transform.radius) parts.push(`r_${transform.radius}`);

  const transformStr = parts.join(",");
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformStr}/${publicId}`;
}

/** Build a responsive srcset string for a Cloudinary image. */
export function cloudinarySrcSet(
  publicId: string,
  widths: number[] = [640, 768, 1024, 1280, 1536],
  transform: CloudinaryTransform = {}
): string {
  return widths
    .map((w) => `${cloudinaryUrl(publicId, { ...transform, width: w })} ${w}w`)
    .join(", ");
}
