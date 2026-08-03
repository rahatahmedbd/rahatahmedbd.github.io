/**
 * CHAPTER 8 — FUTURE EXPANSION ARCHITECTURE PREPARATION
 * 
 * This file documents the extension points deliberately left open
 * in Mission Control v8 for Chapter 9+ features.
 * 
 * DO NOT IMPLEMENT — documentation only.
 * Implementations will plug into existing Supabase Realtime + activity_logs
 * and MissionShell event bus.
 */

// 1. TEAM COLLABORATION
export interface Future_TeamMember {
  profileId: string;
  role: "owner" | "stakeholder" | "viewer" | "engineer";
  missionId: string;
  permissions: string[]; // future RBAC matrix
  // Future: stored in table `mission_members` (RLS: mission owner can invite)
}
// Hook placeholder: useMissionMembers(missionId)
// Will listen to `mission_members` Realtime channel.

// 2. MULTIPLE STAKEHOLDERS
export interface Future_StakeholderInvite {
  email: string;
  missionId: string;
  token: string;
  createdBy: string;
  // Flow: client clicks "Invite Stakeholder" in Crew Profile -> creates invite -> email via Supabase edge function -> stakeholder gets viewer role
}

// 3. LIVE VIDEO MEETINGS
export interface Future_VideoRoom {
  missionId: string;
  roomId: string; // LiveKit / Daily.co / Agora
  status: "idle" | "live" | "ended";
  participants: string[];
  // Component placeholder: <LiveConsultationRoom> already exists in ServiceDistrict
  // Will integrate WebRTC SDK, keep current NOVA AI as pre-meeting triage
}

// 4. AI CODE REVIEW (NOVA v9)
export interface Future_CodeReview {
  missionId: string;
  commitSha: string;
  findings: { file: string; line: number; severity: "info"|"warn"|"error"; message: string }[];
  suggestedPatch?: string;
  // Backend: Supabase Edge Function -> calls AI model -> writes to `code_reviews` table
  // UI: will appear as additional section in TimelineReactor + HoloWebsite tooltip
}

// 5. MOBILE APPLICATION (React Native / Capacitor)
export interface Future_MobileAppConfig {
  pushProvider: "onesignal" | "fcm";
  deepLinks: { mission: string; vault: string; comms: string };
  offlineCache: "supabase-offline-query" | "watermelondb";
  // Mission Control is already PWA-ready with touch gestures and bottom dock.
  // Capacitor wrapper will reuse same components.
}

// 6. PUSH NOTIFICATIONS
export interface Future_PushSubscription {
  userId: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  // Server: Supabase Realtime -> edge function -> Web Push
  // Triggers: new file, approval needed, deployment, message
  // UI: browser Notification API already requested in HudBar future extension
}

// EVENT BUS — already in use
// window.dispatchEvent(new CustomEvent('mission-control:update', { detail: { count, unread } }))
// Future events:
// - mission-control:member-joined
// - mission-control:video-room-status
// - mission-control:code-review
// - mission-control:push-permission

// DATABASE EXTENSIONS (proposed, not created yet):
// - mission_members (mission_id, user_id, role)
// - stakeholder_invites (id, mission_id, email, token, expires_at)
// - video_rooms (id, mission_id, provider_room_id, status)
// - code_reviews (id, mission_id, created_at, findings jsonb)
// - push_subscriptions (user_id, endpoint, keys jsonb)

export const FUTURE_FLAGS = {
  teamCollab: false,
  multiStakeholder: false,
  liveVideo: false,
  aiCodeReview: false,
  mobileApp: false,
  pushNotifications: false,
} as const;

export function logFutureArchitecture() {
  // No console output in production - keeps logs clean.
  // In development, feature flags are available via FUTURE_FLAGS for debugging.
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Intentionally silent to keep console clean - use FUTURE_FLAGS directly when debugging
  }
}
