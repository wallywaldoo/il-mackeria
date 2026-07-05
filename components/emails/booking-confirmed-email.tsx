import { BOOKING_TYPES } from "@/lib/constants";
import {
  EmailField,
  EmailLayout,
  EmailParagraph,
} from "@/components/emails/email-layout";

interface Props {
  name: string;
  requested_date: string;
  requested_time: string;
  number_of_guests: number;
  booking_type: string;
  message?: string | null;
}

export function BookingConfirmedEmail({
  name,
  requested_date,
  requested_time,
  number_of_guests,
  booking_type,
  message,
}: Props) {
  const typeLabel =
    BOOKING_TYPES.find((t) => t.value === booking_type)?.label ?? booking_type;

  return (
    <EmailLayout
      preview="Din bokning hos il mackeria är bekräftad"
      title="Din bokning är bekräftad"
    >
      <EmailParagraph>Hej {name},</EmailParagraph>
      <EmailParagraph>
        Vi har glädjen att bekräfta din bokning hos il mackeria. Vi ser fram
        emot att välkomna dig!
      </EmailParagraph>
      <EmailField label="Datum" value={requested_date} />
      <EmailField label="Tid" value={requested_time} />
      <EmailField label="Antal gäster" value={number_of_guests} />
      <EmailField label="Typ av bokning" value={typeLabel} />
      {message ? <EmailField label="Ditt meddelande" value={message} /> : null}
      <EmailParagraph>
        Har du frågor eller behöver ändra något? Svara bara på det här mailet så
        hjälper vi dig.
      </EmailParagraph>
      <EmailParagraph>
        Varmt välkommen,
        <br />
        il mackeria
      </EmailParagraph>
    </EmailLayout>
  );
}
