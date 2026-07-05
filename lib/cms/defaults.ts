import type { HomePageSection, PageRecord } from "@/types/cms";
import type { SectionContentMap } from "@/lib/cms/schemas";
import type { SectionSettings } from "@/lib/cms/schemas";

export const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  theme: "cream",
  spacing: "default",
};

export const DEFAULT_SECTION_CONTENT: SectionContentMap = {
  flag_band: {},
  hero: {
    badge: "Öppet 11–19 hela sommaren",
    titleLine1: "Italienska",
    titleLine2: "schiacciata",
    titleLine3: "i Strömstad",
    description:
      "Varmt, enkelt och gott – italienska mackor, deli och takeaway på Södra Hamngatan 20.",
    srOnlyTitle: "Italienska schiacciata i hjärtat av Strömstad",
    mobileImage: {
      url: "/images/hero-mobile.png",
      alt: "Italian schiacciata – il mackeria",
    },
    desktopImage: {
      url: "/images/hero-desktop.png",
      alt: "Italienska schiacciata i hjärtat av Strömstad",
    },
    menuButtonLabel: "Se menyn",
    bookingButtonLabel: "Boka catering",
    findUsButtonLabel: "Hitta hit",
    addressLabel: "Södra Hamngatan 20 · Strömstad",
    addressUrl:
      "https://maps.google.com/?q=Södra+Hamngatan+20,+Strömstad,+Sverige",
  },
  intro: {
    label: "Välkommen",
    heading: "En liten bit av Italien i Strömstad",
    paragraphs: [
      "il mackeria är en schiacciateria, mackbar och deli på Södra Hamngatan 20 – mitt i sommarstaden Strömstad. Vi bakar schiacciata, ett italienskt plattbröd med luftbubblor och krispig yta, och fyller det med fina råvaror från Italien.",
      "Här handlar det om enkla, varma smaker – som en riktig italiensk macka ska smaka. Ta med dig en schiacciata till havet, eller stanna en stund i vår lilla deli.",
    ],
    image: {
      url: "/images/fasad.png",
      alt: "il mackeria utifrån på Södra Hamngatan i Strömstad",
    },
  },
  schiacciata: {
    label: "Om vårt upplägg",
    heading: "Vad är schiacciata?",
    paragraphs: [
      "Schiacciata betyder \"plattad\" på italienska. Det är ett plattbröd från Toscana med mycket luftbubblor, lätt salt och en krispig yta – som focaccia, men plattare och med sin egen karaktär.",
      "Hos il mackeria fyller vi schiacciatan med fina råvaror – från coppa di Parma och burrata till nduja och färsk basilika. Varm värms den i ugnen, kall serveras den färsk.",
    ],
    image: {
      url: "/images/sandwich-display.png",
      alt: "Schiacciata upplagd i disken på il mackeria",
    },
  },
  menu: {
    label: "Meny",
    heading: "Vår meny",
    priceLine: "Hel 125 kr · Halv 75 kr",
  },
  instagram: {
    label: "Sociala medier",
    heading: "En titt in hos oss",
    linkLabel: "Följ @ilmackeria",
    elfsightAppId: "2c9003f0-39a0-4c60-abf1-321e7ac4e7e2",
  },
  booking: {
    label: "Event",
    heading: "Privata bokningar",
    description:
      "Vill du boka il mackeria för ett privat event, företagslunch eller firande? Vi tar gärna emot er – fyll i formuläret så återkommer vi.",
    buttonLabel: "Boka nu",
    image: {
      url: "/images/private-booking.png",
      alt: "Välkomnande personal bakom disken på il mackeria",
    },
  },
  location: {
    label: "Besök oss",
    heading: "Hitta hit",
  },
  news: {
    label: "Nyheter",
    heading: "Senaste från oss",
    postCount: 3,
  },
  content_blocks: {
    label: "Etikett",
    heading: "Rubrik här",
    blocks: [
      {
        id: "block-text-1",
        type: "text",
        paragraphs: ["Skriv din text här."],
      },
    ],
  },
};

const SECTION_TITLES: Record<HomePageSection["type"], string> = {
  hero: "Hero",
  flag_band: "Flagglinje",
  intro: "Välkommen",
  schiacciata: "Schiacciata",
  menu: "Meny",
  instagram: "Instagram",
  booking: "Bokning",
  location: "Hitta hit",
  news: "Nyheter",
  content_blocks: "Innehållssektion",
};

export const DEFAULT_HOME_SECTIONS: HomePageSection[] = [
  {
    id: "default-hero",
    type: "hero",
    title: "Hero",
    sort_order: 0,
    is_visible: true,
    settings: DEFAULT_SECTION_SETTINGS,
    content: DEFAULT_SECTION_CONTENT.hero,
  },
  {
    id: "default-flag",
    type: "flag_band",
    title: "Flagglinje",
    sort_order: 1,
    is_visible: true,
    settings: DEFAULT_SECTION_SETTINGS,
    content: DEFAULT_SECTION_CONTENT.flag_band,
  },
  {
    id: "default-intro",
    type: "intro",
    title: "Välkommen",
    sort_order: 2,
    is_visible: true,
    settings: DEFAULT_SECTION_SETTINGS,
    content: DEFAULT_SECTION_CONTENT.intro,
  },
  {
    id: "default-schiacciata",
    type: "schiacciata",
    title: "Schiacciata",
    sort_order: 3,
    is_visible: true,
    settings: { theme: "cream_light", spacing: "default" },
    content: DEFAULT_SECTION_CONTENT.schiacciata,
  },
  {
    id: "default-menu",
    type: "menu",
    title: "Meny",
    sort_order: 4,
    is_visible: true,
    settings: DEFAULT_SECTION_SETTINGS,
    content: DEFAULT_SECTION_CONTENT.menu,
  },
  {
    id: "default-instagram",
    type: "instagram",
    title: "Instagram",
    sort_order: 5,
    is_visible: true,
    settings: { theme: "cream_light", spacing: "default" },
    content: DEFAULT_SECTION_CONTENT.instagram,
  },
  {
    id: "default-booking",
    type: "booking",
    title: "Bokning",
    sort_order: 6,
    is_visible: true,
    settings: DEFAULT_SECTION_SETTINGS,
    content: DEFAULT_SECTION_CONTENT.booking,
  },
  {
    id: "default-location",
    type: "location",
    title: "Hitta hit",
    sort_order: 7,
    is_visible: true,
    settings: { theme: "cream_light", spacing: "default" },
    content: DEFAULT_SECTION_CONTENT.location,
  },
];

export function getDefaultSectionTitle(type: HomePageSection["type"]): string {
  return SECTION_TITLES[type];
}

export const DEFAULT_HOME_PAGE: PageRecord = {
  id: "default-home",
  slug: "home",
  status: "published",
  published_at: null,
  updated_at: null,
  sections: DEFAULT_HOME_SECTIONS,
};
