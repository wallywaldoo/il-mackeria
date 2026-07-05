import type { Locale } from "@/lib/i18n";

export const ui = {
  sv: {
    seeMenu: "Se menyn",
    contact: "Kontakt",
    menuLabel: "Meny",
    booking: "Bokning",
    followInstagram: "Följ oss på Instagram",
    openMenu: "Öppna meny",
    closeMenu: "Stäng meny",
    navMenu: "Navigationsmeny",
    switchToEnglish: "Byt till engelska",
    switchToSwedish: "Byt till svenska",
    bookNow: "Boka nu",
    bookCatering: "Boka catering",
    nav: [
      { href: "/menu", label: "Meny", hint: "Varm & kall schiacciata" },
      { href: "/booking", label: "Bokning", hint: "Event & catering" },
      { href: "#hitta-hit", label: "Hitta hit", hint: "Södra Hamngatan 20" },
    ],
    location: {
      address: "Adress",
      contact: "Kontakt",
      openingHours: "Öppettider",
      closed: "Stängt",
      openInMaps: "Öppna i Google Maps",
      mapTitle: "Karta till il mackeria",
      country: "Sverige",
    },
    menuLabels: {
      warm: "Varm",
      cold: "Kall",
      full: "Hel",
      half: "Halv",
      showImage: "Visa bild av",
    },
    forms: {
      name: "Namn",
      email: "E-post",
      phone: "Telefon",
      subject: "Ämne",
      message: "Meddelande",
      requestedDate: "Önskat datum",
      requestedTime: "Önskad tid",
      numberOfGuests: "Antal gäster",
      bookingType: "Typ av bokning",
      selectType: "Välj typ",
      bookingMessagePlaceholder: "Berätta gärna mer om ert event...",
      submitting: "Skickar...",
      sendMessage: "Skicka meddelande",
      sendBookingRequest: "Skicka bokningsförfrågan",
      required: "*",
      contactSuccess: "Tack! Vi har tagit emot ditt meddelande.",
      contactSaved: "Meddelandet är sparat.",
      bookingSuccess: "Tack! Vi har tagit emot din bokningsförfrågan.",
      bookingSaved:
        "Din förfrågan är sparad, men bekräftelsemail kunde inte skickas.",
      sendError: "Kunde inte skicka meddelande",
      bookingSendError: "Kunde inte skicka förfrågan",
      genericError: "Något gick fel",
    },
    bookingTypes: [
      { value: "private_event", label: "Privat event" },
      { value: "corporate", label: "Företagsevent" },
      { value: "celebration", label: "Firande / kalas" },
      { value: "other", label: "Annat" },
    ],
    validation: {
      name: "Ange ditt namn",
      email: "Ange en giltig e-postadress",
      date: "Välj ett datum",
      time: "Välj en tid",
      minGuests: "Minst 1 gäst",
      maxGuests: "Max 200 gäster",
      bookingType: "Välj typ av bokning",
      subject: "Ange ett ämne",
      messageMin: "Meddelandet måste vara minst 10 tecken",
    },
  },
  en: {
    seeMenu: "See menu",
    contact: "Contact",
    menuLabel: "Menu",
    booking: "Booking",
    followInstagram: "Follow us on Instagram",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    navMenu: "Navigation menu",
    switchToEnglish: "Switch to English",
    switchToSwedish: "Switch to Swedish",
    bookNow: "Book now",
    bookCatering: "Book catering",
    nav: [
      { href: "/menu", label: "Menu", hint: "Warm & cold schiacciata" },
      { href: "/booking", label: "Booking", hint: "Events & catering" },
      { href: "#hitta-hit", label: "Find us", hint: "Södra Hamngatan 20" },
    ],
    location: {
      address: "Address",
      contact: "Contact",
      openingHours: "Opening hours",
      closed: "Closed",
      openInMaps: "Open in Google Maps",
      mapTitle: "Map to il mackeria",
      country: "Sweden",
    },
    menuLabels: {
      warm: "Warm",
      cold: "Cold",
      full: "Full",
      half: "Half",
      showImage: "Show image of",
    },
    forms: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      subject: "Subject",
      message: "Message",
      requestedDate: "Preferred date",
      requestedTime: "Preferred time",
      numberOfGuests: "Number of guests",
      bookingType: "Type of booking",
      selectType: "Select type",
      bookingMessagePlaceholder: "Tell us more about your event...",
      submitting: "Sending...",
      sendMessage: "Send message",
      sendBookingRequest: "Send booking request",
      required: "*",
      contactSuccess: "Thank you! We have received your message.",
      contactSaved: "Your message has been saved.",
      bookingSuccess: "Thank you! We have received your booking request.",
      bookingSaved:
        "Your request has been saved, but the confirmation email could not be sent.",
      sendError: "Could not send message",
      bookingSendError: "Could not send request",
      genericError: "Something went wrong",
    },
    bookingTypes: [
      { value: "private_event", label: "Private event" },
      { value: "corporate", label: "Corporate event" },
      { value: "celebration", label: "Celebration / party" },
      { value: "other", label: "Other" },
    ],
    validation: {
      name: "Enter your name",
      email: "Enter a valid email address",
      date: "Select a date",
      time: "Select a time",
      minGuests: "At least 1 guest",
      maxGuests: "Maximum 200 guests",
      bookingType: "Select a booking type",
      subject: "Enter a subject",
      messageMin: "Message must be at least 10 characters",
    },
  },
} as const satisfies Record<
  Locale,
  {
    seeMenu: string;
    contact: string;
    menuLabel: string;
    booking: string;
    followInstagram: string;
    openMenu: string;
    closeMenu: string;
    navMenu: string;
    switchToEnglish: string;
    switchToSwedish: string;
    bookNow: string;
    bookCatering: string;
    nav: readonly { href: string; label: string; hint: string }[];
    location: {
      address: string;
      contact: string;
      openingHours: string;
      closed: string;
      openInMaps: string;
      mapTitle: string;
      country: string;
    };
    menuLabels: {
      warm: string;
      cold: string;
      full: string;
      half: string;
      showImage: string;
    };
    forms: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      requestedDate: string;
      requestedTime: string;
      numberOfGuests: string;
      bookingType: string;
      selectType: string;
      bookingMessagePlaceholder: string;
      submitting: string;
      sendMessage: string;
      sendBookingRequest: string;
      required: string;
      contactSuccess: string;
      contactSaved: string;
      bookingSuccess: string;
      bookingSaved: string;
      sendError: string;
      bookingSendError: string;
      genericError: string;
    };
    bookingTypes: readonly { value: string; label: string }[];
    validation: {
      name: string;
      email: string;
      date: string;
      time: string;
      minGuests: string;
      maxGuests: string;
      bookingType: string;
      subject: string;
      messageMin: string;
    };
  }
>;

export function getUi(locale: Locale) {
  return ui[locale];
}

export function getBookingTypes(locale: Locale) {
  return ui[locale].bookingTypes;
}
