import { readFileSync } from "node:fs";
import { render } from "@react-email/components";
import { Resend } from "resend";
import { BookingRequestEmail } from "../components/emails/booking-request-email";

function loadEnv() {
  return Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

const to = process.argv[2] ?? "viktordahlqvist@gmail.com";
const env = loadEnv();

const html = await render(
  BookingRequestEmail({
    name: "Anna Svensson",
    email: "anna@example.com",
    phone: "070-123 45 67",
    requested_date: "2026-08-15",
    requested_time: "18:00",
    number_of_guests: 12,
    booking_type: "private_event",
    message:
      "Detta är ett testmail så du kan se hur il mackerias e-postmall ser ut.",
  }),
);

const resend = new Resend(env.RESEND_API_KEY);
const { data, error } = await resend.emails.send({
  from: "il mackeria <noreply@ilmackeria.se>",
  to,
  subject: "Test: il mackeria e-postmall",
  html,
});

if (error) {
  console.error("Fel:", JSON.stringify(error, null, 2));
  process.exit(1);
}

console.log(`Skickat till ${to}. ID: ${data?.id}`);
