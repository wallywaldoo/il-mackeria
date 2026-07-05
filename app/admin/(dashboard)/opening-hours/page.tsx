import { Clock } from "lucide-react";

import { AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { OpeningHoursForm } from "@/components/admin/opening-hours-form";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { getAdminOpeningHours } from "@/lib/data/admin-site";

export default async function AdminOpeningHoursPage() {
  await requirePanelAccess();
  const hours = await getAdminOpeningHours();

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Öppettider"
        description="Uppdatera öppettider som visas på startsidan."
      />
      <AdminPanel icon={Clock} title="Veckoschema">
        <OpeningHoursForm hours={hours} />
      </AdminPanel>
    </AdminPageContainer>
  );
}
