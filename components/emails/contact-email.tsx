import type { ContactFormData } from "@/lib/validations";
import {
  EmailField,
  EmailLayout,
} from "@/components/emails/email-layout";

export function ContactEmail(props: ContactFormData) {
  return (
    <EmailLayout
      preview={`Nytt meddelande från ${props.name}: ${props.subject}`}
      title="Nytt kontaktmeddelande"
    >
      <EmailField label="Namn" value={props.name} />
      <EmailField label="E-post" value={props.email} />
      <EmailField label="Ämne" value={props.subject} />
      <EmailField label="Meddelande" value={props.message} />
    </EmailLayout>
  );
}
