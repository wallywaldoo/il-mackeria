import { Mail } from "lucide-react";

import { AdminPanel } from "@/components/admin/admin-ui";
import { ContactSubmissionTable } from "@/components/admin/contact-submission-table";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { getAdminContactSubmissions } from "@/lib/data/admin-site";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";

export default async function AdminMessagesPage() {
  await requirePanelAccess();
  const submissions = await getAdminContactSubmissions();

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Meddelanden"
        description="Se och hantera meddelanden från kontaktformuläret."
      />
      <AdminPanel
        icon={Mail}
        title="Kontaktmeddelanden"
        description={`${submissions.length} meddelanden`}
      >
        <ContactSubmissionTable submissions={submissions} />
      </AdminPanel>
    </AdminPageContainer>
  );
}
