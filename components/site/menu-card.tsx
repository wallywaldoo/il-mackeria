"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MenuItem } from "@/types/site";
import { ImageFrame } from "@/components/site/image-frame";
import { fadeUp, DURATION, easeOut } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import {
  getMenuItemDescription,
  getMenuItemName,
} from "@/lib/i18n/localize";
import { getUi } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const MENU_FALLBACK_IMAGES = [
  "/images/sandwich-closeup.jpg",
  "/images/sandwich-display.jpg",
  "/images/menu-poster.jpg",
  "/images/interior-counter.jpg",
];

interface MenuCardProps {
  item: MenuItem;
  index?: number;
  locale?: Locale;
  className?: string;
  compact?: boolean;
  showTemperature?: boolean;
  showThumbnail?: boolean;
  animated?: boolean;
}

function getMenuImage(item: MenuItem, index: number) {
  return (
    item.image_url ??
    MENU_FALLBACK_IMAGES[index % MENU_FALLBACK_IMAGES.length]
  );
}

export function MenuCard({
  item,
  index = 0,
  locale = "sv",
  className,
  compact = false,
  showTemperature = true,
  showThumbnail = false,
  animated = false,
}: MenuCardProps) {
  const [imageOpen, setImageOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const copy = getUi(locale).menuLabels;
  const isWarm = item.temperature === "varm";
  const num = String(index + 1).padStart(2, "0");
  const imageSrc = getMenuImage(item, index);
  const name = getMenuItemName(item, locale);
  const description = getMenuItemDescription(item, locale);

  const Wrapper = animated ? motion.article : "article";

  return (
    <Wrapper
      className={cn(
        "editorial-row group border-b border-line/50 py-4 sm:py-5 md:py-6",
        className,
      )}
      {...(animated
        ? {
            variants: fadeUp,
            transition: {
              duration: reduceMotion ? 0 : DURATION,
              ease: easeOut,
            },
          }
        : {})}
    >
      <div className="flex gap-4 md:gap-5">
        {showThumbnail ? (
          <>
            <ImageFrame
              shadow="md"
              roundedClassName="rounded-xl"
              className="size-16 shrink-0 sm:size-20"
              innerClassName="size-16 sm:size-20"
            >
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                aria-label={`${copy.showImage} ${name}`}
                className="relative size-full cursor-zoom-in transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:outline-none"
              >
                <Image
                  src={imageSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            </ImageFrame>

            <Dialog open={imageOpen} onOpenChange={setImageOpen}>
              <DialogContent className="max-w-[calc(100%-2.5rem)] border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-2xl">
                <DialogTitle className="sr-only">{name}</DialogTitle>
                <ImageFrame innerClassName="aspect-[4/3] w-full">
                  <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 672px"
                  />
                </ImageFrame>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <span className="font-heading text-2xl text-wood/60 md:text-3xl">
            {num}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="editorial-name font-heading text-lg font-semibold text-charcoal sm:text-xl md:text-2xl">
              {name}
            </h3>
            {showTemperature && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide uppercase",
                  isWarm
                    ? "bg-burgundy/10 text-burgundy"
                    : "bg-italian-green/10 text-italian-green",
                )}
              >
                {isWarm ? copy.warm : copy.cold}
              </span>
            )}
          </div>
          {!compact && (
            <p className="mt-2 text-sm leading-relaxed text-warm-gray italic md:text-base">
              {description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span>
              <span className="text-warm-gray">{copy.full} </span>
              <span className="font-semibold text-charcoal">
                {item.price_full} kr
              </span>
            </span>
            <span>
              <span className="text-warm-gray">{copy.half} </span>
              <span className="font-semibold text-charcoal">
                {item.price_half} kr
              </span>
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
