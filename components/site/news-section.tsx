"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { enGB, sv } from "date-fns/locale";
import { Newspaper } from "lucide-react";
import { SectionIntroHeader } from "@/components/site/section-intro-header";
import { SectionShell } from "@/components/site/section-shell";
import { DEFAULT_SECTION_CONTENT } from "@/lib/cms/defaults";
import { normalizeSectionSettings } from "@/lib/cms/section-presets";
import { isDarkSectionTheme } from "@/lib/cms/section-theme";
import type { Locale } from "@/lib/i18n";
import { getNewsPostHref } from "@/lib/i18n";
import type { SectionSettings } from "@/lib/cms/schemas";
import type { NewsSectionContent } from "@/types/cms-content";
import type { NewsPost } from "@/types/site";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGES = [
  "/images/exterior.jpg",
  "/images/interior-counter.jpg",
  "/images/sandwich-closeup.jpg",
  "/images/interior-window.jpg",
];

interface NewsSectionProps {
  posts: NewsPost[];
  content?: NewsSectionContent;
  settings?: SectionSettings;
  locale?: Locale;
}

function getNewsImage(post: NewsPost, index: number) {
  return post.image_url ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

export function NewsSection({
  posts,
  content,
  settings,
  locale = "sv",
}: NewsSectionProps) {
  const c = content ?? DEFAULT_SECTION_CONTENT.news;
  const s = normalizeSectionSettings("news", settings);
  const visiblePosts = posts.slice(0, c.postCount);

  if (!visiblePosts.length) return null;

  const dateLocale = locale === "en" ? enGB : sv;
  const readMore = locale === "en" ? "Read more" : "Läs mer";
  const layout = s.layout ?? "grid";
  const dark = isDarkSectionTheme(s.theme);
  const anchorId = s.anchorId ?? "nyheter";

  return (
    <SectionShell id={anchorId} settings={s}>
      <SectionIntroHeader
        label={c.label}
        heading={c.heading}
        icon={Newspaper}
        dark={dark}
      />

      <div
          className={cn(
            "mt-10",
            layout === "compact" && "space-y-4",
            layout === "featured" &&
              "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
            layout === "grid" && "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {visiblePosts.map((post, i) => (
            <Link
              key={post.id}
              href={getNewsPostHref(post.id, locale)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-line/40 surface-shadow transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:outline-none",
                dark ? "bg-white/10 text-white" : "bg-cream-light",
                layout === "featured" && i === 0 && "md:col-span-2 lg:col-span-1",
                layout === "featured" && i === 1 && "lg:mt-8",
              )}
            >
              <article>
                {layout !== "compact" ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getNewsImage(post, i)}
                      alt={post.title_sv}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : null}

                <div className={cn("relative", layout === "compact" ? "p-5" : "p-6 md:p-8")}>
                  {post.published_at && layout !== "compact" ? (
                    <span
                      className="pointer-events-none absolute -top-4 -right-2 font-heading text-7xl text-burgundy/5 select-none"
                      aria-hidden
                    >
                      {format(new Date(post.published_at), "d")}
                    </span>
                  ) : null}
                  <h3
                    className={cn(
                      "relative font-heading text-xl font-semibold transition-colors group-hover:text-burgundy sm:text-2xl",
                      dark ? "text-white" : "text-charcoal",
                    )}
                  >
                    {post.title_sv}
                  </h3>
                  {post.published_at ? (
                    <time
                      dateTime={post.published_at}
                      className={cn(
                        "mt-2 block text-xs tracking-widest uppercase",
                        dark ? "text-white/70" : "text-warm-gray",
                      )}
                    >
                      {format(new Date(post.published_at), "d MMMM yyyy", {
                        locale: dateLocale,
                      })}
                    </time>
                  ) : null}
                  <p
                    className={cn(
                      "relative mt-4 text-sm leading-relaxed md:text-base",
                      dark ? "text-white/80" : "text-warm-gray",
                    )}
                  >
                    {post.excerpt_sv ?? post.content_sv.slice(0, 180)}
                  </p>
                  <span className="relative mt-4 inline-block text-sm font-semibold tracking-wide text-burgundy uppercase">
                    {readMore} →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
    </SectionShell>
  );
}
