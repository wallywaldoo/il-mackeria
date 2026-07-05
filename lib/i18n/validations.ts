import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n/messages";

export function getBookingSchema(locale: Locale) {
  const v = getUi(locale).validation;

  return z.object({
    name: z.string().min(2, v.name),
    email: z.string().email(v.email),
    phone: z.string().optional(),
    requested_date: z.string().min(1, v.date),
    requested_time: z.string().min(1, v.time),
    number_of_guests: z.coerce
      .number()
      .int()
      .min(1, v.minGuests)
      .max(200, v.maxGuests),
    booking_type: z.string().min(1, v.bookingType),
    message: z.string().optional(),
  });
}

export function getContactSchema(locale: Locale) {
  const v = getUi(locale).validation;

  return z.object({
    name: z.string().min(2, v.name),
    email: z.string().email(v.email),
    subject: z.string().min(2, v.subject),
    message: z.string().min(10, v.messageMin),
  });
}

export type BookingFormData = z.infer<ReturnType<typeof getBookingSchema>>;
export type ContactFormData = z.infer<ReturnType<typeof getContactSchema>>;
