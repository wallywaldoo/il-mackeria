import type { SectionContentMap } from "@/lib/cms/schemas";
import { CMS_EN_OVERRIDES } from "@/lib/i18n/cms-overrides";
import type { Locale } from "@/lib/i18n";
import type { MenuItem, NewsPost, OpeningHour } from "@/types/site";

const MENU_DESCRIPTION_EN: Record<string, string> = {
  "Coppa di Parma, mozzarella, röd pesto, tomat, parmesan, basilikaolja och svartpeppar.":
    "Coppa di Parma, mozzarella, red pesto, tomato, parmesan, basil oil and black pepper.",
  "Vitlökssalami, mozzarella, grön pesto, rucola, tomat, parmesan, basilikaolja och svartpeppar.":
    "Garlic salami, mozzarella, green pesto, rocket, tomato, parmesan, basil oil and black pepper.",
  "Mortadella, burrata, machésallad, tomat, pecorino, basilikaolja, pistagenötter och svartpeppar.":
    "Mortadella, burrata, lamb's lettuce, tomato, pecorino, basil oil, pistachios and black pepper.",
  "Salami ventricina, mozzarella, nduja, rucola, pecorino, picklad rödlök och svartpeppar.":
    "Ventricina salami, mozzarella, nduja, rocket, pecorino, pickled red onion and black pepper.",
  "Buffelmozzarella, tomat, olivolja, färsk basilika, grön pesto, balsamicoglaze och grovsalt.":
    "Buffalo mozzarella, tomato, olive oil, fresh basil, green pesto, balsamic glaze and coarse salt.",
  "Salami av chianino oxe, tomat, olivolja, rucola, pecorino, pistagenötter och svartpeppar.":
    "Chianina beef salami, tomato, olive oil, rocket, pecorino, pistachios and black pepper.",
};

const OPENING_HOUR_LABEL_EN: Record<string, string> = {
  "Måndag–Söndag": "Monday–Sunday",
};

const OPENING_HOUR_NOTE_EN: Record<string, string> = {
  "Hela sommaren": "All summer",
};

function mergeImageField<T extends { url: string; alt: string }>(
  base: T,
  override?: Partial<T>,
): T {
  if (!override) return base;
  return { ...base, ...override };
}

export function localizeSectionContent<T extends keyof SectionContentMap>(
  type: T,
  content: SectionContentMap[T],
  locale: Locale,
): SectionContentMap[T] {
  if (locale === "sv") return content;

  const override = CMS_EN_OVERRIDES[type];
  if (!override) return content;

  const merged = { ...content, ...override } as SectionContentMap[T];

  if (
    type === "hero" &&
    "mobileImage" in content &&
    "mobileImage" in override
  ) {
    const hero = merged as SectionContentMap["hero"];
    hero.mobileImage = mergeImageField(
      content.mobileImage,
      override.mobileImage,
    );
    hero.desktopImage = mergeImageField(
      content.desktopImage,
      override.desktopImage,
    );
    return merged;
  }

  if ("image" in content && override && "image" in override && override.image) {
    const withImage = merged as { image: { url: string; alt: string } };
    withImage.image = mergeImageField(content.image, override.image);
  }

  if (
    type === "booking" &&
    "image" in content &&
    override &&
    "image" in override &&
    override.image
  ) {
    const booking = merged as SectionContentMap["booking"];
    booking.image = mergeImageField(content.image, override.image);
  }

  return merged;
}

export function getMenuItemName(item: MenuItem, locale: Locale): string {
  if (locale === "en" && item.name_en) return item.name_en;
  return item.name_sv;
}

export function getMenuItemDescription(item: MenuItem, locale: Locale): string {
  if (locale === "en" && item.description_en) return item.description_en;
  if (locale === "en") {
    return MENU_DESCRIPTION_EN[item.description_sv] ?? item.description_sv;
  }
  return item.description_sv;
}

export function getOpeningHourLabel(hour: OpeningHour, locale: Locale): string {
  if (locale === "en" && hour.label_en) return hour.label_en;
  if (locale === "en") {
    return OPENING_HOUR_LABEL_EN[hour.label_sv] ?? hour.label_sv;
  }
  return hour.label_sv;
}

export function getOpeningHourNote(
  hour: OpeningHour,
  locale: Locale,
): string | null {
  const note = locale === "en" ? (hour.note_en ?? hour.note_sv) : hour.note_sv;
  if (!note) return null;
  if (locale === "en") return OPENING_HOUR_NOTE_EN[note] ?? note;
  return note;
}

export function getNewsPostTitle(post: NewsPost, locale: Locale): string {
  if (locale === "en" && post.title_en) return post.title_en;
  if (locale === "en" && post.title_sv === "Välkommen till il mackeria!") {
    return "Welcome to il mackeria!";
  }
  return post.title_sv;
}

export function getNewsPostExcerpt(post: NewsPost, locale: Locale): string {
  if (locale === "en" && post.excerpt_en) return post.excerpt_en;
  if (locale === "en" && post.content_en) {
    return post.excerpt_en ?? post.content_en.slice(0, 180);
  }
  if (
    locale === "en" &&
    post.excerpt_sv ===
      "Vi har öppnat dörrarna på Södra Hamngatan 20 i Strömstad."
  ) {
    return "We've opened our doors at Södra Hamngatan 20 in Strömstad.";
  }
  return post.excerpt_sv ?? post.content_sv.slice(0, 180);
}
