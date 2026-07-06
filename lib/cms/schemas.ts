import { z } from "zod";

export const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

export const sectionThemeSchema = z.enum([
  "cream",
  "cream_light",
  "white",
  "burgundy",
  "charcoal",
]);

export const sectionSpacingSchema = z.enum(["default", "compact", "spacious"]);

export const sectionSettingsSchema = z
  .object({
    theme: sectionThemeSchema.default("cream"),
    layout: z.string().optional(),
    spacing: sectionSpacingSchema.default("default"),
    anchorId: z.string().optional(),
  })
  .default({});

export type SectionSettings = z.infer<typeof sectionSettingsSchema>;
export type SectionTheme = z.infer<typeof sectionThemeSchema>;

export const flagBandSectionSchema = z.object({}).default({});

export const heroSectionSchema = z.object({
  badge: z.string().min(1),
  titleLine1: z.string().min(1),
  titleLine2: z.string().min(1),
  titleLine3: z.string().min(1),
  description: z.string().min(1),
  srOnlyTitle: z.string().min(1),
  mobileImage: imageSchema,
  desktopImage: imageSchema,
  menuButtonLabel: z.string().min(1).optional(),
  bookingButtonLabel: z.string().min(1),
  findUsButtonLabel: z.string().min(1),
  addressLabel: z.string().min(1).optional(),
  addressUrl: z.string().url().optional(),
});

export const introSectionSchema = z.object({
  label: z.string().min(1),
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  image: imageSchema,
});

export const schiacciataSectionSchema = z.object({
  label: z.string().min(1),
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  image: imageSchema,
});

export const menuSectionSchema = z.object({
  label: z.string().min(1),
  heading: z.string().min(1),
  priceLine: z.string().min(1),
});

export const instagramSectionSchema = z.object({
  label: z.string().min(1),
  heading: z.string().min(1),
  linkLabel: z.string().min(1),
  elfsightAppId: z.string().min(1).optional(),
});

export const bookingSectionSchema = z.object({
  label: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  buttonLabel: z.string().min(1),
  image: imageSchema,
});

export const locationSectionSchema = z.object({
  label: z.string().min(1),
  heading: z.string().min(1),
});

export const newsSectionSchema = z.object({
  label: z.string().min(1),
  heading: z.string().min(1),
  postCount: z.number().int().min(1).max(12).default(3),
});

export const textBlockSchema = z.object({
  id: z.string(),
  type: z.literal("text"),
  label: z.string().optional(),
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).min(1),
});

export const imageBlockSchema = z.object({
  id: z.string(),
  type: z.literal("image"),
  image: imageSchema,
  caption: z.string().optional(),
});

export const ctaBlockSchema = z.object({
  id: z.string(),
  type: z.literal("cta"),
  heading: z.string().min(1),
  description: z.string().optional(),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
});

export const contentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  imageBlockSchema,
  ctaBlockSchema,
]);

export const contentBlocksSectionSchema = z.object({
  label: z.string().optional(),
  heading: z.string().optional(),
  blocks: z.array(contentBlockSchema).min(1),
});

export const sectionContentSchemas = {
  flag_band: flagBandSectionSchema,
  hero: heroSectionSchema,
  intro: introSectionSchema,
  schiacciata: schiacciataSectionSchema,
  menu: menuSectionSchema,
  instagram: instagramSectionSchema,
  booking: bookingSectionSchema,
  location: locationSectionSchema,
  news: newsSectionSchema,
  content_blocks: contentBlocksSectionSchema,
} as const;

export type SectionType = keyof typeof sectionContentSchemas;

export type SectionContentMap = {
  [K in SectionType]: z.infer<(typeof sectionContentSchemas)[K]>;
};

export type CmsImage = z.infer<typeof imageSchema>;
export type ContentBlock = z.infer<typeof contentBlockSchema>;
