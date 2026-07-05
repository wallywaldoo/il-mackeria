import type { SectionSettings, SectionType } from "@/lib/cms/schemas";
import { DEFAULT_SECTION_SETTINGS } from "@/lib/cms/section-theme";

type SectionLayout = NonNullable<SectionSettings["layout"]>;

interface SectionPreset {
  theme: SectionSettings["theme"];
  spacing: SectionSettings["spacing"];
  layout?: SectionLayout;
  editable: {
    theme: boolean;
    spacing: boolean;
    layout: boolean;
    anchorId: boolean;
  };
}

const LOCKED: SectionPreset["editable"] = {
  theme: false,
  spacing: false,
  layout: false,
  anchorId: true,
};

const LAYOUT_ONLY: SectionPreset["editable"] = {
  theme: false,
  spacing: false,
  layout: true,
  anchorId: true,
};

const NO_SETTINGS: SectionPreset["editable"] = {
  theme: false,
  spacing: false,
  layout: false,
  anchorId: false,
};

export const SECTION_PRESETS: Record<SectionType, SectionPreset> = {
  hero: {
    ...DEFAULT_SECTION_SETTINGS,
    editable: NO_SETTINGS,
  },
  flag_band: {
    ...DEFAULT_SECTION_SETTINGS,
    editable: NO_SETTINGS,
  },
  intro: {
    theme: "cream",
    spacing: "default",
    editable: LOCKED,
  },
  schiacciata: {
    theme: "burgundy",
    spacing: "default",
    editable: LOCKED,
  },
  menu: {
    theme: "cream_light",
    spacing: "default",
    editable: LOCKED,
  },
  instagram: {
    theme: "cream",
    spacing: "default",
    editable: LOCKED,
  },
  booking: {
    theme: "burgundy",
    spacing: "default",
    editable: LOCKED,
  },
  location: {
    theme: "cream_light",
    spacing: "default",
    editable: LOCKED,
  },
  news: {
    theme: "cream",
    spacing: "default",
    layout: "grid",
    editable: LAYOUT_ONLY,
  },
  content_blocks: {
    theme: "cream",
    spacing: "default",
    layout: "text_only",
    editable: LAYOUT_ONLY,
  },
};

export function getContentBlocksTheme(
  layout: SectionLayout = "text_only",
): SectionSettings["theme"] {
  switch (layout) {
    case "cta":
      return "burgundy";
    case "text_image":
      return "cream_light";
    case "image_text":
      return "cream";
    case "text_only":
    default:
      return "cream_light";
  }
}

export function getSectionPreset(type: SectionType): SectionPreset {
  return SECTION_PRESETS[type];
}

export function getSectionPresetEditable(type: SectionType) {
  return SECTION_PRESETS[type].editable;
}

export function normalizeSectionSettings(
  type: SectionType,
  settings?: SectionSettings,
): SectionSettings {
  const preset = SECTION_PRESETS[type];
  const layout = (settings?.layout ?? preset.layout) as SectionLayout | undefined;

  let theme = preset.theme;
  if (type === "content_blocks") {
    theme = getContentBlocksTheme(layout ?? "text_only");
  }

  return {
    theme: preset.editable.theme
      ? (settings?.theme ?? theme)
      : theme,
    spacing: preset.editable.spacing
      ? (settings?.spacing ?? preset.spacing)
      : preset.spacing,
    layout: preset.editable.layout ? layout : preset.layout,
    anchorId: preset.editable.anchorId ? settings?.anchorId : undefined,
  };
}
