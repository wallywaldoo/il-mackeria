import type { SectionType, SectionSettings } from "@/lib/cms/schemas";
import type { HomePageSection } from "@/types/cms";
import {
  DEFAULT_SECTION_CONTENT,
  DEFAULT_SECTION_SETTINGS,
} from "@/lib/cms/defaults";
import { normalizeSectionSettings } from "@/lib/cms/section-presets";
import { SECTION_TYPE_META } from "@/lib/cms/section-types";

export interface SectionTemplate {
  id: string;
  type: SectionType;
  title: string;
  description: string;
  defaultSettings: SectionSettings;
  defaultContent: HomePageSection["content"];
}

export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: "news-grid",
    type: "news",
    title: "Nyheter",
    description: "Visa senaste nyhetsinlägg i rutnät",
    defaultSettings: { theme: "cream", layout: "grid", spacing: "default" },
    defaultContent: {
      label: "Nyheter",
      heading: "Senaste från oss",
      postCount: 3,
    },
  },
  {
    id: "content-text-image",
    type: "content_blocks",
    title: "Text + bild",
    description: "Text till vänster och bild till höger",
    defaultSettings: {
      theme: "cream_light",
      layout: "text_image",
      spacing: "default",
    },
    defaultContent: {
      label: "Om oss",
      heading: "En ny sektion",
      blocks: [
        {
          id: "block-text-1",
          type: "text",
          label: "Etikett",
          heading: "Rubrik här",
          paragraphs: ["Skriv din text här."],
        },
        {
          id: "block-image-1",
          type: "image",
          image: {
            url: "/images/fasad.png",
            alt: "Bild",
          },
        },
      ],
    },
  },
  {
    id: "content-image-text",
    type: "content_blocks",
    title: "Bild + text",
    description: "Bild till vänster och text till höger",
    defaultSettings: {
      theme: "cream",
      layout: "image_text",
      spacing: "default",
    },
    defaultContent: {
      label: "Etikett",
      heading: "Rubrik här",
      blocks: [
        {
          id: "block-image-1",
          type: "image",
          image: {
            url: "/images/sandwich-display.png",
            alt: "Bild",
          },
        },
        {
          id: "block-text-1",
          type: "text",
          paragraphs: ["Skriv din text här."],
        },
      ],
    },
  },
  {
    id: "content-text-only",
    type: "content_blocks",
    title: "Textsektion",
    description: "Endast text utan bild",
    defaultSettings: {
      theme: "cream_light",
      layout: "text_only",
      spacing: "default",
    },
    defaultContent: {
      heading: "Rubrik här",
      blocks: [
        {
          id: "block-text-1",
          type: "text",
          paragraphs: ["Skriv din text här."],
        },
      ],
    },
  },
  {
    id: "content-cta",
    type: "content_blocks",
    title: "CTA-sektion",
    description: "Uppmaning med knapp",
    defaultSettings: {
      theme: "burgundy",
      layout: "cta",
      spacing: "default",
    },
    defaultContent: {
      blocks: [
        {
          id: "block-cta-1",
          type: "cta",
          heading: "Boka catering",
          description: "Perfekt för event och firanden.",
          buttonLabel: "Kontakta oss",
          buttonHref: "#bokning",
        },
      ],
    },
  },
  {
    id: "intro",
    type: "intro",
    title: "Välkommen",
    description: SECTION_TYPE_META.intro.description,
    defaultSettings: { theme: "cream", spacing: "default" },
    defaultContent: DEFAULT_SECTION_CONTENT.intro,
  },
  {
    id: "schiacciata",
    type: "schiacciata",
    title: "Schiacciata",
    description: SECTION_TYPE_META.schiacciata.description,
    defaultSettings: { theme: "cream_light", spacing: "default" },
    defaultContent: DEFAULT_SECTION_CONTENT.schiacciata,
  },
  {
    id: "menu",
    type: "menu",
    title: "Meny",
    description: SECTION_TYPE_META.menu.description,
    defaultSettings: { theme: "cream", spacing: "default" },
    defaultContent: DEFAULT_SECTION_CONTENT.menu,
  },
  {
    id: "instagram",
    type: "instagram",
    title: "Instagram",
    description: SECTION_TYPE_META.instagram.description,
    defaultSettings: { theme: "cream_light", spacing: "default" },
    defaultContent: DEFAULT_SECTION_CONTENT.instagram,
  },
  {
    id: "booking",
    type: "booking",
    title: "Bokning",
    description: SECTION_TYPE_META.booking.description,
    defaultSettings: { theme: "cream", spacing: "default" },
    defaultContent: DEFAULT_SECTION_CONTENT.booking,
  },
  {
    id: "location",
    type: "location",
    title: "Hitta hit",
    description: SECTION_TYPE_META.location.description,
    defaultSettings: { theme: "cream_light", spacing: "default" },
    defaultContent: DEFAULT_SECTION_CONTENT.location,
  },
  {
    id: "flag-band",
    type: "flag_band",
    title: "Flagglinje",
    description: SECTION_TYPE_META.flag_band.description,
    defaultSettings: DEFAULT_SECTION_SETTINGS,
    defaultContent: DEFAULT_SECTION_CONTENT.flag_band,
  },
];

export function createSectionFromTemplate(
  template: SectionTemplate,
  sortOrder: number,
): HomePageSection {
  return {
    id: `new-${crypto.randomUUID()}`,
    type: template.type,
    title: template.title,
    sort_order: sortOrder,
    is_visible: true,
    settings: normalizeSectionSettings(
      template.type,
      structuredClone(template.defaultSettings),
    ),
    content: structuredClone(template.defaultContent),
  };
}
