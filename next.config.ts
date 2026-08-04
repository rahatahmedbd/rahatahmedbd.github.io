import type { NextConfig } from "next";

/**
 * Vercel uses the standard Next.js server build so future authenticated,
 * server-only Supabase and Cloudinary work can be added without replatforming.
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Legacy markup uses native <img> elements. This config prepares future
    // next/image usage without changing the existing portfolio rendering.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
