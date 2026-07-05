import type { SectionContentMap } from "@/lib/cms/schemas";

export const CMS_EN_OVERRIDES: Partial<SectionContentMap> = {
  hero: {
    badge: "Open 11–7 all summer",
    titleLine1: "Italian",
    titleLine2: "schiacciata",
    titleLine3: "in Strömstad",
    description:
      "Warm, simple and delicious – Italian sandwiches, deli and takeaway at Södra Hamngatan 20.",
    srOnlyTitle: "Italian schiacciata in the heart of Strömstad",
    mobileImage: {
      url: "/images/hero-mobile.png",
      alt: "Italian schiacciata – il mackeria",
    },
    desktopImage: {
      url: "/images/hero-desktop.png",
      alt: "Italian schiacciata in the heart of Strömstad",
    },
    menuButtonLabel: "See menu",
    bookingButtonLabel: "Book catering",
    findUsButtonLabel: "Find us",
    addressLabel: "Södra Hamngatan 20 · Strömstad",
    addressUrl:
      "https://maps.google.com/?q=Södra+Hamngatan+20,+Strömstad,+Sverige",
  },
  intro: {
    label: "Welcome",
    heading: "A little piece of Italy in Strömstad",
    paragraphs: [
      "il mackeria is a schiacciateria, sandwich bar and deli at Södra Hamngatan 20 – in the heart of summer-town Strömstad. We bake schiacciata, a flat Italian bread with air bubbles and a crisp crust, and fill it with fine ingredients from Italy.",
      "It's all about simple, warm flavours – the way a real Italian sandwich should taste. Grab a schiacciata for the beach, or stay a while in our little deli.",
    ],
    image: {
      url: "/images/fasad.png",
      alt: "il mackeria storefront on Södra Hamngatan in Strömstad",
    },
  },
  schiacciata: {
    label: "Our concept",
    heading: "What is schiacciata?",
    paragraphs: [
      'Schiacciata means "flattened" in Italian. It is a flat bread from Tuscany with lots of air bubbles, a touch of salt and a crisp crust – like focaccia, but flatter and with its own character.',
      "At il mackeria we fill schiacciata with fine ingredients – from coppa di Parma and burrata to nduja and fresh basil. Warm ones are heated in the oven; cold ones are served fresh.",
    ],
    image: {
      url: "/images/sandwich-display.png",
      alt: "Schiacciata on display at il mackeria",
    },
  },
  menu: {
    label: "Menu",
    heading: "Our menu",
    priceLine: "Full 125 kr · Half 75 kr",
  },
  instagram: {
    label: "Social",
    heading: "A peek inside",
    linkLabel: "Follow @ilmackeria",
    elfsightAppId: "2c9003f0-39a0-4c60-abf1-321e7ac4e7e2",
  },
  booking: {
    label: "Events",
    heading: "Private bookings",
    description:
      "Want to book il mackeria for a private event, corporate lunch or celebration? We'd love to hear from you – fill in the form and we'll get back to you.",
    buttonLabel: "Book now",
    image: {
      url: "/images/private-booking.png",
      alt: "Welcoming staff behind the counter at il mackeria",
    },
  },
  location: {
    label: "Visit us",
    heading: "Find us",
  },
  news: {
    label: "News",
    heading: "Latest from us",
    postCount: 3,
  },
};
