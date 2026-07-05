import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { DEFAULT_SETTINGS } from "@/lib/mock-data";
import { getMenuItemImage } from "@/lib/menu-images";
import type {
  BookingRequest,
  ContactSubmission,
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

async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  try {
    return await createClient();
  } catch {
    return null;
  }
}

export async function getAdminMenuItems(): Promise<MenuItem[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order");

  if (error) return [];
  return withMenuImages((data ?? []) as MenuItem[]);
}

export async function getAdminNewsPosts(): Promise<NewsPost[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as NewsPost[];
}

export async function getAdminOpeningHours(): Promise<OpeningHour[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("opening_hours")
    .select("*")
    .order("sort_order");

  if (error) return [];
  return (data ?? []) as OpeningHour[];
}

export async function getAdminGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order");

  if (error) return [];
  return (data ?? []) as GalleryImage[];
}

export async function getAdminBookingRequests(): Promise<BookingRequest[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("booking_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as BookingRequest[];
}

export async function getAdminContactSubmissions(): Promise<ContactSubmission[]> {
  const supabase = await getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as ContactSubmission[];
}

export async function getAdminSiteSettings(): Promise<SiteSettings> {
  const supabase = await getSupabaseClient();
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
