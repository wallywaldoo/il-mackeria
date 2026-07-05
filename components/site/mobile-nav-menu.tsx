"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { BookingDialog } from "@/components/site/booking-dialog";
import { ContactDialogTrigger } from "@/components/site/contact-dialog";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { SiteLogo } from "@/components/site/site-logo";
import { SITE } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import {
  getMenuSectionHref,
  isHomePath,
  resolveNavHref,
  withLocale,
} from "@/lib/i18n";
import { getUi } from "@/lib/i18n/messages";
import { DURATION, easeOut, fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MobileNavMenuProps {
  locale: Locale;
  onNavigate?: () => void;
}

function isNavLinkActive(
  pathname: string,
  linkHref: string,
  resolvedHref: string,
  isHome: boolean,
) {
  if (pathname === resolvedHref) return true;
  if (linkHref === "/menu" && isHome) return true;
  if (linkHref === "#hitta-hit" && isHome) return true;
  return false;
}

const footerIconClass =
  "touch-target inline-flex size-11 items-center justify-center rounded-full border border-cream/20 bg-cream/10 text-cream transition-colors hover:border-cream/40 hover:bg-cream/15";

export function MobileNavMenu({ locale, onNavigate }: MobileNavMenuProps) {
  const pathname = usePathname();
  const copy = getUi(locale);
  const isHome = isHomePath(pathname);
  const menuPath = getMenuSectionHref(locale);
  const homePath = withLocale("/", locale);
  const reduceMotion = useReducedMotion();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-burgundy-dark grain text-cream">
      <div
        className="italian-flag h-1 w-full shrink-0"
        role="presentation"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -right-8 -bottom-16 size-56 rounded-full bg-cream/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-10 -left-10 size-40 rounded-full bg-italian-green/20 blur-3xl"
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:px-6">
        <div className="flex shrink-0 items-start justify-between gap-4">
          <Link
            href={homePath}
            onClick={onNavigate}
            className="inline-flex transition-transform hover:scale-[1.02]"
          >
            <SiteLogo className="h-16 w-auto sm:h-[4.5rem]" variant="on-dark" />
          </Link>
          <SheetClose
            render={
              <button
                type="button"
                className={cn(footerIconClass, "shrink-0")}
                aria-label={copy.closeMenu}
              />
            }
          >
            <X className="size-5" />
          </SheetClose>
        </div>

        <p className="text-label mt-5 text-cream/45">{SITE.tagline}</p>
        <ItalianFlagAccent className="mt-2" />

        <motion.nav
          className="mt-8 flex flex-1 flex-col sm:mt-10"
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
        >
          {copy.nav.map((link, index) => {
            const href = resolveNavHref(link.href, locale);
            const active = isNavLinkActive(
              pathname,
              link.href,
              href,
              isHome,
            );
            const num = String(index + 1).padStart(2, "0");
            const rowClassName = cn(
              "group touch-target flex w-full items-end justify-between gap-4 border-b border-cream/12 py-5 text-left transition-colors sm:py-6",
              active && "border-cream/25",
            );
            const rowContent = (
              <>
                <div className="min-w-0">
                  <span className="text-[0.65rem] font-semibold tracking-[0.28em] text-cream/35 uppercase">
                    {num}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block font-heading text-[clamp(2rem,8vw,2.75rem)] leading-none transition-colors",
                      active
                        ? "text-cream"
                        : "text-cream/90 group-hover:text-cream",
                    )}
                  >
                    {link.label}
                  </span>
                  <span className="mt-2 block text-sm text-cream/50 transition-colors group-hover:text-cream/65">
                    {link.hint}
                  </span>
                </div>
                <ArrowUpRight
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-300",
                    active
                      ? "translate-x-0.5 -translate-y-0.5 text-cream"
                      : "text-cream/35 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cream/70",
                  )}
                  strokeWidth={1.75}
                />
              </>
            );

            return (
              <motion.div key={link.href} variants={fadeUp}>
                {link.href === "/booking" ? (
                  <button
                    type="button"
                    className={rowClassName}
                    onClick={() => setBookingOpen(true)}
                  >
                    {rowContent}
                  </button>
                ) : (
                  <Link href={href} onClick={onNavigate} className={rowClassName}>
                    {rowContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.nav>

        <motion.div
          className="mt-8 shrink-0 space-y-5 sm:mt-10"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : DURATION,
            ease: easeOut,
            delay: reduceMotion ? 0 : 0.2,
          }}
        >
          <Button
            className="btn-site-lg h-12 w-full rounded-full bg-cream text-sm font-semibold tracking-[0.15em] text-charcoal uppercase hover:bg-cream-light"
            render={<Link href={menuPath} onClick={onNavigate} />}
          >
            {copy.seeMenu}
          </Button>

          <div className="flex items-center justify-center gap-3">
            <LanguageSwitcher className="border-cream/20 bg-cream/10 hover:border-cream/40" />
            <ContactDialogTrigger
              ariaLabel={copy.contact}
              locale={locale}
              className={footerIconClass}
            />
          </div>

          <a
            href={SITE.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-center text-xs tracking-wide text-cream/45 uppercase transition-colors hover:text-cream/70"
          >
            <MapPin className="size-3.5 shrink-0" />
            <span>{SITE.address.street}, {SITE.address.city}</span>
          </a>
        </motion.div>
      </div>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        locale={locale}
      />
    </div>
  );
}
