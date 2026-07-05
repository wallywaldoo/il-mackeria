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
                  content={section.content as HeroSectionContent}
                />
              );
            case "flag_band":
              return <MarqueeBand />;
            case "intro":
              return (
                <IntroSection
                  content={section.content as IntroSectionContent}
                />
              );
            case "schiacciata":
              return (
                <SchiacciataSection
                  content={section.content as SchiacciataSectionContent}
                />
              );
            case "menu":
              return (
                <MenuPreview
                  items={menuItems}
                  content={section.content as MenuSectionContent}
                />
              );
            case "news":
              return (
                <NewsSection
                  posts={newsPosts}
                  content={section.content as NewsSectionContent}
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
                  content={section.content as InstagramSectionContent}
                />
              );
            case "booking":
              return (
                <BookingSection
                  content={section.content as BookingSectionContent}
                  locale={locale}
                />
              );
            case "location":
              return (
                <LocationSection
                  openingHours={openingHours}
                  contactEmail={contactEmail}
                  content={section.content as LocationSectionContent}
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
