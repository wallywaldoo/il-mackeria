import { SECTION_TYPE_META } from "@/lib/cms/section-types";
import { sectionContentSchemas } from "@/lib/cms/schemas";
import type { HomePageSection } from "@/types/cms";

export function validateHomePageSections(sections: HomePageSection[]): string[] {
  const errors: string[] = [];

  for (const section of sections) {
    if (!section.is_visible) continue;

    const schema = sectionContentSchemas[section.type];
    const result = schema.safeParse(section.content);

    if (!result.success) {
      const label = section.title || SECTION_TYPE_META[section.type].label;
      errors.push(`${label}: Kontrollera att alla fält är ifyllda.`);
    }
  }

  return errors;
}
