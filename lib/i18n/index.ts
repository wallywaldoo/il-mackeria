export const locales = ["sv", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sv";

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sv";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

export function withLocale(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") {
    return normalized === "/" ? "/en" : `/en${normalized}`;
  }
  return normalized;
}

export function getAlternateLocalePath(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  const path = stripLocalePrefix(pathname);
  return withLocale(path, locale === "sv" ? "en" : "sv");
}

export function isHomePath(pathname: string): boolean {
  const path = stripLocalePrefix(pathname);
  return path === "/";
}

export function getMenuSectionHref(locale: Locale): string {
  return `${withLocale("/", locale)}#menu`;
}

export function resolveNavHref(href: string, locale: Locale): string {
  if (href === "/menu") {
    return getMenuSectionHref(locale);
  }
  if (href.startsWith("#")) {
    return `${withLocale("/", locale)}${href}`;
  }
  return withLocale(href, locale);
}

export function getNewsPostHref(id: string, locale: Locale): string {
  return `${withLocale("/nyheter", locale)}/${id}`;
}
