import { PageRenderer } from "@/components/site/page-renderer";
import {
  getMenuItems,
  getNewsPosts,
  getOpeningHours,
  getSiteSettings,
} from "@/lib/data/site";
import { getPublishedHomePage } from "@/lib/cms/get-home-page";
import { homeMetadata, restaurantJsonLd } from "@/lib/seo";

export const metadata = homeMetadata;

export default async function HomePage() {
  const [menuItems, openingHours, settings, homePage, newsPosts] =
    await Promise.all([
      getMenuItems(),
      getOpeningHours(),
      getSiteSettings(),
      getPublishedHomePage(),
      getNewsPosts(),
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
      />
    </>
  );
}
