import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  canEditContent,
  canManageUsers,
  isActivePanelProfile,
  isAdminProfile,
} from "@/lib/auth/permissions";
import type { UserProfile } from "@/types/auth";

export const getCurrentUserProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: profile as UserProfile | null,
  };
});

export function isActiveAdminProfile(profile: UserProfile | null): boolean {
  return isAdminProfile(profile);
}

export {
  isActivePanelProfile,
  isAdminProfile,
  canEditContent,
  canManageUsers,
};

export function getProfileDisplayName(
  profile: UserProfile | null,
  email: string,
): string {
  if (profile?.full_name?.trim()) return profile.full_name.trim();
  const local = email.split("@")[0];
  if (!local) return "Admin";
  return local.charAt(0).toUpperCase() + local.slice(1);
}
