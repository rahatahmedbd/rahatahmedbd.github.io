import * as THREE from "three";

/**
 * Website Factory — Chapter 6 Configuration
 * Full interactive 3D production facility
 */

export const FACTORY = {
  width: 420,
  length: 380,
  height: 68,
  floorY: 0,
  ceilingY: 58,
};

export const FACTORY_PALETTE = {
  floor: 0x11151f,
  floorAccent: 0x1c2333,
  metal: 0x475569,
  metalLight: 0x64748b,
  accentCyan: 0x22d3ee,
  accentPink: 0xf43f5e,
  accentViolet: 0xa78bfa,
  accentLime: 0x4ade80,
  accentGold: 0xfacc15,
  glass: 0x94a3b8,
  conveyor: 0x334155,
  hologram: 0x67e8f9,
  codeGreen: 0x22c55e,
  warning: 0xf59e0b,
  white: 0xffffff,
  dark: 0x0f172a,
} as const;

export type ZoneId =
  | "entrance"
  | "discovery"
  | "planning"
  | "uiux"
  | "development"
  | "testing"
  | "optimization"
  | "deployment"
  | "innovation"
  | "exit";

export interface Zone {
  id: ZoneId;
  name: string;
  description: string;
  x: number;
  z: number;
  width: number;
  length: number;
  accent: number;
  icon: string;
}

export const ZONES: Zone[] = [
  {
    id: "entrance",
    name: "Factory Entrance",
    description: "Massive animated gate with holographic welcome",
    x: 0,
    z: -150,
    width: 68,
    length: 42,
    accent: FACTORY_PALETTE.accentCyan,
    icon: "🚪",
  },
  {
    id: "discovery",
    name: "Zone 1 — Discovery Room",
    description: "Client requirements analysis",
    x: -130,
    z: -90,
    width: 72,
    length: 58,
    accent: FACTORY_PALETTE.accentPink,
    icon: "🔍",
  },
  {
    id: "planning",
    name: "Zone 2 — Planning Room",
    description: "Wireframes, mind maps & user flows",
    x: 130,
    z: -90,
    width: 72,
    length: 58,
    accent: FACTORY_PALETTE.accentViolet,
    icon: "📋",
  },
  {
    id: "uiux",
    name: "Zone 3 — UI/UX Studio",
    description: "Holographic design systems & components",
    x: -130,
    z: 40,
    width: 72,
    length: 58,
    accent: FACTORY_PALETTE.accentGold,
    icon: "🎨",
  },
  {
    id: "development",
    name: "Zone 4 — Development Zone",
    description: "AI robots coding live",
    x: 130,
    z: 40,
    width: 72,
    length: 58,
    accent: FACTORY_PALETTE.accentCyan,
    icon: "💻",
  },
  {
    id: "testing",
    name: "Zone 5 — Testing Laboratory",
    description: "Automated QA & security dashboards",
    x: -130,
    z: 130,
    width: 72,
    length: 58,
    accent: FACTORY_PALETTE.accentLime,
    icon: "🧪",
  },
  {
    id: "optimization",
    name: "Zone 6 — Optimization Center",
    description: "Performance & SEO tuning",
    x: 130,
    z: 130,
    width: 72,
    length: 58,
    accent: FACTORY_PALETTE.accentPink,
    icon: "⚡",
  },
  {
    id: "deployment",
    name: "Zone 7 — Deployment Center",
    description: "Global launch & cloud sync",
    x: 0,
    z: 170,
    width: 92,
    length: 58,
    accent: FACTORY_PALETTE.accentGold,
    icon: "🚀",
  },
  {
    id: "innovation",
    name: "Innovation Room",
    description: "Secret future tech & roadmap",
    x: -170,
    z: -150,
    width: 48,
    length: 48,
    accent: FACTORY_PALETTE.accentViolet,
    icon: "🧠",
  },
];

export interface Machine {
  id: string;
  name: string;
  zone: ZoneId;
  x: number;
  z: number;
  accent: number;
  action: string;
}

export const MACHINES: Machine[] = [
  { id: "design", name: "Design Machine", zone: "uiux", x: -105, z: 55, accent: FACTORY_PALETTE.accentGold, action: "Design Hologram" },
  { id: "dev", name: "Code Engine", zone: "development", x: 105, z: 55, accent: FACTORY_PALETTE.accentCyan, action: "Run Code" },
  { id: "test", name: "Test Lab", zone: "testing", x: -105, z: 145, accent: FACTORY_PALETTE.accentLime, action: "Run Tests" },
  { id: "opt", name: "Optimizer", zone: "optimization", x: 105, z: 145, accent: FACTORY_PALETTE.accentPink, action: "Optimize" },
  { id: "deploy", name: "Deployer", zone: "deployment", x: 0, z: 190, accent: FACTORY_PALETTE.accentGold, action: "Deploy" },
];

export const STATS = [
  { label: "Projects Completed", value: 1248, suffix: "", color: FACTORY_PALETTE.accentCyan },
  { label: "Lines of Code", value: 18492000, suffix: "", color: FACTORY_PALETTE.accentLime },
  { label: "Hours Saved by AI", value: 87200, suffix: "", color: FACTORY_PALETTE.accentPink },
  { label: "Avg Performance", value: 98, suffix: "%", color: FACTORY_PALETTE.accentGold },
  { label: "Client Satisfaction", value: 4.98, suffix: "/5", color: FACTORY_PALETTE.accentViolet },
];

export interface BuildOption {
  id: string;
  label: string;
  options: string[];
  default: number;
}

export const BUILD_OPTIONS: BuildOption[] = [
  { id: "business", label: "Business Type", options: ["E-commerce", "SaaS", "Agency", "Portfolio", "Restaurant", "Startup"], default: 0 },
  { id: "style", label: "Website Style", options: ["Modern", "Minimal", "Bold", "Premium", "Playful", "Corporate"], default: 1 },
  { id: "features", label: "Key Features", options: ["5", "8", "12", "16", "22"], default: 2 },
  { id: "pages", label: "Pages", options: ["4", "7", "10", "14", "20"], default: 2 },
  { id: "animations", label: "Animations", options: ["Subtle", "Medium", "Rich", "Cinematic"], default: 1 },
  { id: "admin", label: "Admin Panel", options: ["Basic", "Advanced", "Enterprise"], default: 1 },
  { id: "ai", label: "AI Features", options: ["None", "Chatbot", "AI Assistant", "Full AI Suite"], default: 2 },
];

export const BASE_PRICE = 2400;
export const PRICE_FACTORS = [1, 1.3, 1.6, 2.1, 2.6, 3.2]; // multiplier per selection index

export interface HudState {
  currentZone: string;
  buildProgress: number;
  estimatedCost: number;
  toast: { id: number; title: string; sub?: string } | null;
}

export const initialHudState: HudState = {
  currentZone: "Factory Entrance",
  buildProgress: 0,
  estimatedCost: 2850,
  toast: null,
};
