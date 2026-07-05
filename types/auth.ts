export type UserRole = "admin" | "editor" | "viewer";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}
