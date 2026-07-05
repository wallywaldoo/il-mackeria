"use client";

import { Fragment, type ReactNode } from "react";
import { PreviewSectionFrame } from "@/components/admin/page-builder/preview-section-frame";
import { MarqueeBand } from "@/components/site/marquee-band";
import { Hero } from "@/components/site/hero";
import { IntroSection } from "@/components/site/intro-section";
import { SchiacciataSection } from "@/components/site/schiacciata-section";
import { MenuPreview } from "@/components/site/menu-preview";
import { InstagramFeedSection } from "@/components/site/instagram-feed-section";
import { BookingSection } from "@/components/site/booking-section";
import { LocationSection } from "@/components/site/location-section";
import { NewsSection } from "@/components/site/news-section";
import { ContentBlockSection } from "@/components/site/content-block-section";
import { normalizeSectionSettings } from "@/lib/cms/section-presets";
import { localizeSectionContent } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n";
import type { HomePageSection } from "@/types/cms";
import type { MenuItem, NewsPost, OpeningHour } from "@/types/site";
import type {
  BookingSectionContent,
  ContentBlocksSectionContent,
  HeroSectionContent,
  InstagramSectionContent,
  IntroSectionContent,
  LocationSectionContent,
  MenuSectionContent,
  NewsSectionContent,
  SchiacciataSectionContent,
} from "@/types/cms-content";

interface PageRendererProps {
  sections: HomePageSection[];
  menuItems: MenuItem[];
  openingHours: OpeningHour[];
  contactEmail: string;
  newsPosts?: NewsPost[];
  locale?: Locale;
  preview?: boolean;
  activeSectionId?: string;
}

export function PageRenderer({
  sections,
  menuItems,
  openingHours,
  contactEmail,
  newsPosts = [],
  locale = "sv",
  preview = false,
  activeSectionId,
}: PageRendererProps) {
  const sectionsToRender = preview
    ? sections
    : sections.filter((section) => section.is_visible);

  function wrapPreviewSection(section: HomePageSection, node: ReactNode) {
    if (!preview || !activeSectionId) return node;

    return (
      <PreviewSectionFrame
        sectionId={section.id}
        title={section.title}
        active={section.id === activeSectionId}
        hidden={!section.is_visible}
      >
        {node}
      </PreviewSectionFrame>
    );
  }

  return (
    <div className={preview ? "pointer-events-none" : undefined}>
      {sectionsToRender.map((section) => {
        const rendered = (() => {
          switch (section.type) {
            case "hero":
              return (
                <Hero
                  locale={locale}
                  content={localizeSectionContent(
                    "hero",
                    section.content as HeroSectionContent,
                    locale,
                  )}
                />
              );
            case "flag_band":
              return <MarqueeBand />;
            case "intro":
              return (
                <IntroSection
                  content={localizeSectionContent(
                    "intro",
                    section.content as IntroSectionContent,
                    locale,
                  )}
                />
              );
            case "schiacciata":
              return (
                <SchiacciataSection
                  content={localizeSectionContent(
                    "schiacciata",
                    section.content as SchiacciataSectionContent,
                    locale,
                  )}
                />
              );
            case "menu":
              return (
                <MenuPreview
                  items={menuItems}
                  locale={locale}
                  content={localizeSectionContent(
                    "menu",
                    section.content as MenuSectionContent,
                    locale,
                  )}
                />
              );
            case "news":
              return (
                <NewsSection
                  posts={newsPosts}
                  content={localizeSectionContent(
                    "news",
                    section.content as NewsSectionContent,
                    locale,
                  )}
                  settings={normalizeSectionSettings(
                    "news",
                    section.settings,
                  )}
                  locale={locale}
                />
              );
            case "content_blocks":
              return (
                <ContentBlockSection
                  content={section.content as ContentBlocksSectionContent}
                  settings={normalizeSectionSettings(
                    "content_blocks",
                    section.settings,
                  )}
                />
              );
            case "instagram":
              return (
                <InstagramFeedSection
                  content={localizeSectionContent(
                    "instagram",
                    section.content as InstagramSectionContent,
                    locale,
                  )}
                />
              );
            case "booking":
              return (
                <BookingSection
                  content={localizeSectionContent(
                    "booking",
                    section.content as BookingSectionContent,
                    locale,
                  )}
                  locale={locale}
                />
              );
            case "location":
              return (
                <LocationSection
                  openingHours={openingHours}
                  contactEmail={contactEmail}
                  locale={locale}
                  content={localizeSectionContent(
                    "location",
                    section.content as LocationSectionContent,
                    locale,
                  )}
                  settings={normalizeSectionSettings(
                    "location",
                    section.settings,
                  )}
                />
              );
            default:
              return null;
          }
        })();

        if (!rendered) return null;

        return (
          <Fragment key={section.id}>
            {wrapPreviewSection(section, rendered)}
          </Fragment>
        );
      })}
    </div>
  );
}
