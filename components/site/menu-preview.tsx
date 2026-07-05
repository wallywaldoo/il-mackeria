"use client";

import { MenuCard } from "@/components/site/menu-card";
import { BackgroundIllustration } from "@/components/site/background-illustration";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { SectionLabel } from "@/components/site/section-label";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StaggerContainer } from "@/components/motion/stagger";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import { UtensilsCrossed } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { MenuSectionContent } from "@/types/cms-content";
import type { MenuItem } from "@/types/site";

interface MenuPreviewProps {
  items: MenuItem[];
  content?: MenuSectionContent;
  locale?: Locale;
}

export function MenuPreview({
  items,
  content,
  locale = "sv",
}: MenuPreviewProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.menu;
  const preview = items.slice(0, 6);

  return (
    <section
      id="menu"
      className="section-padding relative scroll-mt-24 overflow-hidden bg-cream-light sm:scroll-mt-28 md:scroll-mt-32"
    >
      <BackgroundIllustration
        src="/images/illustrations/tomatoes-line.png"
        surface="cream"
        width={440}
        height={440}
        className="-left-10 -top-6 w-52 rotate-[-10deg] lg:-left-20 lg:-top-10 lg:w-96"
      />
      <BackgroundIllustration
        src="/images/illustrations/citrus-line.png"
        surface="cream"
        width={360}
        height={360}
        className="-bottom-8 -right-10 w-40 rotate-[8deg] lg:-bottom-12 lg:-right-16 lg:w-72"
      />
      <div className="container-wide relative z-10">
        <ScrollReveal>
          <div className="section-intro">
            <div>
              <SectionLabel icon={UtensilsCrossed}>{c.label}</SectionLabel>
              <h2 className="mt-2 text-section-title text-charcoal">
                {c.heading}
              </h2>
              <ItalianFlagAccent />
            </div>
          </div>
        </ScrollReveal>

        <StaggerContainer className="mt-10">
          {preview.map((item, i) => (
            <MenuCard
              key={item.id}
              item={item}
              index={i}
              locale={locale}
              showThumbnail
              animated
            />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
