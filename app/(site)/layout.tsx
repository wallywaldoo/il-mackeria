import { SiteHeader } from "@/components/site/site-header";
import { Footer } from "@/components/site/footer";
import { getSiteSettings } from "@/lib/data/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader />
      {settings.banner_enabled && settings.banner_text && (
        <div className="break-words bg-burgundy px-4 py-2.5 text-center text-sm text-white">
          {settings.banner_text}
        </div>
      )}
      <main className="min-w-0 flex-1">{children}</main>
      <Footer />
    </>
  );
}
