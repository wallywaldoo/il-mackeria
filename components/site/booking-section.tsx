"use client";

import { CalendarDays } from "lucide-react";
import { BookingDialogButton } from "@/components/site/booking-dialog";
import { BackgroundIllustration } from "@/components/site/background-illustration";
import { SectionImage } from "@/components/site/section-image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import type { Locale } from "@/lib/i18n";
import type { BookingSectionContent } from "@/types/cms-content";

interface BookingSectionProps {
  content?: BookingSectionContent;
  locale?: Locale;
}

export function BookingSection({ content, locale = "sv" }: BookingSectionProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.booking;

  return (
    <section className="section-dark relative overflow-hidden grain section-padding">
      <BackgroundIllustration
        src="/images/illustrations/vespa-line.png"
        surface="dark"
        width={520}
        height={520}
        className="-left-3 top-14 w-56 rotate-[-4deg] sm:w-64 lg:-left-6 lg:top-auto lg:bottom-0 lg:w-[26rem]"
      />
      <div className="container-wide relative z-10">
        <div className="section-columns-12-center">
          <ScrollReveal direction="left" className="max-lg:text-center lg:col-span-6">
            <div className="section-intro">
              <SectionLabel icon={CalendarDays} surface="dark">
                {c.label}
              </SectionLabel>
              <h2 className="mt-3 text-section-title text-cream">
                {c.heading}
              </h2>
              <ItalianFlagAccent />
            </div>
            <p className="section-body mt-6 text-cream/80 sm:text-lg">
              {c.description}
            </p>
            <div className="mt-8 max-lg:flex max-lg:justify-center lg:block">
              <BookingDialogButton
                locale={locale}
                className="btn-site-lg w-full max-w-sm bg-cream px-8 text-charcoal sm:w-auto hover:bg-cream-light"
              >
                {c.buttonLabel}
              </BookingDialogButton>
            </div>
            <div className="section-media mt-8 w-full lg:hidden">
              <SectionImage src={c.image.url} alt={c.image.alt} mobileShadow />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.1} className="section-media hidden lg:col-span-6 lg:block">
            <SectionImage src={c.image.url} alt={c.image.alt} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
