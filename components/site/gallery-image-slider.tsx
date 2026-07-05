"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImageFrame } from "@/components/site/image-frame";
import type { Locale } from "@/lib/i18n";
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

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const syncActiveIndex = () => {
      const slideWidth = slider.clientWidth;
      if (!slideWidth) return;
      setActiveIndex(Math.round(slider.scrollLeft / slideWidth));
    };

    syncActiveIndex();
    slider.addEventListener("scroll", syncActiveIndex, { passive: true });
    return () => slider.removeEventListener("scroll", syncActiveIndex);
  }, [images.length]);

  if (!images.length) return null;

  const scrollToIndex = (index: number) => {
    const slider = scrollRef.current;
    if (!slider) return;
    slider.scrollTo({
      left: index * slider.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-8 sm:mt-10">
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="w-full shrink-0 snap-center"
            aria-roledescription="slide"
            aria-label={`${index + 1} av ${images.length}`}
          >
            <ImageFrame
              className="w-full"
              shadow="lg"
              innerClassName="aspect-[4/5]"
            >
              <Image
                src={image.url}
                alt={getImageAlt(image, locale)}
                fill
                className="rounded-2xl object-cover"
                sizes="(max-width: 1023px) 100vw, 0px"
                priority={index === 0}
              />
            </ImageFrame>
          </div>
        ))}
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
  );
}
