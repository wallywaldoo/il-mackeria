import { getResend } from "@/lib/resend";

export type SendEmailResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_failed"; message: string };

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(params: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendEmailResult> {
  if (!isResendConfigured()) {
    return {
      ok: false,
      reason: "not_configured",
      message: "E-posttjänsten är inte konfigurerad.",
    };
  }

  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        ok: false,
        reason: "send_failed",
        message: "Kunde inte skicka e-post just nu.",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("Resend exception:", error);
    return {
      ok: false,
      reason: "send_failed",
      message: "Kunde inte skicka e-post just nu.",
    };
  }
}
