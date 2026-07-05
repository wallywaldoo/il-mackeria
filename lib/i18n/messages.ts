import type { Locale } from "@/lib/i18n";

export const ui = {
  sv: {
    seeMenu: "Se menyn",
    contact: "Kontakt",
    menu: "Meny",
    booking: "Bokning",
    followInstagram: "Följ oss på Instagram",
    openMenu: "Öppna meny",
    closeMenu: "Stäng meny",
    navMenu: "Navigationsmeny",
    switchToEnglish: "Byt till engelska",
    switchToSwedish: "Byt till svenska",
    nav: [
      { href: "/menu", label: "Meny", hint: "Varm & kall schiacciata" },
      { href: "/booking", label: "Bokning", hint: "Event & catering" },
      { href: "#hitta-hit", label: "Hitta hit", hint: "Södra Hamngatan 20" },
    ],
  },
  en: {
    seeMenu: "See menu",
    contact: "Contact",
    menu: "Menu",
    booking: "Booking",
    followInstagram: "Följ oss på Instagram",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    navMenu: "Navigation menu",
    switchToEnglish: "Switch to English",
    switchToSwedish: "Switch to Swedish",
    nav: [
      { href: "/menu", label: "Menu", hint: "Warm & cold schiacciata" },
      { href: "/booking", label: "Booking", hint: "Events & catering" },
      { href: "#hitta-hit", label: "Find us", hint: "Södra Hamngatan 20" },
    ],
  },
} as const satisfies Record<
  Locale,
  {
    seeMenu: string;
    contact: string;
    menu: string;
    booking: string;
    followInstagram: string;
    openMenu: string;
    closeMenu: string;
    navMenu: string;
    switchToEnglish: string;
    switchToSwedish: string;
    nav: readonly { href: string; label: string; hint: string }[];
  }
>;

export function getUi(locale: Locale) {
  return ui[locale];
}
