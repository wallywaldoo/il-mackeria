"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ContactDialogTrigger } from "@/components/site/contact-dialog";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { MobileNavMenu } from "@/components/site/mobile-nav-menu";
import { SiteLogo } from "@/components/site/site-logo";
import { SITE } from "@/lib/constants";
import {
  getLocaleFromPathname,
  getMenuSectionHref,
  isHomePath,
  withLocale,
} from "@/lib/i18n";
import { getUi } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const copy = getUi(locale);
  const isHome = isHomePath(pathname);
  const menuPath = getMenuSectionHref(locale);
  const homePath = withLocale("/", locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;
  const overlay = !solid && isHome;

  const iconClassName = (active = false) =>
    cn(
      "touch-target inline-flex size-11 items-center justify-center rounded-lg border transition-colors",
      !overlay && "surface-shadow-sm",
      overlay
        ? "border-cream/50 bg-cream/10 text-cream hover:border-cream hover:bg-cream/20"
        : active
          ? "border-burgundy bg-cream text-burgundy"
          : "border-line bg-cream/60 text-charcoal hover:border-burgundy hover:text-burgundy",
    );

  const languageSwitcherClassName = overlay
    ? "border-cream/50 bg-cream/10 hover:border-cream hover:bg-cream/20"
    : "border-line bg-cream/60 surface-shadow-sm hover:border-burgundy";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-300",
        solid
          ? "border-b border-line/40 bg-cream-light/95 shadow-sm backdrop-blur-md"
          : isHome
            ? "bg-gradient-to-b from-charcoal/35 via-charcoal/10 to-transparent backdrop-blur-[2px]"
            : "border-b border-line/30 bg-cream-light/90 backdrop-blur-md",
      )}
    >
      <div className="container-wide flex min-h-[4.75rem] items-center justify-between gap-2 py-2 sm:min-h-[5rem] sm:gap-3 lg:min-h-[7.5rem] lg:py-3">
        <Link
          href={homePath}
          className="group relative z-10 inline-flex min-w-0 shrink items-center transition-transform duration-300 hover:scale-[1.02] max-lg:translate-y-2.5 lg:translate-y-0"
        >
          <SiteLogo
            className="h-[4.5rem] w-auto sm:h-[4.75rem] lg:h-24"
            variant={overlay ? "on-dark" : "default"}
            priority={overlay}
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2 lg:gap-4">
          <LanguageSwitcher className={languageSwitcherClassName} />
          <ContactDialogTrigger
            ariaLabel={copy.contact}
            locale={locale}
            className={iconClassName()}
          />
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={cn(iconClassName(), "hidden sm:inline-flex")}
          >
            <InstagramIcon className="size-4" />
          </a>
          <Button
            className={cn(
              "btn-site hidden h-11 rounded-full px-4 text-xs font-semibold tracking-[0.15em] uppercase lg:inline-flex",
              overlay
                ? "bg-cream text-charcoal hover:bg-cream-light"
                : "bg-burgundy hover:bg-burgundy-dark",
            )}
            render={<Link href={menuPath} />}
          >
            {copy.seeMenu}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className={cn(iconClassName(), "lg:hidden")}
                >
                  <Menu className="size-5" />
                  <span className="sr-only">{copy.openMenu}</span>
                </button>
              }
            />
            <SheetContent
              side="right"
              showCloseButton={false}
              overlayClassName="bg-charcoal/55 backdrop-blur-sm"
              className="w-full gap-0 border-none bg-transparent p-0 shadow-2xl sm:max-w-md"
            >
              <SheetTitle className="sr-only">{copy.navMenu}</SheetTitle>
              <MobileNavMenu
                locale={locale}
                onNavigate={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
