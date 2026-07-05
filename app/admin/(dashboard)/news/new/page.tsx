import { Newspaper } from "lucide-react";

import { AdminBackLink, AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { NewsPostForm } from "@/components/admin/news-post-form";
import { requireEditAccess } from "@/lib/supabase/admin-auth";

export default async function AdminNewNewsPage() {
  await requireEditAccess();
  return (
    <AdminPageContainer>
      <AdminBackLink href="/admin/news">Tillbaka till nyheter</AdminBackLink>
      <AdminPageHeader title="Nytt nyhetsinlägg" />
      <AdminPanel icon={Newspaper} title="Innehåll">
        <NewsPostForm />
      </AdminPanel>
    </AdminPageContainer>
  );
}
