import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  canEditContent,
  isActivePanelProfile,
  isAdminProfile,
} from "@/lib/auth/permissions";
import type { UserProfile } from "@/types/auth";

async function getAuthenticatedProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    profile: profile as UserProfile | null,
  };
}

export async function requirePanelAccess() {
  const session = await getAuthenticatedProfile();

  if (!session || !isActivePanelProfile(session.profile)) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireEditAccess() {
  const session = await requirePanelAccess();

  if (!canEditContent(session.profile)) {
    redirect("/admin");
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAuthenticatedProfile();

  if (!session || !isAdminProfile(session.profile)) {
    redirect("/admin/login");
  }

  return session;
}
