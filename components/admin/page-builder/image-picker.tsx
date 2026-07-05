"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Images, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CmsImage } from "@/lib/cms/schemas";

interface ImagePickerProps {
  label: string;
  value: CmsImage;
  onChange: (value: CmsImage) => void;
  showAlt?: boolean;
  previewClassName?: string;
}

type GalleryImage = { url: string; alt_sv: string | null };

export function ImagePicker({
  label,
  value,
  onChange,
  showAlt = true,
  previewClassName,
}: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadGallery() {
    if (galleryLoaded) return;

    setLoadingGallery(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("url, alt_sv")
      .order("sort_order");

    if (error) {
      toast.error("Kunde inte hämta galleribilder");
      setLoadingGallery(false);
      return;
    }

    setGallery(data ?? []);
    setGalleryLoaded(true);
    setLoadingGallery(false);
  }

  async function handleOpenGallery() {
    setGalleryOpen(true);
    await loadGallery();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(path, file);

    if (uploadError) {
      setUploading(false);
      toast.error("Uppladdning misslyckades");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(path);

    await supabase.from("gallery_images").insert({
      url: publicUrl,
      alt_sv: value.alt || null,
      sort_order: Date.now(),
    });

    setGallery((prev) => [{ url: publicUrl, alt_sv: value.alt || null }, ...prev]);
    setGalleryLoaded(true);
    onChange({ url: publicUrl, alt: value.alt || file.name });
    setUploading(false);
    toast.success("Bild uppladdad");
    e.target.value = "";
  }

  function handleSelectFromGallery(image: GalleryImage) {
    onChange({
      url: image.url,
      alt: image.alt_sv || value.alt || "Bild",
    });
    setGalleryOpen(false);
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {value.url ? (
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-xl border border-line/50",
            previewClassName,
          )}
        >
          <Image src={value.url} alt={value.alt} fill className="object-cover" />
        </div>
      ) : (
        <div
          className={cn(
            "flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-line/60 bg-neutral-50 text-sm text-neutral-500",
            previewClassName,
          )}
        >
          Ingen bild vald
        </div>
      )}

      {showAlt ? (
        <div className="space-y-2">
          <Label className="text-xs text-warm-gray">Bildtext (för tillgänglighet)</Label>
          <Input
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Beskriv bilden kort"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          {uploading ? "Laddar upp..." : "Ladda upp bild"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void handleOpenGallery()}
        >
          <Images className="size-4" />
          Välj från galleri
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={handleUpload}
      />

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Välj bild från galleri</DialogTitle>
            <DialogDescription>
              Välj en befintlig bild, eller ladda upp en ny via knappen utanför
              dialogen.
            </DialogDescription>
          </DialogHeader>

          {loadingGallery ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              Hämtar bilder...
            </p>
          ) : gallery.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              Galleriet är tomt. Ladda upp en bild först.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {gallery.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => handleSelectFromGallery(image)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                    value.url === image.url
                      ? "border-burgundy"
                      : "border-line/40 hover:border-burgundy/50",
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt_sv || ""}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
