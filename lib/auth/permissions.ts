import type { UserProfile, UserRole } from "@/types/auth";

export const USER_ROLES: UserRole[] = ["admin", "editor", "viewer"];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administratör",
  editor: "Redaktör",
  viewer: "Läsare",
};

export function userRoleLabel(role: UserRole | string | null | undefined) {
  if (role && role in USER_ROLE_LABELS) {
    return USER_ROLE_LABELS[role as UserRole];
  }
  return "Okänd roll";
}

export function isActivePanelProfile(profile: UserProfile | null): boolean {
  return Boolean(
    profile &&
      profile.is_active &&
      USER_ROLES.includes(profile.role),
  );
}

export function isAdminProfile(profile: UserProfile | null): boolean {
  return Boolean(profile && profile.role === "admin" && profile.is_active);
}

export function canEditContent(profile: UserProfile | null): boolean {
  return Boolean(
    profile &&
      profile.is_active &&
      (profile.role === "admin" || profile.role === "editor"),
  );
}

export function canManageUsers(profile: UserProfile | null): boolean {
  return isAdminProfile(profile);
}

export function canAccessSettings(profile: UserProfile | null): boolean {
  return isAdminProfile(profile);
}
