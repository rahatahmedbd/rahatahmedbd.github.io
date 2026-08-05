import type { Config } from "tailwindcss";

/**
 * Tailwind is installed and ready in Phase 00 but intentionally minimal.
 * The legacy faithful port still uses the original CSS (public/css/*).
 * The design system (Phase 01) will expand this config.
 */
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
