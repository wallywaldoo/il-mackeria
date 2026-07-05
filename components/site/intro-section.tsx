"use client";

import { Sparkles } from "lucide-react";
import { BackgroundIllustration } from "@/components/site/background-illustration";
import { SectionImage } from "@/components/site/section-image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import type { IntroSectionContent } from "@/types/cms-content";

interface IntroSectionProps {
  content?: IntroSectionContent;
}

export function IntroSection({ content }: IntroSectionProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.intro;

  return (
    <section className="section-padding relative overflow-x-clip bg-cream">
      <BackgroundIllustration
        src="/images/illustrations/lemons-line.png"
        surface="cream"
        width={420}
        height={420}
        className="-left-8 -top-8 w-48 -rotate-[5deg] -scale-x-100 sm:w-56 lg:-left-12 lg:-top-12 lg:w-80"
      />
      <div className="container-wide relative z-10">
        <div className="section-columns-12">
          <ScrollReveal direction="left" className="max-lg:text-center lg:col-span-7">
            <div className="section-intro">
              <SectionLabel icon={Sparkles}>{c.label}</SectionLabel>
              <h2 className="mt-3 text-section-title leading-tight text-charcoal">
                {c.heading}
              </h2>
              <ItalianFlagAccent />
            </div>
            <div className="section-body mt-6 text-warm-gray">
              {c.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="section-media mt-8 w-full lg:hidden">
              <SectionImage
                src={c.image.url}
                alt={c.image.alt}
                aspect="landscape-square-desktop"
                sizes="(max-width: 1024px) 100vw, 35vw"
                mobileShadow
                imageClassName="object-[center_22%]"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal
            direction="right"
            delay={0.1}
            className="section-media hidden lg:col-span-5 lg:block"
          >
            <SectionImage
              src={c.image.url}
              alt={c.image.alt}
              aspect="landscape-square-desktop"
              sizes="(max-width: 1024px) 100vw, 35vw"
              imageClassName="object-[center_35%]"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
