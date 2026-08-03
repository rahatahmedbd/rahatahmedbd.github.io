/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type and lint errors now fail the build — the codebase is clean.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local images live in /public/images. Cloudinary is configured in a later
    // phase — when enabled, add its domain here and use next/image loaders.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "aaejtdpadrxwplomraog.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy / duplicate routes consolidated into the single order journey.
      { source: "/service-district", destination: "/order", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/verse", destination: "/rahatverse", permanent: true },
    ];
  },
};

export default nextConfig;
