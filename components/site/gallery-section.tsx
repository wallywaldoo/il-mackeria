"use client";

import Image from "next/image";
import { useState } from "react";
import { Images } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryImage } from "@/types/site";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  images: GalleryImage[];
}

export function GallerySection({ images }: GallerySectionProps) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  if (!images.length) return null;

  const layoutClasses = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
  ];

  return (
    <section className="site-section section-padding bg-cream-light">
      <div className="container-wide">
        <div className="section-intro">
          <SectionLabel icon={Images}>Galleri</SectionLabel>
          <h2 className="mt-2 text-section-title text-charcoal">
            En titt in hos oss
          </h2>
          <ItalianFlagAccent />
        </div>

        <div className="mt-10 grid auto-rows-[140px] grid-cols-2 gap-2.5 sm:auto-rows-[180px] sm:gap-3 md:auto-rows-[220px] md:gap-4 lg:grid-cols-4">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(image)}
              className={cn(
                "group relative overflow-hidden rounded-xl surface-shadow-sm transition-shadow hover:surface-shadow focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:outline-none",
                layoutClasses[i % layoutClasses.length],
              )}
            >
              <Image
                src={image.url}
                alt={image.alt_sv ?? "il mackeria"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-charcoal/0 transition-colors group-hover:bg-charcoal/10" />
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-[calc(100%-2.5rem)] border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-3xl">
          {selected && (
            <>
              <DialogTitle className="sr-only">
                {selected.alt_sv ?? "Bild"}
              </DialogTitle>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl surface-shadow">
                <Image
                  src={selected.url}
                  alt={selected.alt_sv ?? "il mackeria"}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
