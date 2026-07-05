export const SITE = {
  name: "il mackeria",
  domain: "ilmackeria.se",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ilmackeria.se",
  tagline: "Italian Street Food",
  address: {
    street: "Södra Hamngatan 20",
    city: "Strömstad",
    country: "Sverige",
    full: "Södra Hamngatan 20, Strömstad, Sverige",
  },
  instagram: "https://www.instagram.com/ilmackeria/",
  email: "stellan@mackerian.se",
  phone: "",
  openingHoursSummer: "11:00–19:00 varje dag hela sommaren",
  openingHoursShort: "11–19",
  menuPrices: { full: 125, half: 75 },
  googleMapsUrl:
    "https://maps.google.com/?q=Södra+Hamngatan+20,+Strömstad,+Sverige",
} as const;

export const BOOKING_TYPES = [
  { value: "private_event", label: "Privat event" },
  { value: "corporate", label: "Företagsevent" },
  { value: "celebration", label: "Firande / kalas" },
  { value: "other", label: "Annat" },
] as const;

/** Form fields on the public site — matches menu section background */
export const siteFormFieldClass = "bg-cream-light";

export const NAV_LINKS = [
  { href: "/menu", label: "Meny" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Vad är schiacciata?",
    answer:
      "Schiacciata är ett italienskt plattbröd från Toscana – med mycket luftbubblor, lätt salt och en krispig yta. Hos il mackeria fyller vi det med fina råvaror och serverar det som varma och kalla mackor.",
  },
  {
    question: "Vad är skillnaden mellan hel och halv?",
    answer:
      "En hel schiacciata är en full macka till 125 kr. Halv är en mindre portion till 75 kr – perfekt om du vill prova flera smaker eller vill ha något lättare.",
  },
  {
    question: "Kan jag ta med?",
    answer:
      "Absolut! Vi är en deli och takeaway på Södra Hamngatan 20. Beställ i lokalen och ta med dig – perfekt för en dag vid havet i Strömstad.",
  },
  {
    question: "Vad betyder Varm och Kall?",
    answer:
      "Varm betyder att schiacciatan värms och smälter ihop i ugnen. Kall serveras färsk och kall – som en klassisk italiensk macka med fina råvaror.",
  },
  {
    question: "Kan jag boka för privat event?",
    answer:
      "Ja! Vi tar gärna emot privata bokningar och events. Fyll i formuläret under Bokning så återkommer vi så snart vi kan.",
  },
] as const;
