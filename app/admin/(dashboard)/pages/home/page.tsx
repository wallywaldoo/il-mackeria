import { PageBuilderShell } from "@/components/admin/page-builder/page-builder-shell";
import { getEditableHomePage } from "@/lib/cms/get-home-page";
import {
  getAdminMenuItems,
  getAdminNewsPosts,
  getAdminOpeningHours,
  getAdminSiteSettings,
} from "@/lib/data/admin-site";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";

export default async function HomePageBuilderPage() {
  await requirePanelAccess();

  const [homePage, menuItems, openingHours, settings, newsPosts] =
    await Promise.all([
      getEditableHomePage(),
      getAdminMenuItems(),
      getAdminOpeningHours(),
      getAdminSiteSettings(),
      getAdminNewsPosts(),
    ]);

  const publishedNews = newsPosts.filter((post) => post.is_published);

  return (
    <PageBuilderShell
      initialPage={homePage}
      menuItems={menuItems}
      openingHours={openingHours}
      contactEmail={settings.contact_email}
      newsPosts={publishedNews}
    />
  );
}
