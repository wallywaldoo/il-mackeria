import { notFound } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";

import { AdminBackLink, AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { canEditContent } from "@/lib/auth/profile";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import type { MenuItem } from "@/types/site";

export default async function AdminEditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { profile } = await requirePanelAccess();
  const canEdit = canEditContent(profile);
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <AdminPageContainer>
      <AdminBackLink href="/admin/menu">Tillbaka till meny</AdminBackLink>
      <AdminPageHeader title={canEdit ? "Redigera menyobjekt" : "Visa menyobjekt"} />
      <AdminPanel icon={UtensilsCrossed} title="Detaljer">
        <MenuItemForm item={data as MenuItem} />
      </AdminPanel>
    </AdminPageContainer>
  );
}
