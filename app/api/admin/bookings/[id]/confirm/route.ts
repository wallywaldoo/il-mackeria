import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import {
  getCurrentUserProfile,
  isActivePanelProfile,
} from "@/lib/auth/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send-email";
import { BookingConfirmedEmail } from "@/components/emails/booking-confirmed-email";
import type { BookingRequest } from "@/types/site";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, profile } = await getCurrentUserProfile();

  if (!user) {
    return NextResponse.json(
      { error: "Du måste vara inloggad." },
      { status: 401 },
    );
  }

  if (!isActivePanelProfile(profile)) {
    return NextResponse.json(
      { error: "Du saknar behörighet." },
      { status: 403 },
    );
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: booking, error: fetchError } = await admin
    .from("booking_requests")
    .select(
      "id, name, email, requested_date, requested_time, number_of_guests, booking_type, message, status",
    )
    .eq("id", id)
    .single<BookingRequest>();

  if (fetchError || !booking) {
    return NextResponse.json(
      { error: "Bokningen kunde inte hittas." },
      { status: 404 },
    );
  }

  const result = await sendEmail({
    from: "il mackeria <noreply@ilmackeria.se>",
    to: booking.email,
    subject: "Din bokning är bekräftad – il mackeria",
    html: await render(
      BookingConfirmedEmail({
        name: booking.name,
        requested_date: booking.requested_date,
        requested_time: booking.requested_time,
        number_of_guests: booking.number_of_guests,
        booking_type: booking.booking_type,
        message: booking.message,
      }),
    ),
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === "not_configured"
            ? "E-posttjänsten är inte konfigurerad. Bekräftelsen kunde inte skickas."
            : "Bekräftelsen kunde inte skickas just nu. Försök igen.",
      },
      { status: 502 },
    );
  }

  const { error: updateError } = await admin
    .from("booking_requests")
    .update({ status: "confirmed" })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      {
        success: true,
        statusUpdated: false,
        message:
          "Bekräftelsen skickades, men status kunde inte uppdateras. Uppdatera den manuellt.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ success: true, statusUpdated: true });
}
