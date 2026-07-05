import { Settings } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { isAdminProfile } from "@/lib/auth/permissions";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { getAdminSiteSettings } from "@/lib/data/admin-site";

export default async function AdminSettingsPage() {
  const { profile } = await requirePanelAccess();
  if (!isAdminProfile(profile)) redirect("/admin");

  const settings = await getAdminSiteSettings();

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Inställningar"
        description="Kontaktuppgifter och banner."
      />
      <AdminPanel icon={Settings} title="Webbplatsinställningar">
        <SettingsForm settings={settings} />
      </AdminPanel>
    </AdminPageContainer>
  );
}
