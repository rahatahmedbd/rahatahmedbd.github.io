import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Neutral premium canvas (zinc-based, slightly cool)
        canvas: {
          DEFAULT: "rgb(var(--canvas) / <alpha-value>)",
          subtle: "rgb(var(--canvas-subtle) / <alpha-value>)",
          muted: "rgb(var(--canvas-muted) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          soft: "rgb(var(--fg-soft) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
        },
        // Brand accent — refined crimson (on-brand: blood donor)
        brand: {
          50: "#fff1f3",
          100: "#ffe1e6",
          200: "#ffc8d2",
          300: "#ff9fb0",
          400: "#ff6480",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        gold: {
          400: "#d4af37",
          500: "#c99a3e",
          600: "#a4772b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        bengali: ["var(--font-bengali)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        /* Fluid display type — the minimums keep small phones unclipped,
           the middle vw values drive the desktop scale. */
        "display-2xl": ["clamp(2.5rem, 10vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-xl": ["clamp(2.25rem, 8.5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-lg": ["clamp(1.875rem, 6.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["clamp(1.625rem, 5vw, 2.375rem)", { lineHeight: "1.12", letterSpacing: "-0.015em", fontWeight: "700" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.12)",
        lift: "0 2px 4px rgba(0,0,0,0.05), 0 24px 48px -20px rgba(0,0,0,0.22)",
        glow: "0 0 0 1px rgba(244,63,94,0.18), 0 16px 40px -12px rgba(244,63,94,0.35)",
        "inner-line": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgb(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border) / 0.5) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(60% 60% at 50% 0%, rgb(var(--brand-glow) / 0.16) 0%, transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.7s ease both",
        "scale-in": "scale-in 0.7s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
