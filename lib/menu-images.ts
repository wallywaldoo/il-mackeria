export const MENU_ITEM_IMAGES: Record<string, string> = {
  "Coppa Koster": "/images/menu/coppa-koster.png",
  "Sopressa Öddö": "/images/menu/sopressa-oddö.png",
  "Mortadella Saltö": "/images/menu/mortadella-saltö.png",
  "Spicy Alaska": "/images/menu/spicy-alaska.png",
  "Caprese di Bufala": "/images/menu/caprese-di-bufala.png",
  "Chianino di Capri": "/images/menu/chianino-di-capri.png",
};

export function getMenuItemImage(name: string): string | undefined {
  return MENU_ITEM_IMAGES[name];
}
