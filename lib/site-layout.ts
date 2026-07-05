export const MOBILE_SITE_MEDIA_QUERY =
  "(max-width: 1023px), ((min-width: 1024px) and (orientation: portrait))";

export function isMobileSiteLayout() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_SITE_MEDIA_QUERY).matches;
}

export function subscribeMobileSiteLayout(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_SITE_MEDIA_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
