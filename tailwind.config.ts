import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // The existing portfolio has a deliberate, complete base stylesheet.
  // Disable Tailwind's reset so the foundation adds utilities without changing UI.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

export default config;
