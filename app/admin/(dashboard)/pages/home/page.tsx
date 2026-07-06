import { PageBuilderShell } from "@/components/admin/page-builder/page-builder-shell";
import { getEditableHomePage } from "@/lib/cms/get-home-page";
import {
  getAdminGalleryImages,
  getAdminMenuItems,
  getAdminNewsPosts,
  getAdminOpeningHours,
  getAdminSiteSettings,
} from "@/lib/data/admin-site";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";

export default async function HomePageBuilderPage() {
  await requirePanelAccess();

  const [homePage, menuItems, openingHours, settings, newsPosts, galleryImages] =
    await Promise.all([
      getEditableHomePage(),
      getAdminMenuItems(),
      getAdminOpeningHours(),
      getAdminSiteSettings(),
      getAdminNewsPosts(),
      getAdminGalleryImages(),
    ]);

  const publishedNews = newsPosts.filter((post) => post.is_published);
  const publishedGallery = galleryImages.filter((image) => image.is_published);
  const homepageGallery = publishedGallery.filter(
    (image) => image.show_on_homepage,
  );

  return (
    <PageBuilderShell
      initialPage={homePage}
      menuItems={menuItems}
      openingHours={openingHours}
      contactEmail={settings.contact_email}
      newsPosts={publishedNews}
      galleryImages={
        homepageGallery.length > 0 ? homepageGallery : publishedGallery
      }
    />
  );
}
