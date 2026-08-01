"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminAvailable, publicEnv } from "@/config/env";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  initSuperAdminSchema,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
  type InitSuperAdminInput,
} from "@/lib/validation/schemas";

/**
 * Get client IP and User Agent from request headers.
 */
function getRequestMetadata() {
  const headersList = headers();
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const userAgent = headersList.get("user-agent") || "unknown";
  return { ipAddress, userAgent };
}

/**
 * Log login history.
 */
async function logLoginHistory(
  userId: string | null,
  status: "success" | "failed",
  failureReason: string | null = null
) {
  const { ipAddress, userAgent } = getRequestMetadata();
  try {
    const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : await getSupabaseServerClient();
    await client.from("login_history").insert({
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
      status,
      failure_reason: failureReason,
    });
  } catch (err) {
    console.error("Failed to log login history:", err);
  }
}

/**
 * Log activity.
 */
async function logActivity(
  userId: string,
  action: string,
  meta: Record<string, any> = {}
) {
  const { ipAddress, userAgent } = getRequestMetadata();
  try {
    const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : await getSupabaseServerClient();
    await client.from("activity_logs").insert({
      user_id: userId,
      action,
      ip_address: ipAddress,
      user_agent: userAgent,
      meta,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

/**
 * Check if the initial Super Admin has been registered.
 */
export async function hasSuperAdmin(): Promise<boolean> {
  try {
    const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : await getSupabaseServerClient();
    const { count, error } = await client
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("role_id", ["super_admin", "admin"]);

    if (error) throw error;
    return (count ?? 0) > 0;
  } catch (err) {
    console.error("Error checking for super admin:", err);
    return false;
  }
}

/**
 * Secure Login Action
 */
export async function loginAction(input: LoginInput) {
  const validation = loginSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Validation failed", errors: validation.error.flatten().fieldErrors };
  }

  const { email, password } = validation.data;
  const { ipAddress, userAgent } = getRequestMetadata();

  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Find user profile by email using admin client (if available) to log failed attempt under their ID
      let userId: string | null = null;
      try {
        if (isSupabaseAdminAvailable) {
          const adminClient = getSupabaseAdminClient();
          const { data: userProfile } = await adminClient
            .from("profiles")
            .select("id")
            .eq("email", email)
            .single();
          userId = userProfile?.id || null;
        }
      } catch {
        // ignore
      }

      await logLoginHistory(userId, "failed", error.message);
      return { success: false, error: error.message };
    }

    const user = data.user;
    if (user) {
      await logLoginHistory(user.id, "success");
      await logActivity(user.id, "login", { ip: ipAddress, userAgent });

      // Create session record
      try {
        const client = isSupabaseAdminAvailable ? getSupabaseAdminClient() : await getSupabaseServerClient();
        await client.from("session_records").insert({
          user_id: user.id,
          session_id: data.session?.access_token?.slice(-20) || null,
          user_agent: userAgent,
          ip_address: ipAddress,
        });
      } catch (err) {
        console.error("Failed to log session record:", err);
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

/**
 * Secure Logout Action
 */
export async function logoutAction() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await logActivity(user.id, "logout");
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Logout failed" };
  }
}

/**
 * Forgot Password Action
 */
export async function forgotPasswordAction(input: ForgotPasswordInput) {
  const validation = forgotPasswordSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Validation failed", errors: validation.error.flatten().fieldErrors };
  }

  const { email } = validation.data;
  const origin = headers().get("origin") || publicEnv.siteUrl;
  const redirectUrl = `${origin}/reset-password`;

  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Log the request
    try {
      if (isSupabaseAdminAvailable) {
        const adminClient = getSupabaseAdminClient();
        const { data: profile } = await adminClient
          .from("profiles")
          .select("id")
          .eq("email", email)
          .single();
        if (profile) {
          await logActivity(profile.id, "password_reset_request");
        }
      }
    } catch {
      // ignore
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Request failed" };
  }
}

/**
 * Reset Password Action (using token/recovery flow)
 */
export async function resetPasswordAction(input: ResetPasswordInput) {
  const validation = resetPasswordSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Validation failed", errors: validation.error.flatten().fieldErrors };
  }

  const { password } = validation.data;

  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const user = data.user;
    if (user) {
      await logActivity(user.id, "password_reset_success");
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Reset failed" };
  }
}

/**
 * Change Password Action (for logged in users, validating current password first)
 */
export async function changePasswordAction(input: ChangePasswordInput) {
  const validation = changePasswordSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Validation failed", errors: validation.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = validation.data;

  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { success: false, error: "Unauthorized: Please log in first" };
    }

    // Secure practice: Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      await logActivity(user.id, "password_change_failed", { reason: "Incorrect current password" });
      return { success: false, error: "Incorrect current password" };
    }

    // Now update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    await logActivity(user.id, "password_change_success");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to change password" };
  }
}

/**
 * Initialize first Super Admin account
 */
export async function initSuperAdminAction(input: InitSuperAdminInput) {
  const validation = initSuperAdminSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: "Validation failed", errors: validation.error.flatten().fieldErrors };
  }

  const { fullName, email, password, phone } = validation.data;

  // Verify that NO admin exists yet
  const adminExists = await hasSuperAdmin();
  if (adminExists) {
    return { success: false, error: "Initial Super Admin is already registered. Registration is locked." };
  }

  try {
    const supabase = await getSupabaseServerClient();
    
    // Sign up with Super Admin metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "super_admin",
          phone: phone || null,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const user = data.user;
    if (user) {
      await logActivity(user.id, "super_admin_initialized", { email, fullName });
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Initialization failed" };
  }
}

/**
 * Register future staff accounts. Restricted to Super Admins.
 */
export async function registerStaffAction(input: {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  phone?: string;
}) {
  const { fullName, email, password, roleId, phone } = input;

  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify current user is Super Admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", user.id)
      .single();

    if (profile?.role_id !== "super_admin") {
      return { success: false, error: "Forbidden: Only the Super Admin can register staff accounts" };
    }

    // Ensure we are using the Admin client since standard signup logs in the user,
    // which is not desired when an admin registers staff.
    if (!isSupabaseAdminAvailable) {
      return { success: false, error: "Supabase service role is not configured, cannot create staff accounts" };
    }

    const adminClient = getSupabaseAdminClient();
    const { data: newStaff, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: roleId,
        phone: phone || null,
      },
    });

    if (createError) {
      return { success: false, error: createError.message };
    }

    if (newStaff.user) {
      await logActivity(user.id, "staff_account_created", {
        staff_id: newStaff.user.id,
        staff_email: email,
        role: roleId,
      });
    }

    return { success: true, user: newStaff.user };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create staff account" };
  }
}
