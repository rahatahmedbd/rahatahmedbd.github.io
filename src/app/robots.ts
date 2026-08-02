import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://rahatahmedbd.github.io";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/dashboard",
        "/account",
        "/login",
        "/reset-password",
        "/forgot-password",
        "/init-super-admin",
        "/unauthorized",
        "/api",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
