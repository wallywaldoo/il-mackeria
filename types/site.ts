export type Temperature = "varm" | "kall";

export interface MenuItem {
  id: string;
  name_sv: string;
  name_en: string | null;
  description_sv: string;
  description_en: string | null;
  temperature: Temperature;
  price_full: number;
  price_half: number;
  sort_order: number;
  image_url: string | null;
  is_published: boolean;
}

export interface NewsPost {
  id: string;
  title_sv: string;
  title_en: string | null;
  content_sv: string;
  content_en: string | null;
  excerpt_sv: string | null;
  excerpt_en: string | null;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface OpeningHour {
  id: string;
  day_of_week: number;
  label_sv: string;
  label_en: string | null;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  note_sv: string | null;
  note_en: string | null;
  sort_order: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt_sv: string | null;
  alt_en: string | null;
  sort_order: number;
  is_published: boolean;
  show_on_homepage: boolean;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  requested_date: string;
  requested_time: string;
  number_of_guests: number;
  booking_type: string;
  message: string | null;
  status: "new" | "contacted" | "confirmed" | "declined";
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
}

export interface SiteSettings {
  contact_email: string;
  contact_phone: string;
  banner_text: string | null;
  banner_enabled: boolean;
}
