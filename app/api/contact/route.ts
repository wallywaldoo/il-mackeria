import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send-email";
import { contactSchema } from "@/lib/validations";
import { ContactEmail } from "@/components/emails/contact-email";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const supabase = await createClient();
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: "Kunde inte spara meddelandet" },
        { status: 500 },
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL ?? "stellan@mackerian.se";

    const result = await sendEmail({
      from: "il mackeria <noreply@ilmackeria.se>",
      to: toEmail,
      replyTo: data.email,
      subject: `Kontakt: ${data.subject}`,
      html: await render(ContactEmail(data)),
    });

    if (!result.ok) {
      return NextResponse.json({
        success: true,
        emailSent: false,
        message:
          result.reason === "not_configured"
            ? "Ditt meddelande är sparat. E-post kunde inte skickas eftersom e-posttjänsten inte är konfigurerad."
            : "Ditt meddelande är sparat, men e-post kunde inte skickas just nu. Vi återkommer ändå.",
      });
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("Contact error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Ogiltiga uppgifter" }, { status: 400 });
    }
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
