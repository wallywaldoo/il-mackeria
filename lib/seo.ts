import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const homeMetadata: Metadata = {
  title: "il mackeria | Italienska schiacciata & deli i Strömstad",
  description:
    "il mackeria serverar italienska schiacciata, deli och takeaway på Södra Hamngatan 20 i Strömstad. Öppet 11–19 varje dag hela sommaren.",
  openGraph: {
    title: "il mackeria | Italienska schiacciata & deli i Strömstad",
    description:
      "il mackeria serverar italienska schiacciata, deli och takeaway på Södra Hamngatan 20 i Strömstad.",
    url: SITE.url,
    siteName: SITE.name,
    locale: "sv_SE",
    type: "website",
    images: [{ url: `${SITE.url}/images/logo.png`, alt: "il mackeria" }],
  },
};

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | il mackeria`,
    description,
    openGraph: {
      title: `${title} | il mackeria`,
      description,
      url: SITE.url,
      siteName: SITE.name,
      locale: "sv_SE",
      type: "website",
    },
  };
}

export const homeMetadataEn: Metadata = {
  title: "il mackeria | Italian schiacciata & deli in Strömstad",
  description:
    "il mackeria serves Italian schiacciata, deli and takeaway at Södra Hamngatan 20 in Strömstad. Open 11am–7pm every day all summer.",
  openGraph: {
    title: "il mackeria | Italian schiacciata & deli in Strömstad",
    description:
      "il mackeria serves Italian schiacciata, deli and takeaway at Södra Hamngatan 20 in Strömstad.",
    url: `${SITE.url}/en`,
    siteName: SITE.name,
    locale: "en_GB",
    type: "website",
    images: [{ url: `${SITE.url}/images/logo.png`, alt: "il mackeria" }],
  },
};

export function pageMetadataEn(title: string, description: string): Metadata {
  return {
    title: `${title} | il mackeria`,
    description,
    openGraph: {
      title: `${title} | il mackeria`,
      description,
      url: SITE.url,
      siteName: SITE.name,
      locale: "en_GB",
      type: "website",
    },
  };
}

export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    url: SITE.url,
    image: `${SITE.url}/images/exterior.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressCountry: "SE",
    },
    servesCuisine: "Italian",
    priceRange: "$$",
    sameAs: [SITE.instagram],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "19:00",
      },
    ],
  };
}
