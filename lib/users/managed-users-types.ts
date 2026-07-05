import type { UserRole } from "@/types/auth";

export type ManagedUser = {
  id: string;
  email: string | null;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};

export { userRoleLabel as managedUserRoleLabel } from "@/lib/auth/permissions";
