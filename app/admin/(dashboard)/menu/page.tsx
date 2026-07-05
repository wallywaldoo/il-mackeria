import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

import {
  AdminPrimaryLink,
  AdminStatusBadge,
  AdminTableShell,
  adminTable,
} from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { canEditContent, getCurrentUserProfile } from "@/lib/auth/profile";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { getAdminMenuItems } from "@/lib/data/admin-site";

export default async function AdminMenuPage() {
  await requirePanelAccess();
  const [{ profile }, items] = await Promise.all([
    getCurrentUserProfile(),
    getAdminMenuItems(),
  ]);
  const canEdit = canEditContent(profile);

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Redigera databaser"
        description="Hantera schiacciata-mackor och priser."
        actions={
          canEdit ? (
            <AdminPrimaryLink href="/admin/menu/new">Nytt objekt</AdminPrimaryLink>
          ) : undefined
        }
      />
      <AdminTableShell
        icon={UtensilsCrossed}
        title="Menyartiklar"
        description={`${items.length} objekt`}
        isEmpty={items.length === 0}
        emptyMessage="Inga menyobjekt ännu."
      >
        <div className="overflow-x-auto">
          <table className={adminTable.table}>
            <thead className={adminTable.thead}>
              <tr>
                <th className={adminTable.th}>Namn</th>
                <th className={adminTable.th}>Temp</th>
                <th className={adminTable.th}>Pris</th>
                <th className={adminTable.th}>Status</th>
                <th className={adminTable.th}>{canEdit ? "Redigera" : "Visa"}</th>
              </tr>
            </thead>
            <tbody className={adminTable.tbody}>
              {items.map((item) => (
                <tr key={item.id} className={adminTable.tr}>
                  <td className={adminTable.tdMedium}>{item.name_sv}</td>
                  <td className={`${adminTable.td} capitalize`}>
                    {item.temperature}
                  </td>
                  <td className={adminTable.td}>
                    {item.price_full}/{item.price_half} kr
                  </td>
                  <td className={adminTable.td}>
                    <AdminStatusBadge published={item.is_published} />
                  </td>
                  <td className={adminTable.td}>
                    <Link
                      href={`/admin/menu/${item.id}`}
                      className="text-sm font-medium text-[var(--admin-accent,#9E1728)] hover:underline"
                    >
                      {canEdit ? "Redigera" : "Visa"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminPageContainer>
  );
}
