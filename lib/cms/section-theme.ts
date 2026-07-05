import type { SectionSettings } from "@/lib/cms/schemas";

export const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  theme: "cream",
  spacing: "default",
};

export const SECTION_THEME_CLASSES: Record<
  SectionSettings["theme"],
  string
> = {
  cream: "bg-cream",
  cream_light: "bg-cream-light",
  white: "bg-white",
  burgundy: "bg-burgundy text-white",
  charcoal: "bg-charcoal text-white",
};

export const SECTION_SPACING_CLASSES: Record<
  SectionSettings["spacing"],
  string
> = {
  default: "section-padding",
  compact: "py-12 md:py-16",
  spacious: "py-24 md:py-32",
};

export function getSectionSurfaceClass(settings: SectionSettings): string {
  const theme = SECTION_THEME_CLASSES[settings.theme ?? "cream"];
  const spacing = SECTION_SPACING_CLASSES[settings.spacing ?? "default"];
  return `${theme} ${spacing}`;
}

export function isDarkSectionTheme(theme: SectionSettings["theme"]): boolean {
  return theme === "burgundy" || theme === "charcoal";
}
