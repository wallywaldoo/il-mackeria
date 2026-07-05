import type { SectionContentMap, SectionSettings, SectionType } from "@/lib/cms/schemas";

export type PageStatus = "draft" | "published";

export interface PageSectionRow {
  id: string;
  page_id: string;
  type: SectionType;
  title: string | null;
  sort_order: number;
  is_visible: boolean;
  content: SectionContentMap[SectionType];
  draft_content: SectionContentMap[SectionType] | null;
  settings: SectionSettings;
  draft_settings: SectionSettings | null;
  updated_at: string;
}

export interface PageRow {
  id: string;
  slug: string;
  status: PageStatus;
  published_at: string | null;
  updated_at: string;
  updated_by: string | null;
}

export type HomePageSection<T extends SectionType = SectionType> = {
  id: string;
  type: T;
  title: string;
  sort_order: number;
  is_visible: boolean;
  settings: SectionSettings;
  content: SectionContentMap[T];
};

export interface PageRecord {
  id: string;
  slug: string;
  status: PageStatus;
  published_at: string | null;
  updated_at: string | null;
  sections: HomePageSection[];
}
