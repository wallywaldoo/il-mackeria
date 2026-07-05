import {
  EmailField,
  EmailLayout,
  EmailParagraph,
} from "@/components/emails/email-layout";

interface Props {
  name: string;
  requested_date: string;
  requested_time: string;
}

export function BookingConfirmationEmail({
  name,
  requested_date,
  requested_time,
}: Props) {
  return (
    <EmailLayout
      preview="Tack för din bokningsförfrågan hos il mackeria"
      title="Tack för din bokningsförfrågan"
    >
      <EmailParagraph>Hej {name},</EmailParagraph>
      <EmailParagraph>
        Vi har tagit emot din bokningsförfrågan och återkommer så snart vi kan
        med bekräftelse.
      </EmailParagraph>
      <EmailField label="Önskat datum" value={requested_date} />
      <EmailField label="Önskad tid" value={requested_time} />
      <EmailParagraph>
        Vänliga hälsningar,
        <br />
        il mackeria
      </EmailParagraph>
    </EmailLayout>
  );
}
