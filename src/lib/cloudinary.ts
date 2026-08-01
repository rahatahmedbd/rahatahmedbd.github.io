/**
 * Cloudinary helpers (Phase 1 readiness — not wired to any UI yet).
 *
 * Client-side delivery only needs the cloud name (public). Server-side
 * uploads / signed transformations need CLOUDINARY_API_KEY/SECRET, which
 * must live only in server environments (.env.local, never the browser).
 */

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export function isCloudinaryConfigured() {
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
    // Fallback to the local copy in /public/images while Cloudinary is empty.
    return publicId.startsWith("/")
      ? publicId
      : `/images/${publicId}`;
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
