import crypto from "node:crypto";
import { publicEnv, serverEnv } from "@/config/env";

export function isCloudinarySigningReady(): boolean {
  return Boolean(
    publicEnv.cloudinaryCloudName &&
      serverEnv.cloudinaryApiKey &&
      serverEnv.cloudinaryApiSecret
  );
}

export interface CloudinarySignedParams {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
}

export function signUploadParams(
  paramsToSign: Record<string, string | number | boolean | undefined | null>
): CloudinarySignedParams {
  if (!isCloudinarySigningReady()) {
    throw new Error(
      "Cloudinary server signing is not configured. Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  const timestamp =
    typeof paramsToSign.timestamp === "number" ||
    typeof paramsToSign.timestamp === "string"
      ? Number(paramsToSign.timestamp)
      : Math.round(Date.now() / 1000);

  const filtered: Record<string, string | number | boolean> = {
    ...paramsToSign,
    timestamp,
  };

  delete (filtered as Record<string, unknown>).file;
  delete (filtered as Record<string, unknown>).cloud_name;
  delete (filtered as Record<string, unknown>).resource_type;
  delete (filtered as Record<string, unknown>).api_key;
  delete (filtered as Record<string, unknown>).signature;

  const sortedKeys = Object.keys(filtered)
    .filter(
      (k) =>
        filtered[k] !== undefined &&
        filtered[k] !== null &&
        filtered[k] !== ""
    )
    .sort();

  const queryParts = sortedKeys.map((key) => `${key}=${filtered[key]}`);
  const stringToSign = `${queryParts.join("&")}${serverEnv.cloudinaryApiSecret}`;

  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  return {
    signature,
    timestamp,
    apiKey: serverEnv.cloudinaryApiKey,
    cloudName: publicEnv.cloudinaryCloudName,
  };
}
