import { AdminShell } from "@/components/admin/layout/admin-shell";
import { AdminSupabaseNotice } from "@/components/admin/admin-supabase-notice";
import {
  canEditContent,
  canManageUsers,
  getCurrentUserProfile,
  getProfileDisplayName,
} from "@/lib/auth/profile";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requirePanelAccess();
  const { profile } = await getCurrentUserProfile();
  const email = user.email ?? "";
  const displayName = getProfileDisplayName(profile, email);
  const role = profile?.role ?? "viewer";
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <AdminShell
      displayName={displayName}
      email={email}
      role={role}
      canEdit={canEditContent(profile)}
      canManageUsers={canManageUsers(profile)}
    >
      {!supabaseConfigured ? (
        <div className="border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
          <AdminSupabaseNotice />
        </div>
      ) : null}
      {children}
    </AdminShell>
  );
}
