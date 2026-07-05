"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BritishFlagIcon,
  SwedishFlagIcon,
} from "@/components/icons/flag-icons";
import {
  getAlternateLocalePath,
  getLocaleFromPathname,
} from "@/lib/i18n";
import { getUi } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const copy = getUi(locale);
  const alternateHref = getAlternateLocalePath(pathname);
  const switchingToEnglish = locale === "sv";

  return (
    <Link
      href={alternateHref}
      aria-label={
        switchingToEnglish ? copy.switchToEnglish : copy.switchToSwedish
      }
      className={cn(
        "touch-target inline-flex size-11 items-center justify-center overflow-hidden rounded-lg border transition-opacity hover:opacity-90",
        className,
      )}
    >
      {switchingToEnglish ? (
        <BritishFlagIcon className="size-5 rounded-full object-cover" />
      ) : (
        <SwedishFlagIcon className="size-5 rounded-full object-cover" />
      )}
    </Link>
  );
}
