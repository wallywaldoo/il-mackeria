import { redirect } from "next/navigation";

import { ManagedUsersPanel } from "@/components/admin/managed-users-panel";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { isAdminProfile } from "@/lib/auth/permissions";
import { getCurrentUserProfile } from "@/lib/auth/profile";
import { listManagedUsers } from "@/lib/users/managed-users-data";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";

export default async function AdminManagedUsersPage() {
  const { profile } = await requirePanelAccess();
  if (!isAdminProfile(profile)) redirect("/admin");

  const [{ user }, { users, error }] = await Promise.all([
    getCurrentUserProfile(),
    listManagedUsers(),
  ]);

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Hantera användare"
        description="Bjud in och administrera konton för il mackeria."
      />
      <ManagedUsersPanel
        initialUsers={users}
        initialError={error}
        currentUserId={user?.id ?? ""}
      />
    </AdminPageContainer>
  );
}
