"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminPermissions } from "@/components/admin/layout/admin-permissions-provider";
import { getGalleryStoragePath } from "@/lib/gallery-storage";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/site";

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const router = useRouter();
  const { canEdit } = useAdminPermissions();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggleHomepage(image: GalleryImage) {
    setTogglingId(image.id);
    const supabase = createClient();

    const { error } = await supabase
      .from("gallery_images")
      .update({ show_on_homepage: !image.show_on_homepage })
      .eq("id", image.id);

    setTogglingId(null);

    if (error) {
      toast.error("Kunde inte uppdatera startsidans bilder");
      return;
    }

    toast.success(
      image.show_on_homepage
        ? "Bilden togs bort från startsidan"
        : "Bilden visas nu på startsidan",
    );
    router.refresh();
  }

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
          className={cn(
            "group relative aspect-square overflow-hidden rounded-xl border",
            img.show_on_homepage
              ? "border-burgundy/50 ring-2 ring-burgundy/20"
              : "border-neutral-200",
          )}
        >
          <Image
            src={img.url}
            alt={img.alt_sv ?? "Galleri"}
            fill
            className="object-cover"
            sizes="200px"
          />

          {img.show_on_homepage ? (
            <span className="absolute top-2 left-2 rounded-full bg-burgundy px-2 py-0.5 text-[10px] font-semibold tracking-wide text-cream uppercase">
              Startsida
            </span>
          ) : null}

          {canEdit ? (
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
              <Button
                type="button"
                size="icon-sm"
                variant={img.show_on_homepage ? "default" : "secondary"}
                disabled={togglingId === img.id}
                onClick={() => void handleToggleHomepage(img)}
                aria-label={
                  img.show_on_homepage
                    ? "Ta bort från startsidan"
                    : "Visa på startsidan"
                }
              >
                <Home className="size-4" />
              </Button>
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
