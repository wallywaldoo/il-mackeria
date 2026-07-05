import { DEFAULT_SECTION_CONTENT, DEFAULT_SECTION_SETTINGS, getDefaultSectionTitle } from "@/lib/cms/defaults";
import {
  sectionContentSchemas,
  sectionSettingsSchema,
  type SectionType,
} from "@/lib/cms/schemas";
import type { HomePageSection, PageSectionRow } from "@/types/cms";

const LEGACY_HERO_MOBILE_URLS = new Set([
  "/images/sandwich-closeup.jpg",
  "/images/sandwich-display.png",
]);

function normalizeHeroContent(
  content: HomePageSection<"hero">["content"],
): HomePageSection<"hero">["content"] {
  if (LEGACY_HERO_MOBILE_URLS.has(content.mobileImage.url)) {
    return {
      ...content,
      mobileImage: DEFAULT_SECTION_CONTENT.hero.mobileImage,
    };
  }
  return content;
}

export function parseSectionSettings(raw: unknown) {
  const parsed = sectionSettingsSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_SECTION_SETTINGS;
}

export function parseSectionContent<T extends SectionType>(
  type: T,
  raw: unknown,
): HomePageSection<T>["content"] {
  const schema = sectionContentSchemas[type];
  const parsed = schema.safeParse(raw);
  if (parsed.success) {
    const content = parsed.data as HomePageSection<T>["content"];
    if (type === "hero") {
      return normalizeHeroContent(
        content as HomePageSection<"hero">["content"],
      ) as HomePageSection<T>["content"];
    }
    return content;
  }
  return DEFAULT_SECTION_CONTENT[type];
}

export function toHomePageSection(row: PageSectionRow, useDraft = false): HomePageSection {
  const raw = useDraft && row.draft_content != null ? row.draft_content : row.content;
  const settingsRaw =
    useDraft && row.draft_settings != null ? row.draft_settings : row.settings;

  return {
    id: row.id,
    type: row.type,
    title: row.title ?? getDefaultSectionTitle(row.type),
    sort_order: row.sort_order,
    is_visible: row.is_visible,
    settings: parseSectionSettings(settingsRaw),
    content: parseSectionContent(row.type, raw),
  };
}

export function sortSections(sections: HomePageSection[]): HomePageSection[] {
  return [...sections].sort((a, b) => a.sort_order - b.sort_order);
}

export function isNewSectionId(id: string): boolean {
  return id.startsWith("new-");
}
