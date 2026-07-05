import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/types/site";

export type AdminDashboardOverview = {
  publishedMenuItems: number;
  publishedNewsPosts: number;
  publishedGalleryImages: number;
  newBookingRequests: number;
  newContactSubmissions: number;
  draftNewsPosts: number;
  unpublishedMenuItems: number;
  unpublishedGalleryImages: number;
  homePageUnpublishedChanges: number;
};

const EMPTY_OVERVIEW: AdminDashboardOverview = {
  publishedMenuItems: 0,
  publishedNewsPosts: 0,
  publishedGalleryImages: 0,
  newBookingRequests: 0,
  newContactSubmissions: 0,
  draftNewsPosts: 0,
  unpublishedMenuItems: 0,
  unpublishedGalleryImages: 0,
  homePageUnpublishedChanges: 0,
};

function sectionHasUnpublishedChanges(section: {
  content: unknown;
  draft_content: unknown;
  settings: unknown;
  draft_settings: unknown;
}): boolean {
  const contentChanged =
    JSON.stringify(section.draft_content ?? section.content) !==
    JSON.stringify(section.content);
  const settingsChanged =
    JSON.stringify(section.draft_settings ?? section.settings) !==
    JSON.stringify(section.settings);
  return contentChanged || settingsChanged;
}

async function countHomePageUnpublishedChanges(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", "home")
    .maybeSingle();

  if (!page) return 0;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("content, draft_content, settings, draft_settings")
    .eq("page_id", page.id);

  if (!sections?.length) return 0;

  return sections.filter(sectionHasUnpublishedChanges).length;
}

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  try {
    const supabase = await createClient();

    const [
      publishedMenuItemsRes,
      publishedNewsPostsRes,
      publishedGalleryImagesRes,
      newBookingRequestsRes,
      newContactSubmissionsRes,
      draftNewsPostsRes,
      unpublishedMenuItemsRes,
      unpublishedGalleryImagesRes,
      homePageUnpublishedChanges,
    ] = await Promise.all([
      supabase
        .from("menu_items")
        .select("id", { head: true, count: "exact" })
        .eq("is_published", true),
      supabase
        .from("news_posts")
        .select("id", { head: true, count: "exact" })
        .eq("is_published", true),
      supabase
        .from("gallery_images")
        .select("id", { head: true, count: "exact" })
        .eq("is_published", true),
      supabase
        .from("booking_requests")
        .select("id", { head: true, count: "exact" })
        .eq("status", "new"),
      supabase
        .from("contact_submissions")
        .select("id", { head: true, count: "exact" })
        .eq("status", "new"),
      supabase
        .from("news_posts")
        .select("id", { head: true, count: "exact" })
        .eq("is_published", false),
      supabase
        .from("menu_items")
        .select("id", { head: true, count: "exact" })
        .eq("is_published", false),
      supabase
        .from("gallery_images")
        .select("id", { head: true, count: "exact" })
        .eq("is_published", false),
      countHomePageUnpublishedChanges(supabase),
    ]);

    return {
      publishedMenuItems: publishedMenuItemsRes.count ?? 0,
      publishedNewsPosts: publishedNewsPostsRes.count ?? 0,
      publishedGalleryImages: publishedGalleryImagesRes.count ?? 0,
      newBookingRequests: newBookingRequestsRes.count ?? 0,
      newContactSubmissions: newContactSubmissionsRes.count ?? 0,
      draftNewsPosts: draftNewsPostsRes.count ?? 0,
      unpublishedMenuItems: unpublishedMenuItemsRes.count ?? 0,
      unpublishedGalleryImages: unpublishedGalleryImagesRes.count ?? 0,
      homePageUnpublishedChanges,
    };
  } catch {
    return EMPTY_OVERVIEW;
  }
}

export async function getRecentNewsPosts(limit = 3): Promise<NewsPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as NewsPost[];
  } catch {
    return [];
  }
}
