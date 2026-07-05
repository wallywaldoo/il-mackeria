"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DesktopHeroEntrance,
  MobileHeroEntrance,
} from "@/components/motion/hero-entrance";
import { AnimatedFlagBand } from "@/components/motion/flag-band";
import { BookingDialogButton } from "@/components/site/booking-dialog";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import { SITE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import { getMenuSectionHref } from "@/lib/i18n";
import { getUi } from "@/lib/i18n/messages";
import type { HeroSectionContent } from "@/types/cms-content";

function HeroAddress({
  variant = "dark",
  label,
  href,
}: {
  variant?: "dark" | "light";
  label?: string;
  href?: string;
}) {
  const displayLabel =
    label ?? `${SITE.address.street} · ${SITE.address.city}`;
  const linkHref = href ?? SITE.googleMapsUrl;

  return (
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      className={
        variant === "dark"
          ? "touch-target inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-cream/90 uppercase transition-colors hover:text-cream"
          : "touch-target inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-warm-gray uppercase transition-colors hover:text-charcoal"
      }
    >
      <MapPin className="size-3.5 shrink-0" />
      <span className="break-words">{displayLabel}</span>
    </a>
  );
}

function MobileHero({
  locale,
  content,
}: {
  locale: Locale;
  content: HeroSectionContent;
}) {
  const copy = getUi(locale);

  return (
    <div className="hero-mobile-only w-full overflow-hidden bg-hero-green">
      <div className="relative aspect-[1080/1100] w-full overflow-hidden">
        <Image
          src={content.mobileImage.url}
          alt={content.mobileImage.alt}
          fill
          unoptimized
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover object-top"
        />
        <h1 className="sr-only">{content.srOnlyTitle}</h1>
      </div>

      <MobileHeroEntrance className="flex flex-col items-center gap-2 px-4 pb-4 pt-2">
        <div className="flex w-full max-w-sm flex-col gap-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          <Button
            className="btn-site-lg w-full rounded-full bg-cream px-8 text-sm font-semibold tracking-[0.15em] text-charcoal uppercase shadow-lg sm:w-auto hover:bg-cream-light"
            render={<Link href={getMenuSectionHref(locale)} />}
          >
            {content.menuButtonLabel || copy.seeMenu}
          </Button>
          <BookingDialogButton
            locale={locale}
            variant="outline"
            className="btn-site-lg w-full rounded-full border-cream/80 bg-charcoal/20 px-8 text-sm font-semibold tracking-[0.15em] text-cream uppercase shadow-lg backdrop-blur-sm sm:w-auto hover:bg-charcoal/30 hover:text-cream"
          >
            {content.bookingButtonLabel || copy.bookCatering}
          </BookingDialogButton>
        </div>
        <HeroAddress
          variant="dark"
          label={content.addressLabel}
          href={content.addressUrl}
        />
      </MobileHeroEntrance>
    </div>
  );
}

function DesktopHero({
  locale,
  content,
}: {
  locale: Locale;
  content: HeroSectionContent;
}) {
  const copy = getUi(locale);

  return (
    <div className="hero-desktop-only relative min-h-svh w-full overflow-hidden">
      <Image
        src={content.desktopImage.url}
        alt={content.desktopImage.alt}
        fill
        unoptimized
        className="object-cover object-center"
        priority
        loading="eager"
        sizes="100vw"
      />
      <h1 className="sr-only">{content.srOnlyTitle}</h1>
      <DesktopHeroEntrance className="absolute inset-x-0 bottom-[3%] z-10 flex flex-col items-center gap-4 px-4">
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="btn-site-lg rounded-full bg-cream px-10 text-sm font-semibold tracking-[0.2em] text-charcoal uppercase shadow-lg hover:bg-cream-light"
            render={<Link href={getMenuSectionHref(locale)} />}
          >
            {content.menuButtonLabel || copy.seeMenu}
          </Button>
          <BookingDialogButton
            locale={locale}
            variant="outline"
            className="btn-site-lg rounded-full border-cream/80 bg-charcoal/20 px-10 text-sm font-semibold tracking-[0.2em] text-cream uppercase shadow-lg backdrop-blur-sm hover:bg-charcoal/30 hover:text-cream"
          >
            {content.bookingButtonLabel || copy.bookCatering}
          </BookingDialogButton>
        </div>
        <HeroAddress
          variant="dark"
          label={content.addressLabel}
          href={content.addressUrl}
        />
      </DesktopHeroEntrance>
      <AnimatedFlagBand className="absolute inset-x-0 bottom-0 z-20" />
    </div>
  );
}

interface HeroProps {
  locale?: Locale;
  content?: HeroSectionContent;
}

export function Hero({ locale = "sv", content }: HeroProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.hero;

  return (
    <section className="overflow-x-clip">
      <DesktopHero locale={locale} content={c} />
      <MobileHero locale={locale} content={c} />
    </section>
  );
}
