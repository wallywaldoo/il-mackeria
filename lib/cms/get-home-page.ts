import { createClient } from "@/lib/supabase/server";
import { DEFAULT_HOME_PAGE } from "@/lib/cms/defaults";
import { sortSections, toHomePageSection } from "@/lib/cms/merge-sections";
import type { PageRecord, PageSectionRow } from "@/types/cms";

async function getSupabase() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

function buildPageRecord(
  page: {
    id: string;
    slug: string;
    status: "draft" | "published";
    published_at: string | null;
    updated_at: string;
  },
  rows: PageSectionRow[],
  useDraft = false,
): PageRecord {
  const sections = sortSections(rows.map((row) => toHomePageSection(row, useDraft)));
  return {
    id: page.id,
    slug: page.slug,
    status: page.status,
    published_at: page.published_at,
    updated_at: page.updated_at,
    sections,
  };
}

export async function getPublishedHomePage(): Promise<PageRecord> {
  const supabase = await getSupabase();
  if (!supabase) return DEFAULT_HOME_PAGE;

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, slug, status, published_at, updated_at")
    .eq("slug", "home")
    .eq("status", "published")
    .maybeSingle();

  if (pageError || !page) return DEFAULT_HOME_PAGE;

  const { data: sections, error: sectionsError } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order");

  if (sectionsError || !sections?.length) return DEFAULT_HOME_PAGE;

  return buildPageRecord(page, sections as PageSectionRow[], false);
}

export async function getEditableHomePage(): Promise<PageRecord> {
  const supabase = await getSupabase();
  if (!supabase) return DEFAULT_HOME_PAGE;

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, slug, status, published_at, updated_at")
    .eq("slug", "home")
    .maybeSingle();

  if (pageError || !page) return DEFAULT_HOME_PAGE;

  const { data: sections, error: sectionsError } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order");

  if (sectionsError || !sections?.length) return DEFAULT_HOME_PAGE;

  return buildPageRecord(page, sections as PageSectionRow[], true);
}
