import { Mail, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { SiteLogo } from "@/components/site/site-logo";
import { SITE } from "@/lib/constants";

const footerLinkClass =
  "inline-flex max-w-full items-center gap-1.5 break-words text-sm text-cream/75 transition-colors hover:text-cream";

export function Footer() {
  return (
    <footer className="site-section section-dark grain">
      <div
        className="italian-flag relative z-10 -mt-px h-1.5 w-full md:h-2"
        role="presentation"
        aria-hidden
      />

      <div className="container-wide py-8 sm:py-10 md:py-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <SiteLogo className="h-16 md:h-20" variant="on-dark" />
            <p className="mt-2 text-xs tracking-[0.2em] text-cream/50 uppercase">
              Italian Street Food
            </p>
            <ItalianFlagAccent className="mt-2.5 mx-auto" />
          </div>

          <div className="flex flex-col items-center gap-2.5">
            <a
              href={SITE.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={footerLinkClass}
            >
              <MapPin className="size-3.5 shrink-0" />
              {SITE.address.street}, {SITE.address.city}
            </a>
            <a href={`mailto:${SITE.email}`} className={footerLinkClass}>
              <Mail className="size-3.5 shrink-0" />
              {SITE.email}
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={footerLinkClass}
            >
              <InstagramIcon className="size-3.5 shrink-0" />
              @ilmackeria
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-cream/15 pt-5">
          <p className="text-center text-xs text-cream/40">
            © {new Date().getFullYear()} il mackeria · {SITE.address.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
