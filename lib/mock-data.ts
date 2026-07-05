import type {
  GalleryImage,
  MenuItem,
  NewsPost,
  OpeningHour,
  SiteSettings,
} from "@/types/site";

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name_sv: "Coppa Koster",
    name_en: "Coppa Koster",
    description_sv:
      "Coppa di Parma, mozzarella, röd pesto, tomat, parmesan, basilikaolja och svartpeppar.",
    description_en: null,
    temperature: "varm",
    price_full: 125,
    price_half: 75,
    sort_order: 1,
    image_url: "/images/menu/coppa-koster.png",
    is_published: true,
  },
  {
    id: "2",
    name_sv: "Sopressa Öddö",
    name_en: "Sopressa Öddö",
    description_sv:
      "Vitlökssalami, mozzarella, grön pesto, rucola, tomat, parmesan, basilikaolja och svartpeppar.",
    description_en: null,
    temperature: "varm",
    price_full: 125,
    price_half: 75,
    sort_order: 2,
    image_url: "/images/menu/sopressa-oddö.png",
    is_published: true,
  },
  {
    id: "3",
    name_sv: "Mortadella Saltö",
    name_en: "Mortadella Saltö",
    description_sv:
      "Mortadella, burrata, machésallad, tomat, pecorino, basilikaolja, pistagenötter och svartpeppar.",
    description_en: null,
    temperature: "kall",
    price_full: 125,
    price_half: 75,
    sort_order: 3,
    image_url: "/images/menu/mortadella-saltö.png",
    is_published: true,
  },
  {
    id: "4",
    name_sv: "Spicy Alaska",
    name_en: "Spicy Alaska",
    description_sv:
      "Salami ventricina, mozzarella, nduja, rucola, pecorino, picklad rödlök och svartpeppar.",
    description_en: null,
    temperature: "varm",
    price_full: 125,
    price_half: 75,
    sort_order: 4,
    image_url: "/images/menu/spicy-alaska.png",
    is_published: true,
  },
  {
    id: "5",
    name_sv: "Caprese di Bufala",
    name_en: "Caprese di Bufala",
    description_sv:
      "Buffelmozzarella, tomat, olivolja, färsk basilika, grön pesto, balsamicoglaze och grovsalt.",
    description_en: null,
    temperature: "kall",
    price_full: 125,
    price_half: 75,
    sort_order: 5,
    image_url: "/images/menu/caprese-di-bufala.png",
    is_published: true,
  },
  {
    id: "6",
    name_sv: "Chianino di Capri",
    name_en: "Chianino di Capri",
    description_sv:
      "Salami av chianino oxe, tomat, olivolja, rucola, pecorino, pistagenötter och svartpeppar.",
    description_en: null,
    temperature: "kall",
    price_full: 125,
    price_half: 75,
    sort_order: 6,
    image_url: "/images/menu/chianino-di-capri.png",
    is_published: true,
  },
];

export const MOCK_NEWS: NewsPost[] = [
  {
    id: "1",
    title_sv: "Välkommen till il mackeria!",
    title_en: null,
    content_sv:
      "Vi har öppnat dörrarna på Södra Hamngatan 20 i Strömstad. Kom förbi och prova våra schiacciata – varma och kalla, med fina italienska råvaror.",
    content_en: null,
    excerpt_sv:
      "Vi har öppnat dörrarna på Södra Hamngatan 20 i Strömstad.",
    excerpt_en: null,
    image_url: "/images/exterior.jpg",
    is_published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

export const MOCK_OPENING_HOURS: OpeningHour[] = [
  {
    id: "1",
    day_of_week: 0,
    label_sv: "Måndag–Söndag",
    label_en: "Monday–Sunday",
    open_time: "11:00",
    close_time: "19:00",
    is_closed: false,
    note_sv: "Hela sommaren",
    note_en: "All summer",
    sort_order: 1,
  },
];

export const MOCK_GALLERY: GalleryImage[] = [
  {
    id: "1",
    url: "/images/exterior.jpg",
    alt_sv: "il mackeria utifrån på Södra Hamngatan",
    alt_en: null,
    sort_order: 1,
    is_published: true,
  },
  {
    id: "2",
    url: "/images/interior-counter.jpg",
    alt_sv: "Disken med deli och schiacciata",
    alt_en: null,
    sort_order: 2,
    is_published: true,
  },
  {
    id: "3",
    url: "/images/interior-window.jpg",
    alt_sv: "Mysig sittplats vid fönstret",
    alt_en: null,
    sort_order: 3,
    is_published: true,
  },
  {
    id: "4",
    url: "/images/interior-shelves.jpg",
    alt_sv: "Italienska produkter på hyllorna",
    alt_en: null,
    sort_order: 4,
    is_published: true,
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  contact_email: "stellan@mackerian.se",
  contact_phone: "",
  banner_text: null,
  banner_enabled: false,
};
