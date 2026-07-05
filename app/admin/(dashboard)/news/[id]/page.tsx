import { notFound } from "next/navigation";
import { Newspaper } from "lucide-react";

import { AdminBackLink, AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { NewsPostForm } from "@/components/admin/news-post-form";
import { canEditContent } from "@/lib/auth/profile";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/types/site";

export default async function AdminEditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await requirePanelAccess();
  const canEdit = canEditContent(profile);
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <AdminPageContainer>
      <AdminBackLink href="/admin/news">Tillbaka till nyheter</AdminBackLink>
      <AdminPageHeader title={canEdit ? "Redigera nyhet" : "Visa nyhet"} />
      <AdminPanel icon={Newspaper} title="Innehåll">
        <NewsPostForm post={data as NewsPost} />
      </AdminPanel>
    </AdminPageContainer>
  );
}
