import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7A0C2E",
          light: "#A31942",
          dark: "#500A1F",
          soft: "rgba(122, 12, 46, 0.08)",
          glow: "rgba(122, 12, 46, 0.25)",
        },
        blood: {
          DEFAULT: "#C1121F",
          dark: "#8B0000",
        },
        accent: {
          gold: "#C99A3E",
        },
        bg: {
          DEFAULT: "#FBF8F3",
          alt: "#F3EEE4",
          elevated: "#FFFFFF",
        },
        text: {
          DEFAULT: "#221A15",
          soft: "#5A4F45",
          muted: "#8B7F73",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "rgba(34, 26, 21, 0.10)",
          strong: "rgba(34, 26, 21, 0.18)",
        },
      },
      fontFamily: {
        display: ['"Baloo Da 2"', '"Hind Siliguri"', "system-ui", "sans-serif"],
        body: ['"Hind Siliguri"', '"Inter"', "system-ui", "sans-serif"],
        english: ['"Inter"', '"Poppins"', "system-ui", "sans-serif"],
      },
      fontSize: {
        "fs-xs": ["clamp(0.72rem, 0.68rem + 0.2vw, 0.78rem)", { lineHeight: "1.4" }],
        "fs-sm": ["clamp(0.82rem, 0.78rem + 0.25vw, 0.9rem)", { lineHeight: "1.5" }],
        "fs-base": ["clamp(0.95rem, 0.9rem + 0.25vw, 1rem)", { lineHeight: "1.6" }],
        "fs-md": ["clamp(1.05rem, 1rem + 0.3vw, 1.15rem)", { lineHeight: "1.6" }],
        "fs-lg": ["clamp(1.2rem, 1.1rem + 0.5vw, 1.35rem)", { lineHeight: "1.4" }],
        "fs-xl": ["clamp(1.4rem, 1.25rem + 0.75vw, 1.65rem)", { lineHeight: "1.3" }],
        "fs-2xl": ["clamp(1.7rem, 1.4rem + 1.5vw, 2.15rem)", { lineHeight: "1.2" }],
        "fs-3xl": ["clamp(2rem, 1.6rem + 2vw, 2.75rem)", { lineHeight: "1.2" }],
        "fs-4xl": ["clamp(2.4rem, 1.8rem + 3vw, 3.5rem)", { lineHeight: "1.1" }],
        "fs-hero": ["clamp(2.5rem, 2rem + 3.5vw, 4rem)", { lineHeight: "1.1" }],
      },
      spacing: {
        "section-py-sm": "clamp(48px, 8vw, 72px)",
        "section-py-md": "clamp(64px, 10vw, 96px)",
        "section-py-lg": "clamp(80px, 12vw, 128px)",
      },
      borderRadius: {
        "xl": "16px",
        "2xl": "20px",
        "full": "999px",
        "circle": "50%",
      },
      boxShadow: {
        "primary": "0 12px 24px -10px rgba(122, 12, 46, 0.4)",
        "blood": "0 12px 30px -10px rgba(193, 18, 31, 0.5)",
        "glow": "0 0 40px rgba(122, 12, 46, 0.15)",
      },
      animation: {
        "pulse-ring": "pulseRing 3s ease-out infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "scroll-dot": "scrollDot 1.8s ease-in-out infinite",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "15%, 35%": { transform: "scale(1.1)" },
          "25%": { transform: "scale(0.95)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
