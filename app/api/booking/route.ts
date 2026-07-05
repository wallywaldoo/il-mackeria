import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send-email";
import { bookingSchema } from "@/lib/validations";
import { BookingRequestEmail } from "@/components/emails/booking-request-email";
import { BookingConfirmationEmail } from "@/components/emails/booking-confirmation-email";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const supabase = await createClient();
    const { error: dbError } = await supabase.from("booking_requests").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      requested_date: data.requested_date,
      requested_time: data.requested_time,
      number_of_guests: data.number_of_guests,
      booking_type: data.booking_type,
      message: data.message || null,
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: "Kunde inte spara bokningen" },
        { status: 500 },
      );
    }

    const toEmail = process.env.BOOKING_TO_EMAIL ?? "stellan@mackerian.se";

    const [ownerEmail, confirmationEmail] = await Promise.all([
      sendEmail({
        from: "il mackeria <noreply@ilmackeria.se>",
        to: toEmail,
        subject: `Ny bokningsförfrågan från ${data.name}`,
        html: await render(BookingRequestEmail(data)),
      }),
      sendEmail({
        from: "il mackeria <noreply@ilmackeria.se>",
        to: data.email,
        subject: "Tack för din bokningsförfrågan – il mackeria",
        html: await render(
          BookingConfirmationEmail({
            name: data.name,
            requested_date: data.requested_date,
            requested_time: data.requested_time,
          }),
        ),
      }),
    ]);

    const emailSent = ownerEmail.ok && confirmationEmail.ok;

    if (!emailSent) {
      const failedEmail = !ownerEmail.ok
        ? ownerEmail
        : !confirmationEmail.ok
          ? confirmationEmail
          : null;

      return NextResponse.json({
        success: true,
        emailSent: false,
        message:
          failedEmail?.reason === "not_configured"
            ? "Din förfrågan är sparad. Bekräftelsemail kunde inte skickas eftersom e-posttjänsten inte är konfigurerad."
            : "Din förfrågan är sparad, men bekräftelsemail kunde inte skickas just nu. Vi återkommer ändå.",
      });
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("Booking error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Ogiltiga uppgifter" }, { status: 400 });
    }
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
