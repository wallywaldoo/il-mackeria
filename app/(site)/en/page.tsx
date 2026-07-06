import { PageRenderer } from "@/components/site/page-renderer";
import {
  getHomepageGalleryImages,
  getMenuItems,
  getNewsPosts,
  getOpeningHours,
  getSiteSettings,
} from "@/lib/data/site";
import { getPublishedHomePage } from "@/lib/cms/get-home-page";
import { homeMetadataEn, restaurantJsonLd } from "@/lib/seo";

export const metadata = homeMetadataEn;

export default async function EnglishHomePage() {
  const [menuItems, openingHours, settings, homePage, newsPosts, galleryImages] =
    await Promise.all([
      getMenuItems(),
      getOpeningHours(),
      getSiteSettings(),
      getPublishedHomePage(),
      getNewsPosts(),
      getHomepageGalleryImages(),
    ]);

  const jsonLd = restaurantJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageRenderer
        sections={homePage.sections}
        menuItems={menuItems}
        openingHours={openingHours}
        contactEmail={settings.contact_email}
        newsPosts={newsPosts}
        galleryImages={galleryImages}
        locale="en"
      />
    </>
  );
}
