import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_SETTINGS,
  MOCK_GALLERY,
  MOCK_MENU_ITEMS,
  MOCK_NEWS,
  MOCK_OPENING_HOURS,
} from "@/lib/mock-data";
import { getMenuItemImage } from "@/lib/menu-images";
import type {
  BookingRequest,
  GalleryImage,
  MenuItem,
  NewsPost,
  OpeningHour,
  SiteSettings,
} from "@/types/site";

function withMenuImages(items: MenuItem[]): MenuItem[] {
  return items.map((item) => ({
    ...item,
    image_url: item.image_url ?? getMenuItemImage(item.name_sv) ?? null,
  }));
}

async function getSupabase() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = await getSupabase();
  if (!supabase) return withMenuImages(MOCK_MENU_ITEMS);

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (error || !data?.length) return withMenuImages(MOCK_MENU_ITEMS);
  return withMenuImages(data as MenuItem[]);
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const supabase = await getSupabase();
  if (!supabase) return withMenuImages(MOCK_MENU_ITEMS);

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order");

  if (error || !data?.length) return withMenuImages(MOCK_MENU_ITEMS);
  return withMenuImages(data as MenuItem[]);
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const supabase = await getSupabase();
  if (!supabase) return MOCK_NEWS;

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error || !data?.length) return MOCK_NEWS;
  return data as NewsPost[];
}

export async function getAllNewsPosts(): Promise<NewsPost[]> {
  const supabase = await getSupabase();
  if (!supabase) return MOCK_NEWS;

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return MOCK_NEWS;
  return (data ?? []) as NewsPost[];
}

export async function getNewsPostById(id: string): Promise<NewsPost | null> {
  const supabase = await getSupabase();
  if (!supabase) {
    return MOCK_NEWS.find((post) => post.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return MOCK_NEWS.find((post) => post.id === id) ?? null;
  }

  return data as NewsPost;
}

export async function getOpeningHours(): Promise<OpeningHour[]> {
  const supabase = await getSupabase();
  if (!supabase) return MOCK_OPENING_HOURS;

  const { data, error } = await supabase
    .from("opening_hours")
    .select("*")
    .order("sort_order");

  if (error || !data?.length) return MOCK_OPENING_HOURS;
  return data as OpeningHour[];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await getSupabase();
  if (!supabase) return MOCK_GALLERY;

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (error || !data?.length) return MOCK_GALLERY;
  return data as GalleryImage[];
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await getSupabase();
  if (!supabase) return MOCK_GALLERY;

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");

  if (error) return MOCK_GALLERY;
  return (data ?? []) as GalleryImage[];
}

export async function getBookingRequests(): Promise<BookingRequest[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("booking_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as BookingRequest[];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await getSupabase();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase.from("site_settings").select("*");

  if (error || !data?.length) return DEFAULT_SETTINGS;

  const settings = { ...DEFAULT_SETTINGS };
  for (const row of data) {
    const val = row.value as Record<string, unknown>;
    if (row.key === "contact") {
      settings.contact_email = (val.email as string) ?? settings.contact_email;
      settings.contact_phone = (val.phone as string) ?? settings.contact_phone;
    }
    if (row.key === "banner") {
      settings.banner_text = (val.text as string) ?? null;
      settings.banner_enabled = (val.enabled as boolean) ?? false;
    }
  }
  return settings;
}
