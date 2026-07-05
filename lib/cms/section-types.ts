import {
  CalendarDays,
  Camera,
  Flag,
  ImageIcon,
  LayoutTemplate,
  MapPin,
  Newspaper,
  Sparkles,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { SectionType } from "@/lib/cms/schemas";

export const SECTION_TYPE_META: Record<
  SectionType,
  { label: string; description: string; icon: LucideIcon }
> = {
  hero: {
    label: "Hero",
    description: "Stora välkomstbilden högst upp på sidan",
    icon: ImageIcon,
  },
  flag_band: {
    label: "Flagglinje",
    description: "Italienska flaggans färgremsa",
    icon: Flag,
  },
  intro: {
    label: "Välkommen",
    description: "Introduktion med text och bild",
    icon: Sparkles,
  },
  schiacciata: {
    label: "Schiacciata",
    description: "Förklaring om schiacciata",
    icon: Wheat,
  },
  menu: {
    label: "Meny",
    description: "Rubrik för menysektionen",
    icon: UtensilsCrossed,
  },
  instagram: {
    label: "Instagram",
    description: "Sociala medier och Instagram-flöde",
    icon: Camera,
  },
  booking: {
    label: "Bokning",
    description: "Privata bokningar och event",
    icon: CalendarDays,
  },
  location: {
    label: "Hitta hit",
    description: "Adress och öppettider",
    icon: MapPin,
  },
  news: {
    label: "Nyheter",
    description: "Senaste nyhetsinlägg från admin",
    icon: Newspaper,
  },
  content_blocks: {
    label: "Innehållssektion",
    description: "Flexibel sektion med text, bild och CTA-block",
    icon: LayoutTemplate,
  },
};

export const SECTION_TYPE_ORDER: SectionType[] = [
  "hero",
  "flag_band",
  "intro",
  "schiacciata",
  "menu",
  "news",
  "content_blocks",
  "instagram",
  "booking",
  "location",
];
