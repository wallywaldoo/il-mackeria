import { BOOKING_TYPES } from "@/lib/constants";
import type { BookingFormData } from "@/lib/validations";
import {
  EmailField,
  EmailLayout,
} from "@/components/emails/email-layout";

interface Props extends BookingFormData {}

export function BookingRequestEmail(props: Props) {
  const typeLabel =
    BOOKING_TYPES.find((t) => t.value === props.booking_type)?.label ??
    props.booking_type;

  return (
    <EmailLayout
      preview={`Ny bokningsförfrågan från ${props.name}`}
      title="Ny bokningsförfrågan"
    >
      <EmailField label="Namn" value={props.name} />
      <EmailField label="E-post" value={props.email} />
      {props.phone ? <EmailField label="Telefon" value={props.phone} /> : null}
      <EmailField label="Datum" value={props.requested_date} />
      <EmailField label="Tid" value={props.requested_time} />
      <EmailField label="Antal gäster" value={props.number_of_guests} />
      <EmailField label="Typ av bokning" value={typeLabel} />
      {props.message ? (
        <EmailField label="Meddelande" value={props.message} />
      ) : null}
    </EmailLayout>
  );
}
