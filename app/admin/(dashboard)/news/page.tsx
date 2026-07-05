import Link from "next/link";
import { Newspaper } from "lucide-react";

import {
  AdminPrimaryLink,
  AdminStatusBadge,
  AdminTableShell,
} from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { canEditContent, getCurrentUserProfile } from "@/lib/auth/profile";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { getAdminNewsPosts } from "@/lib/data/admin-site";

export default async function AdminNewsPage() {
  await requirePanelAccess();
  const [{ profile }, posts] = await Promise.all([
    getCurrentUserProfile(),
    getAdminNewsPosts(),
  ]);
  const canEdit = canEditContent(profile);

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Nyheter"
        description="Publicera och hantera nyhetsinlägg."
        actions={
          canEdit ? (
            <AdminPrimaryLink href="/admin/news/new">Nytt inlägg</AdminPrimaryLink>
          ) : undefined
        }
      />
      <AdminTableShell
        icon={Newspaper}
        title="Inlägg"
        description={`${posts.length} inlägg`}
        isEmpty={posts.length === 0}
        emptyMessage="Inga nyhetsinlägg ännu."
      >
        <div className="divide-y divide-neutral-100">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/news/${post.id}`}
              className="flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-neutral-50 sm:px-5"
            >
              <div className="min-w-0">
                <h3 className="font-medium text-neutral-900">{post.title_sv}</h3>
                {post.excerpt_sv ? (
                  <p className="mt-1 truncate text-sm text-neutral-500">
                    {post.excerpt_sv}
                  </p>
                ) : null}
              </div>
              <AdminStatusBadge published={post.is_published} />
            </Link>
          ))}
        </div>
      </AdminTableShell>
    </AdminPageContainer>
  );
}
