import { ImageIcon } from "lucide-react";

import { AdminPanel } from "@/components/admin/admin-ui";
import { AdminPageContainer } from "@/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { GalleryGrid } from "@/components/admin/gallery-grid";
import { GalleryUploadForm } from "@/components/admin/gallery-upload-form";
import { requirePanelAccess } from "@/lib/supabase/admin-auth";
import { getAdminGalleryImages } from "@/lib/data/admin-site";

export default async function AdminGalleryPage() {
  await requirePanelAccess();
  const images = await getAdminGalleryImages();

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Galleri"
        description="Ladda upp och hantera bilder."
      />
      <AdminPanel
        icon={ImageIcon}
        title="Ladda upp"
        description="Nya bilder läggs till i galleriet"
      >
        <GalleryUploadForm />
      </AdminPanel>
      <AdminPanel
        icon={ImageIcon}
        title="Bilder"
        description={`${images.length} bilder · klicka på hus-ikonen för att välja startsidans bilder`}
      >
        <GalleryGrid images={images} />
      </AdminPanel>
    </AdminPageContainer>
  );
}
