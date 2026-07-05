"use client";

import Link from "next/link";
import { MapPin, Clock, Mail, Sun } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { SectionLabel } from "@/components/site/section-label";
import { BackgroundIllustration } from "@/components/site/background-illustration";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { HoverBox } from "@/components/motion/hover-box";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { SITE } from "@/lib/constants";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import { getSectionSurfaceClass } from "@/lib/cms/section-theme";
import { normalizeSectionSettings } from "@/lib/cms/section-presets";
import type { SectionSettings } from "@/lib/cms/schemas";
import { cn } from "@/lib/utils";
import type { LocationSectionContent } from "@/types/cms-content";
import type { OpeningHour } from "@/types/site";

interface LocationSectionProps {
  openingHours: OpeningHour[];
  contactEmail?: string;
  showHeading?: boolean;
  embedded?: boolean;
  className?: string;
  content?: LocationSectionContent;
  settings?: SectionSettings;
}

function InfoBox({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <HoverBox
      className={cn(
        "rounded-2xl border border-line/40 bg-cream-light p-5 text-center surface-shadow sm:p-6 md:p-8",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line/60 bg-cream text-warm-gray surface-shadow-sm">
          {icon}
        </div>
        <h3 className="font-heading text-xl font-semibold text-charcoal">
          {title}
        </h3>
      </div>
      <div className="mt-3 flex flex-col items-center">{children}</div>
    </HoverBox>
  );
}

const boxSecondaryClass =
  "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-burgundy transition-colors hover:text-burgundy-dark";

function LocationMap() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    SITE.address.full,
  )}&z=16&output=embed`;

  return (
    <ScrollReveal delay={0.12}>
      <div className="overflow-hidden rounded-2xl border border-line/40 bg-cream-light surface-shadow">
        <iframe
          title={`Karta till ${SITE.name}`}
          src={mapSrc}
          className="h-[260px] w-full sm:h-[320px] md:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </ScrollReveal>
  );
}

function LocationBoxes({
  openingHours,
  contactEmail,
  embedded = false,
}: {
  openingHours: OpeningHour[];
  contactEmail: string;
  embedded?: boolean;
}) {
  return (
    <StaggerContainer
      className={cn(
        "grid gap-6",
        embedded ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3",
      )}
    >
      <StaggerItem>
        <InfoBox title="Adress" icon={<MapPin className="size-4" />}>
        <p className="text-warm-gray">{SITE.address.full}</p>
        <Link
          href={SITE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={boxSecondaryClass}
        >
          <MapPin className="size-3.5" />
          Öppna i Google Maps
        </Link>
      </InfoBox>
      </StaggerItem>

      <StaggerItem>
        <InfoBox title="Kontakt" icon={<Mail className="size-4" />}>
        <a
          href={`mailto:${contactEmail}`}
          className="block text-warm-gray transition-colors hover:text-burgundy"
        >
          {contactEmail}
        </a>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={boxSecondaryClass}
        >
          <InstagramIcon className="size-3.5" />
          @ilmackeria
        </a>
      </InfoBox>
      </StaggerItem>

      <StaggerItem>
        <InfoBox
        title="Öppettider"
        icon={<Clock className="size-4" />}
        className={embedded ? undefined : "md:col-span-2 lg:col-span-1"}
      >
        <ul className="w-full space-y-3">
          {openingHours.map((h) => (
            <li
              key={h.id}
              className="border-b border-line/40 pb-3 last:border-0 last:pb-0"
            >
              <span className="font-medium text-charcoal">{h.label_sv}</span>
              {h.is_closed ? (
                <span className="text-warm-gray"> – Stängt</span>
              ) : (
                <span className="text-warm-gray">
                  {" "}
                  – {h.open_time?.slice(0, 5)}–{h.close_time?.slice(0, 5)}
                </span>
              )}
            </li>
          ))}
        </ul>
        {openingHours.map(
          (h) =>
            h.note_sv && (
              <span key={`note-${h.id}`} className={boxSecondaryClass}>
                <Sun className="size-3.5" />
                {h.note_sv}
              </span>
            ),
        )}
      </InfoBox>
      </StaggerItem>
    </StaggerContainer>
  );
}

export function LocationSection({
  openingHours,
  contactEmail = SITE.email,
  showHeading = true,
  embedded = false,
  className,
  content,
  settings,
}: LocationSectionProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.location;
  const s = normalizeSectionSettings("location", settings);

  const sectionContent = (
    <>
      {showHeading && (
        <ScrollReveal>
          <div className="section-intro">
            <SectionLabel icon={MapPin}>{c.label}</SectionLabel>
            <h2 className="mt-2 text-section-title text-charcoal">
              {c.heading}
            </h2>
            <ItalianFlagAccent />
          </div>
        </ScrollReveal>
      )}

      <div className={cn(showHeading && "mt-10")}>
        <LocationBoxes
          openingHours={openingHours}
          contactEmail={contactEmail}
          embedded={embedded}
        />
        {!embedded && (
          <div className="mt-8">
            <LocationMap />
          </div>
        )}
      </div>
    </>
  );

  if (embedded) {
    return <div className={className}>{sectionContent}</div>;
  }

  return (
    <section
      id="hitta-hit"
      className={cn(
        "site-section relative overflow-hidden scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32",
        getSectionSurfaceClass(s),
        className,
      )}
    >
      <BackgroundIllustration
        src="/images/illustrations/bottle-line.png"
        surface="cream"
        width={320}
        height={320}
        className="right-0 top-8 w-36 rotate-[12deg] lg:right-4 lg:top-10 lg:w-56"
      />
      <div className="container-wide relative z-10">{sectionContent}</div>
    </section>
  );
}
