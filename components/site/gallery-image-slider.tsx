"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImageFrame } from "@/components/site/image-frame";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/site";

interface GalleryImageSliderProps {
  images: GalleryImage[];
  locale: Locale;
}

function getImageAlt(image: GalleryImage, locale: Locale) {
  if (locale === "en" && image.alt_en) return image.alt_en;
  return image.alt_sv ?? "il mackeria";
}

export function GalleryImageSlider({
  images,
  locale,
}: GalleryImageSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const copy = getUi(locale).menuLabels;

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const syncActiveIndex = () => {
      const slides = slider.querySelectorAll<HTMLElement>("[data-slide]");
      if (!slides.length) return;

      const sliderRect = slider.getBoundingClientRect();
      const sliderCenter = sliderRect.left + sliderRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const distance = Math.abs(slideCenter - sliderCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    syncActiveIndex();
    slider.addEventListener("scroll", syncActiveIndex, { passive: true });
    window.addEventListener("resize", syncActiveIndex);
    return () => {
      slider.removeEventListener("scroll", syncActiveIndex);
      window.removeEventListener("resize", syncActiveIndex);
    };
  }, [images.length]);

  if (!images.length) return null;

  const scrollToIndex = (index: number) => {
    const slider = scrollRef.current;
    const slide = slider?.querySelector<HTMLElement>(
      `[data-slide-index="${index}"]`,
    );
    if (!slider || !slide) return;

    slider.scrollTo({
      left:
        slide.offsetLeft - (slider.clientWidth - slide.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="mt-8 sm:mt-10">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => {
            const alt = getImageAlt(image, locale);

            return (
              <div
                key={image.id}
                data-slide
                data-slide-index={index}
                className="w-[82vw] shrink-0 snap-center sm:w-[58vw] md:w-[42vw] lg:w-[calc((100%-3rem)/4)]"
                aria-roledescription="slide"
                aria-label={`${index + 1} av ${images.length}`}
              >
                <ImageFrame className="w-full" shadow="lg" innerClassName="aspect-square">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`${copy.showImage} ${alt}`}
                    className="relative size-full cursor-zoom-in transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:outline-none"
                  >
                    <Image
                      src={image.url}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1023px) 82vw, 25vw"
                      priority={index < 4}
                    />
                  </button>
                </ImageFrame>
              </div>
            );
          })}
        </div>

        {images.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Visa bild ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  index === activeIndex ? "bg-burgundy" : "bg-line",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) setSelectedImage(null);
        }}
      >
        <DialogContent className="max-w-[calc(100%-2.5rem)] border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-2xl">
          {selectedImage ? (
            <>
              <DialogTitle className="sr-only">
                {getImageAlt(selectedImage, locale)}
              </DialogTitle>
              <ImageFrame innerClassName="aspect-square w-full">
                <Image
                  src={selectedImage.url}
                  alt={getImageAlt(selectedImage, locale)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 672px"
                />
              </ImageFrame>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
