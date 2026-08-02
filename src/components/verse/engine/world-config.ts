/**
 * RahatVerse — Chapter 4 · Agency Headquarters (The Command Center)
 * Central configuration: world scale, palette, districts, reserved zones.
 */

export const WORLD = {
  /** Radius of the habitable city disc (walkable ground). */
  groundRadius: 360,
  /** Soft fog far distance — fades the world edge into the sky. */
  fogFar: 1250,
  /** Height of the "void" below the floating platform. */
  voidY: -46,
};

export const PLAZA = {
  radius: 42,
  /** Height offset used to float holographic markers. */
  markerY: 34,
};

/** Ground / surface palette — premium, bright, clean digital city. */
export const PALETTE = {
  ground: 0xe9edf4,
  groundDark: 0xd7deea,
  grid: 0xc3cbd9,
  road: 0xd9dfea,
  roadLine: 0xffffff,
  roadEdge: 0xbfc8d8,
  plaza: 0xf4f6fa,
  plazaAccent: 0xf43f5e,
  water: 0x4cc3e8,
  waterDeep: 0x1f9bd4,
  grass: 0x9fd08a,
  grassDark: 0x82bb6c,
  path: 0xcfd8cf,

  brand: 0xf43f5e,
  cyan: 0x22d3ee,
  gold: 0xd4af37,
  violet: 0xa78bfa,
  lime: 0xa3e635,
  white: 0xffffff,

  holo: 0x67e8f9,
  holoSoft: 0xbae6fd,
  metal: 0xb9c2d0,
  metalDark: 0x6b7684,
} as const;

/** Time-of-day keyframes. `t` in [0,1) is a continuous day-cycle clock. */
export type TimePhase = "morning" | "day" | "sunset" | "night";

export const TIME_SEQUENCE: TimePhase[] = ["morning", "day", "sunset", "night"];

/**
 * District landmarks used for the HUD "current district" readout and the
 * minimap. Each is matched by distance to the player.
 */
export interface District {
  id: string;
  name: string;
  bn: string;
  x: number;
  z: number;
  accent: number;
}

export const DISTRICTS: District[] = [
  { id: "plaza", name: "Central Plaza", bn: "কেন্দ্রীয় চত্বর", x: 0, z: 0, accent: PALETTE.brand },
  { id: "north-park", name: "North Gardens", bn: "উত্তর উদ্যান", x: 0, z: -250, accent: PALETTE.grass },
  { id: "east-park", name: "East Park", bn: "পূর্ব উদ্যান", x: 250, z: 0, accent: PALETTE.grass },
  { id: "west-park", name: "West Park", bn: "পশ্চিম উদ্যান", x: -250, z: 0, accent: PALETTE.grass },
  { id: "south-park", name: "South Commons", bn: "দক্ষিণ চত্বর", x: 0, z: 250, accent: PALETTE.grass },
];

export interface ReservedZone {
  id: string;
  name: string;
  bn: string;
  tagline: string;
  x: number;
  z: number;
  chapter: number;
  /** Short info shown on the interactive panel. */
  info: string;
  accent: number;
}

/**
 * The reserved locations of RahatVerse.
 * Chapter 4 builds Agency Headquarters as the landmark tower of the city.
 */
export const RESERVED: ReservedZone[] = [
  {
    id: "agency", name: "Agency Headquarters", bn: "এজেন্সি সদরদপ্তর",
    tagline: "The command centre of RahatVerse", x: -110, z: -110, chapter: 4,
    info: "The command post of RahatVerse & Rahat Ahmed's interactive Agency Headquarters. Enter to explore 10 interactive rooms, AI process, and avatar guide.",
    accent: PALETTE.brand,
  },
  {
    id: "museum", name: "Portfolio Museum", bn: "পোর্টফোলিও জাদুঘর",
    tagline: "Every project, every story, on display", x: 0, z: -150, chapter: 5,
    info: "All completed projects and achievements will be exhibited here as interactive exhibits. Opening in Chapter 5.",
    accent: PALETTE.gold,
  },
  {
    id: "factory", name: "Website Factory", bn: "ওয়েবসাইট কারখানা",
    tagline: "Where ideas become websites", x: 110, z: -110, chapter: 6,
    info: "The production line where client websites are engineered. Assembly begins in Chapter 6.",
    accent: PALETTE.cyan,
  },
  {
    id: "ai", name: "AI Laboratory", bn: "এআই গবেষণাগার",
    tagline: "The thinking heart of the city", x: 150, z: 0, chapter: 7,
    info: "Reserved for intelligent assistants and smart automation. Experiments start in Chapter 7.",
    accent: PALETTE.violet,
  },
  {
    id: "service", name: "Service District", bn: "সেবা জেলা",
    tagline: "Support & solutions for every visitor", x: 110, z: 110, chapter: 8,
    info: "Hosts customer support, care, and all service touchpoints. Activation planned in Chapter 8.",
    accent: PALETTE.lime,
  },
  {
    id: "order", name: "Order Center", bn: "অর্ডার কেন্দ্র",
    tagline: "Start your own website here", x: 0, z: 150, chapter: 8,
    info: "Future visitors order new websites from this hub. The order portal arrives in Chapter 8.",
    accent: PALETTE.brand,
  },
  {
    id: "client", name: "Client Hub", bn: "ক্লায়েন্ট হাব",
    tagline: "A private lounge for clients", x: -110, z: 110, chapter: 8,
    info: "A dedicated space where clients track and manage their projects. Reserved for Chapter 8.",
    accent: PALETTE.gold,
  },
  {
    id: "tower", name: "Innovation Tower", bn: "উদ্ভাবন টাওয়ার",
    tagline: "Reaching toward what's next", x: -150, z: 0, chapter: 9,
    info: "A future landmark tower for frontier experiments. The spire rises in Chapter 9.",
    accent: PALETTE.cyan,
  },
  {
    id: "secret", name: "Secret District", bn: "গোপন জেলা",
    tagline: "Only the curious find this place", x: -202, z: -202, chapter: 9,
    info: "A hidden island beyond the bridge. You found RahatVerse's best-kept secret. 🌟",
    accent: PALETTE.violet,
  },
];

export const RESERVED_PLOT_HALF = 26;

/** Waypoint-free helper: reserved zone markers sit this high above ground. */
export const PLOT_MARKER_Y = 30;

export interface HudState {
  district: string;
  districtBn: string;
  hint: string | null;
  interactable: boolean;
  collectibles: { found: number; total: number };
  timePhase: TimePhase;
  welcomeShown: boolean;
  toast: { id: number; title: string; sub?: string } | null;
  infoPanel: { title: string; body: string; accent: number } | null;
  mapOpen: boolean;
  hqModalOpen: boolean;
  muted: boolean;
}

export const initialHudState: HudState = {
  district: "Central Plaza",
  districtBn: "কেন্দ্রীয় চত্বর",
  hint: null,
  interactable: false,
  collectibles: { found: 0, total: 8 },
  timePhase: "day",
  welcomeShown: true,
  toast: null,
  infoPanel: null,
  mapOpen: false,
  hqModalOpen: false,
  muted: false,
};

/** A named location the minimap should render. */
export interface MapMarker {
  x: number;
  z: number;
  label: string;
  type: "plaza" | "zone" | "secret" | "park";
  accent: number;
}

export function buildMapMarkers(): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const d of DISTRICTS) {
    markers.push({ x: d.x, z: d.z, label: d.name, type: "park", accent: d.accent });
  }
  for (const r of RESERVED) {
    markers.push({
      x: r.x,
      z: r.z,
      label: r.name,
      type: r.id === "secret" ? "secret" : "zone",
      accent: r.accent,
    });
  }
  return markers;
}

/** Radii used for the ring roads (annulus midpoints). */
export const RING_ROADS = [118, 235];
