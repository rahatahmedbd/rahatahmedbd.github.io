import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  isCloudinaryConfigured,
} from "./index";

export interface UploadedFile {
  name: string;
  url: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
}

export class UploadNotConfiguredError extends Error {
  constructor() {
    super(
      "File uploads are not available right now. Please send your files by email or WhatsApp instead."
    );
    this.name = "UploadNotConfiguredError";
  }
}

/** Images go to /image/upload, everything else to /raw/upload. */
function resourceType(file: File): "image" | "raw" {
  return file.type.startsWith("image/") ? "image" : "raw";
}

/**
 * Upload a single file to Cloudinary.
 *
 * Two paths, no third:
 *   1. An unsigned preset is configured -> upload directly from the browser.
 *   2. No preset -> ask the server to sign the request (admin only).
 *
 * If neither is available this THROWS. It deliberately does not fall back to
 * `URL.createObjectURL`: a blob: URL only exists inside the current tab, so
 * persisting one produces a database row that looks like a successful upload
 * but points at a file that is already gone.
 */
export async function uploadFile(
  file: File,
  options: { folder?: string; signed?: boolean } = {}
): Promise<UploadedFile> {
  if (!isCloudinaryConfigured()) throw new UploadNotConfiguredError();

  const kind = resourceType(file);
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${kind}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  if (options.folder) formData.append("folder", options.folder);

  if (CLOUDINARY_UPLOAD_PRESET) {
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  } else if (options.signed) {
    const signRes = await fetch("/api/uploads/sign-cloudinary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.folder ? { folder: options.folder } : {}),
    });

    if (!signRes.ok) throw new UploadNotConfiguredError();

    const { signature, timestamp, apiKey } = await signRes.json();
    formData.append("signature", signature);
    formData.append("timestamp", String(timestamp));
    formData.append("api_key", apiKey);
  } else {
    throw new UploadNotConfiguredError();
  }

  const res = await fetch(endpoint, { method: "POST", body: formData });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(
      detail?.error?.message || `Upload failed for "${file.name}". Please try again.`
    );
  }

  const data = await res.json();
  if (!data.secure_url) throw new Error(`Upload failed for "${file.name}".`);

  return {
    name: file.name,
    url: data.secure_url,
    path: data.public_id,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

/** True when the UI should show file-upload controls at all. */
export function canUploadFromBrowser(): boolean {
  return isCloudinaryConfigured() && Boolean(CLOUDINARY_UPLOAD_PRESET);
}
