import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { enGB, sv } from "date-fns/locale";
import { ImageFrame } from "@/components/site/image-frame";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import type { NewsPost } from "@/types/site";

const FALLBACK_IMAGE = "/images/exterior.jpg";

interface NewsArticleProps {
  post: NewsPost;
  locale?: Locale;
}

function getLocalizedContent(post: NewsPost, locale: Locale) {
  const title =
    locale === "en" && post.title_en ? post.title_en : post.title_sv;
  const content =
    locale === "en" && post.content_en ? post.content_en : post.content_sv;

  if (locale === "en" && !post.title_en && post.title_sv === "Välkommen till il mackeria!") {
    return {
      title: "Welcome to il mackeria!",
      content:
        "We've opened our doors at Södra Hamngatan 20 in Strömstad. Come by and try our schiacciata – warm and cold, with fine Italian ingredients.",
    };
  }

  return { title, content };
}

export function NewsArticle({ post, locale = "sv" }: NewsArticleProps) {
  const { title, content } = getLocalizedContent(post, locale);
  const dateLocale = locale === "en" ? enGB : sv;
  const backLabel = locale === "en" ? "Back to news" : "Tillbaka till nyheter";
  const homeHref = `${withLocale("/", locale)}#nyheter`;

  return (
    <article className="section-padding bg-cream">
      <div className="container-wide">
        <Link
          href={homeHref}
          className="text-sm font-semibold tracking-wide text-burgundy uppercase transition-colors hover:text-burgundy-dark"
        >
          ← {backLabel}
        </Link>

        <div className="mx-auto mt-8 max-w-3xl">
          <ImageFrame className="mb-8" innerClassName="aspect-[16/10]">
            <Image
              src={post.image_url ?? FALLBACK_IMAGE}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </ImageFrame>

          {post.published_at && (
            <time
              dateTime={post.published_at}
              className="text-label text-italian-green"
            >
              {format(new Date(post.published_at), "d MMMM yyyy", {
                locale: dateLocale,
              })}
            </time>
          )}

          <h1 className="mt-3 text-section-title text-charcoal">
            {title}
          </h1>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-warm-gray sm:text-lg">
            {content.split(/\n{2,}/).map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
