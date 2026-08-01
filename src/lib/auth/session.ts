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

/**
 * Ensure the current user has one of the required roles.
 * Throws an Error if unauthorized or forbidden.
 */
export async function requireRole(role: UserRole | UserRole[]): Promise<RequiredUser> {
  const { user, profile } = await getCurrentUser();

  if (!user || !profile) {
    throw new Error("Unauthorized: authentication required");
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(profile.role)) {
    throw new Error("Forbidden: insufficient role permissions");
  }

  return { user, profile };
}

/**
 * Ensure the current user is an admin.
 */
export async function requireAdmin(): Promise<RequiredUser> {
  return requireRole("admin");
}

/**
 * Ensure the current user is a client (or admin).
 */
export async function requireClient(): Promise<RequiredUser> {
  return requireRole(["client", "admin"]);
}
