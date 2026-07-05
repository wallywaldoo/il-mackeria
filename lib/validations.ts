import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "Ange ditt namn"),
  email: z.string().email("Ange en giltig e-postadress"),
  phone: z.string().optional(),
  requested_date: z.string().min(1, "Välj ett datum"),
  requested_time: z.string().min(1, "Välj en tid"),
  number_of_guests: z.coerce
    .number()
    .int()
    .min(1, "Minst 1 gäst")
    .max(200, "Max 200 gäster"),
  booking_type: z.string().min(1, "Välj typ av bokning"),
  message: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Ange ditt namn"),
  email: z.string().email("Ange en giltig e-postadress"),
  subject: z.string().min(2, "Ange ett ämne"),
  message: z.string().min(10, "Meddelandet måste vara minst 10 tecken"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const menuItemSchema = z.object({
  name_sv: z.string().min(1),
  name_en: z.string().optional(),
  description_sv: z.string().min(1),
  description_en: z.string().optional(),
  temperature: z.enum(["varm", "kall"]),
  price_full: z.coerce.number().int().positive(),
  price_half: z.coerce.number().int().positive(),
  sort_order: z.coerce.number().int().default(0),
  image_url: z.string().optional(),
  is_published: z.boolean().default(true),
});

export const newsPostSchema = z.object({
  title_sv: z.string().min(1),
  title_en: z.string().optional(),
  content_sv: z.string().min(1),
  content_en: z.string().optional(),
  excerpt_sv: z.string().optional(),
  excerpt_en: z.string().optional(),
  image_url: z.string().optional(),
  is_published: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
