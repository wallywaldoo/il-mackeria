"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/components/admin/layout/admin-permissions-provider";
import { getGalleryStoragePath } from "@/lib/gallery-storage";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { GalleryImage } from "@/types/site";

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(image: GalleryImage) {
    if (
      !confirm(
        "Ta bort bilden från galleriet? Bilden tas bort från listan men kan fortfarande användas om den redan valts i innehåll.",
      )
    ) {
      return;
    }

    setDeletingId(image.id);
    const supabase = createClient();

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", image.id);

    if (error) {
      setDeletingId(null);
      toast.error("Kunde inte ta bort bilden");
      return;
    }

    const storagePath = getGalleryStoragePath(image.url);
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([storagePath]);

      if (storageError) {
        toast.success("Bilden togs bort från galleriet");
        toast.message("Filen i lagringen kunde inte tas bort");
      } else {
        toast.success("Bilden borttagen");
      }
    } else {
      toast.success("Bilden borttagen");
    }

    setDeletingId(null);
    router.refresh();
  }

  if (images.length === 0) {
    return (
      <p className="text-sm text-neutral-500">Inga bilder i galleriet ännu.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200"
        >
          <Image
            src={img.url}
            alt={img.alt_sv ?? "Galleri"}
            fill
            className="object-cover"
            sizes="200px"
          />
          {canEdit ? (
            <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
              <Button
                type="button"
                size="icon-sm"
                variant="destructive"
                disabled={deletingId === img.id}
                onClick={() => void handleDelete(img)}
                aria-label="Ta bort bild"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
