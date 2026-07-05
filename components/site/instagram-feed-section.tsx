"use client";

import { useCallback, useState } from "react";
import { BackgroundIllustration } from "@/components/site/background-illustration";
import { ElfsightEmbed } from "@/components/site/elfsight-embed";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { SectionLabel } from "@/components/site/section-label";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { InstagramSectionContent } from "@/types/cms-content";

interface InstagramFeedSectionProps {
  content?: InstagramSectionContent;
}

export function InstagramFeedSection({ content }: InstagramFeedSectionProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.instagram;
  const [feedReady, setFeedReady] = useState(false);
  const handleFeedReady = useCallback(() => {
    setFeedReady(true);
  }, []);

  return (
    <section className="section-padding relative overflow-hidden bg-cream">
      <BackgroundIllustration
        src="/images/illustrations/cocktail-line.png"
        surface="cream"
        width={360}
        height={360}
        className="-bottom-6 -left-10 w-44 rotate-[-6deg] lg:-bottom-8 lg:-left-16 lg:w-72"
      />
      <div className="container-wide relative z-10">
        <ScrollReveal>
          <div className="section-intro">
            <SectionLabel icon={InstagramIcon}>{c.label}</SectionLabel>
            <h2 className="mt-2 text-section-title text-charcoal">
              {c.heading}
            </h2>
            <ItalianFlagAccent />
          </div>
        </ScrollReveal>

        <div
          className={cn(
            "instagram-feed-widget mt-8 w-full sm:mt-10",
            feedReady && "is-ready",
          )}
        >
          <ElfsightEmbed appId={c.elfsightAppId} onReady={handleFeedReady} />
        </div>

        <ScrollReveal delay={0.1}>
          <div className="mt-6 max-lg:flex max-lg:justify-center lg:block">
              <Link
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-burgundy uppercase transition-colors hover:text-burgundy-dark"
              >
                <InstagramIcon className="size-4" />
                {c.linkLabel}
              </Link>
            </div>
          </ScrollReveal>
      </div>
    </section>
  );
}
