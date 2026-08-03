import { type User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/config/env";
import { type Profile, type UserRole } from "@/types/database";

export interface CurrentUser {
  user: User | null;
  profile: Profile | null;
}

export interface RequiredUser {
  user: User;
  profile: Profile;
}

/**
 * Get the currently authenticated Supabase user and their associated profile.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  if (!isSupabaseConfigured) {
    return { user: null, profile: null };
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: (profile as Profile) || null,
  };
}

/** Role IDs that confer admin authority (must stay in sync with DB is_admin() ). */
const ADMIN_ROLE_IDS = ["super_admin", "admin", "manager"] as const;
const CLIENT_ROLE_IDS = [
  "super_admin",
  "admin",
  "manager",
  "developer",
  "designer",
  "content_manager",
  "support_agent",
  "client",
] as const;

/** Map the new role_id system to the legacy UserRole enum. */
export function getEffectiveRole(profile: Profile | null | undefined): UserRole {
  if (!profile) return "visitor";
  const roleId = (profile as any).role_id as string | undefined;
  if (roleId) {
    if ((ADMIN_ROLE_IDS as readonly string[]).includes(roleId)) {
      // manager is treated as admin for legacy checks, but still client-capable
      if (roleId === "super_admin" || roleId === "admin" || roleId === "manager") return "admin";
    }
    if (roleId === "visitor") return "visitor";
    // everything else (client, developer, designer, content_manager, support_agent, manager) is at least client
    return "client";
  }
  return profile.role || "visitor";
}

export function isAdminProfile(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.role === "admin") return true;
  const roleId = (profile as any).role_id as string | undefined;
  return !!roleId && (ADMIN_ROLE_IDS as readonly string[]).includes(roleId);
}

export function isAtLeastClientProfile(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.role === "admin" || profile.role === "client") return true;
  const roleId = (profile as any).role_id as string | undefined;
  return !!roleId && (CLIENT_ROLE_IDS as readonly string[]).includes(roleId);
}

/**
 * Ensure the current user has one of the required roles.
 * Throws an Error if unauthorized or forbidden.
 * Admin is allowed to access client and visitor routes.
 */
export async function requireRole(role: UserRole | UserRole[]): Promise<RequiredUser> {
  const { user, profile } = await getCurrentUser();

  if (!user || !profile) {
    throw new Error("Unauthorized: authentication required");
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  const effective = getEffectiveRole(profile);

  // Direct match
  if (allowedRoles.includes(effective)) {
    return { user, profile };
  }

  // Admin can access client and visitor areas
  if (effective === "admin" && (allowedRoles.includes("client") || allowedRoles.includes("visitor"))) {
    return { user, profile };
  }

  // Client can access visitor areas
  if (effective === "client" && allowedRoles.includes("visitor")) {
    return { user, profile };
  }

  // Fallback: also accept legacy explicit checks (e.g. admin role_id super_admin)
  if (allowedRoles.includes("admin" as UserRole) && isAdminProfile(profile)) {
    return { user, profile };
  }
  if (allowedRoles.includes("client" as UserRole) && isAtLeastClientProfile(profile)) {
    return { user, profile };
  }

  throw new Error("Forbidden: insufficient role permissions");
}

/**
 * Ensure the current user is an admin.
 */
export async function requireAdmin(): Promise<RequiredUser> {
  const { user, profile } = await getCurrentUser();
  if (!user || !profile) throw new Error("Unauthorized: authentication required");
  if (!isAdminProfile(profile)) throw new Error("Forbidden: admin required");
  return { user, profile };
}

/**
 * Ensure the current user is a client (or admin).
 */
export async function requireClient(): Promise<RequiredUser> {
  const { user, profile } = await getCurrentUser();
  if (!user || !profile) throw new Error("Unauthorized: authentication required");
  if (!isAtLeastClientProfile(profile)) throw new Error("Forbidden: client required");
  return { user, profile };
}
