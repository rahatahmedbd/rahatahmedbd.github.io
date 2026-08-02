export const MISSION_CODES = [
  "ALPHA","BETA","GAMMA","DELTA","EPSILON","ZETA","ETA","THETA","OMEGA","NOVA","PULSE","NEXUS","VOYAGER","ORION","ATLAS"
] as const;

export const TIMELINE_STAGES = [
  { id: "requirement", label: "Requirement Review", bn: "রিকোয়ারমেন্ট রিভিউ", icon: "◉", color: "#22d3ee", est: "Day 1-2" },
  { id: "planning", label: "Planning", bn: "পরিকল্পনা", icon: "⬡", color: "#a78bfa", est: "Day 2-3" },
  { id: "uiux", label: "UI/UX Design", bn: "ডিজাইন সিস্টেম", icon: "⬔", color: "#f472b6", est: "Day 3-7" },
  { id: "development", label: "Development", bn: "ডেভেলপমেন্ট", icon: "⬣", color: "#60a5fa", est: "Day 7-18" },
  { id: "testing", label: "Testing", bn: "টেস্টিং", icon: "◎", color: "#fbbf24", est: "Day 18-20" },
  { id: "review", label: "Client Review", bn: "ক্লায়েন্ট রিভিউ", icon: "⬒", color: "#34d399", est: "Day 20-22" },
  { id: "optimization", label: "Optimization", bn: "অপটিমাইজেশন", icon: "⬓", color: "#fb7185", est: "Day 22-24" },
  { id: "deployment", label: "Deployment", bn: "ডেপ্লয়মেন্ট", icon: "⬔", color: "#f43f5e", est: "Day 24-25" },
  { id: "complete", label: "Mission Complete", bn: "মিশন সম্পন্ন", icon: "★", color: "#22c55e", est: "Launch!" },
] as const;

export type TimelineStageId = typeof TIMELINE_STAGES[number]["id"];

export function getMissionCode(index: number, reference?: string) {
  if (reference) {
    // deterministic based on reference hash
    let h = 0;
    for (let i=0;i<reference.length;i++) h = (h*31 + reference.charCodeAt(i))%MISSION_CODES.length;
    return `MISSION ${MISSION_CODES[h]}`;
  }
  return `MISSION ${MISSION_CODES[index % MISSION_CODES.length]}`;
}

export function mapStatusToStageIndex(status: string): number {
  const s = status.toLowerCase();
  if (s.includes("pend")) return 0;
  if (s.includes("contact") || s.includes("review") && s.includes("require")) return 0;
  if (s.includes("plan")) return 1;
  if (s.includes("quote") || s.includes("wait")) return 1;
  if (s.includes("ui") || s.includes("design")) return 2;
  if (s.includes("dev")) return 3;
  if (s.includes("test")) return 4;
  if (s.includes("client") && s.includes("review") || s.includes("revision")) return 5;
  if (s.includes("optim")) return 6;
  if (s.includes("deploy")) return 7;
  if (s.includes("complet") || s.includes("launch") || s.includes("done")) return 8;
  // fallback incremental mapping
  if (s === "pending") return 0;
  if (s === "in_progress" || s === "active") return 3;
  return 3;
}

export function generateHoloData(stageIdx: number) {
  // sections that light up based on stage
  const sections = [
    { id: "header", label: "NAVIGATION CORE", top: 8, left: 12, w: 76, h: 10 },
    { id: "hero", label: "HERO MATRIX", top: 22, left: 8, w: 84, h: 18 },
    { id: "features", label: "FEATURE GRID", top: 44, left: 8, w: 26, h: 22 },
    { id: "about", label: "CONTENT NODE", top: 44, left: 37, w: 26, h: 22 },
    { id: "contact", label: "INTERACTION BAY", top: 44, left: 66, w: 26, h: 22 },
    { id: "footer", label: "FOOTER SYSTEMS", top: 70, left: 12, w: 76, h: 8 },
  ];
  const activeCount = Math.min(Math.max(Math.floor((stageIdx+1)/9*sections.length*1.6),1),sections.length);
  // ensure growth
  let threshold = 0;
  if (stageIdx >=0) threshold=1;
  if (stageIdx >=2) threshold=2;
  if (stageIdx >=3) threshold=4;
  if (stageIdx >=6) threshold=5;
  if (stageIdx >=8) threshold=6;
  return sections.map((sec, i) => ({ ...sec, active: i < threshold }));
}

export function formatCountdown(estimatedDelivery?: string | null) {
  if (!estimatedDelivery) return { days: 14, label: "14 Days" };
  try {
    const d = new Date(estimatedDelivery);
    const now = new Date();
    const diff = Math.max(0, Math.ceil((d.getTime() - now.getTime()) / (1000*60*60*24)));
    return { days: diff, label: `${diff} Days` };
  } catch {
    return { days: 7, label: estimatedDelivery };
  }
}
