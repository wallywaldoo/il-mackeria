"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionImage } from "@/components/site/section-image";
import { SectionIntroHeader } from "@/components/site/section-intro-header";
import { SectionShell } from "@/components/site/section-shell";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import { normalizeSectionSettings } from "@/lib/cms/section-presets";
import { isDarkSectionTheme } from "@/lib/cms/section-theme";
import type { SectionSettings, ContentBlock } from "@/lib/cms/schemas";
import type { ContentBlocksSectionContent } from "@/types/cms-content";
import { cn } from "@/lib/utils";

interface ContentBlockSectionProps {
  content?: ContentBlocksSectionContent;
  settings?: SectionSettings;
}

function TextBlock({
  block,
  dark,
}: {
  block: Extract<ContentBlock, { type: "text" }>;
  dark: boolean;
}) {
  return (
    <>
      <SectionIntroHeader
        label={block.label}
        heading={block.heading}
        icon={Sparkles}
        dark={dark}
      />
      {block.paragraphs.length > 0 ? (
        <div
          className={cn(
            "section-body mt-6",
            dark ? "text-white/80" : "text-warm-gray",
          )}
        >
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </>
  );
}

function ImageBlock({
  block,
}: {
  block: Extract<ContentBlock, { type: "image" }>;
}) {
  return (
    <div className="section-media">
      <SectionImage
        src={block.image.url}
        alt={block.image.alt}
        aspect="landscape-square-desktop"
        sizes="(max-width: 1024px) 100vw, 35vw"
        mobileShadow
      />
      {block.caption ? (
        <p className="mt-3 text-sm text-warm-gray">{block.caption}</p>
      ) : null}
    </div>
  );
}

function CtaBlock({
  block,
  dark,
}: {
  block: Extract<ContentBlock, { type: "cta" }>;
  dark: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        className={cn(
          "text-section-title",
          dark ? "text-white" : "text-charcoal",
        )}
      >
        {block.heading}
      </h2>
      {block.description ? (
        <p
          className={cn(
            "section-body mt-4",
            dark ? "text-white/80" : "text-warm-gray",
          )}
        >
          {block.description}
        </p>
      ) : null}
      <Button
        className={cn(
          "btn-site-lg mt-8",
          dark
            ? "bg-cream text-charcoal hover:bg-cream-light"
            : "bg-burgundy hover:bg-burgundy-dark",
        )}
        render={<Link href={block.buttonHref} />}
      >
        {block.buttonLabel}
      </Button>
    </div>
  );
}

export function ContentBlockSection({
  content,
  settings,
}: ContentBlockSectionProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.content_blocks;
  const s = normalizeSectionSettings("content_blocks", settings);
  const layout = s.layout ?? "text_only";
  const dark = isDarkSectionTheme(s.theme);

  const textBlock = c.blocks.find((b) => b.type === "text");
  const imageBlock = c.blocks.find((b) => b.type === "image");
  const ctaBlock = c.blocks.find((b) => b.type === "cta");

  return (
    <SectionShell id={s.anchorId} settings={s}>
      {layout !== "cta" && (c.label || c.heading) ? (
        <SectionIntroHeader
          label={c.label}
          heading={c.heading}
          icon={Sparkles}
          dark={dark}
          className="mb-8"
        />
      ) : null}

      {layout === "cta" && ctaBlock?.type === "cta" ? (
        <ScrollReveal>
          <CtaBlock block={ctaBlock} dark={dark} />
        </ScrollReveal>
      ) : null}

      {layout === "text_only" && textBlock?.type === "text" ? (
        <ScrollReveal>
          <TextBlock block={textBlock} dark={dark} />
        </ScrollReveal>
      ) : null}

      {layout === "text_image" ? (
        <div className="section-columns-12">
          {textBlock?.type === "text" ? (
            <ScrollReveal
              direction="left"
              className="max-lg:text-center lg:col-span-7"
            >
              <TextBlock block={textBlock} dark={dark} />
            </ScrollReveal>
          ) : null}
          {imageBlock?.type === "image" ? (
            <ScrollReveal
              direction="right"
              delay={0.1}
              className="section-media lg:col-span-5"
            >
              <ImageBlock block={imageBlock} />
            </ScrollReveal>
          ) : null}
        </div>
      ) : null}

      {layout === "image_text" ? (
        <div className="section-columns-12">
          {imageBlock?.type === "image" ? (
            <ScrollReveal
              direction="left"
              className="section-media max-lg:text-center lg:col-span-5"
            >
              <ImageBlock block={imageBlock} />
            </ScrollReveal>
          ) : null}
          {textBlock?.type === "text" ? (
            <ScrollReveal
              direction="right"
              delay={0.1}
              className="max-lg:text-center lg:col-span-7"
            >
              <TextBlock block={textBlock} dark={dark} />
            </ScrollReveal>
          ) : null}
        </div>
      ) : null}
    </SectionShell>
  );
}
