import { UtensilsCrossed } from "lucide-react";

import { AdminBackLink, AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { requireEditAccess } from "@/lib/supabase/admin-auth";

export default async function AdminNewMenuPage() {
  await requireEditAccess();
  return (
    <AdminPageContainer>
      <AdminBackLink href="/admin/menu">Tillbaka till meny</AdminBackLink>
      <AdminPageHeader title="Nytt menyobjekt" />
      <AdminPanel icon={UtensilsCrossed} title="Detaljer">
        <MenuItemForm />
      </AdminPanel>
    </AdminPageContainer>
  );
}
