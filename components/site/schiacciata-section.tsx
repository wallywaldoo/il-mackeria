"use client";

import { Wheat } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { BackgroundIllustration } from "@/components/site/background-illustration";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { SectionImage } from "@/components/site/section-image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import type { SchiacciataSectionContent } from "@/types/cms-content";

interface SchiacciataSectionProps {
  content?: SchiacciataSectionContent;
}

export function SchiacciataSection({ content }: SchiacciataSectionProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.schiacciata;

  return (
    <section className="section-dark relative overflow-hidden grain section-padding">
      <BackgroundIllustration
        src="/images/illustrations/sandwich-line.png"
        surface="dark"
        width={520}
        height={520}
        className="right-0 top-16 w-44 rotate-[-6deg] lg:-bottom-16 lg:-right-24 lg:top-auto lg:w-[28rem]"
      />
      <div className="container-wide relative z-10">
        <div className="section-columns-2">
          <ScrollReveal
            direction="right"
            delay={0.08}
            className="max-lg:text-center lg:order-2 lg:flex lg:h-full lg:flex-col lg:justify-center"
          >
            <div className="section-intro">
              <SectionLabel icon={Wheat} surface="dark">
                {c.label}
              </SectionLabel>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-cream sm:text-4xl xl:text-5xl">
                {c.heading}
              </h2>
              <ItalianFlagAccent />
            </div>
            <div className="section-body mt-5 text-cream/80">
              {c.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="section-media mt-8 w-full lg:hidden">
              <SectionImage
                src={c.image.url}
                alt={c.image.alt}
                aspect="portrait"
                frameClassName="ring-1 ring-cream/10"
                mobileShadow
              />
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            className="section-media hidden lg:order-1 lg:block"
          >
            <SectionImage
              src={c.image.url}
              alt={c.image.alt}
              aspect="portrait"
              frameClassName="h-full ring-1 ring-cream/10"
              innerClassName="lg:aspect-auto lg:h-full lg:min-h-0"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return null;
}
