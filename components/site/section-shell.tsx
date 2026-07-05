import type { ReactNode } from "react";
import type { SectionSettings } from "@/lib/cms/schemas";
import {
  getSectionSurfaceClass,
  isDarkSectionTheme,
} from "@/lib/cms/section-theme";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  id?: string;
  settings: SectionSettings;
  children: ReactNode;
  className?: string;
}

export function SectionShell({
  id,
  settings,
  children,
  className,
}: SectionShellProps) {
  const dark = isDarkSectionTheme(settings.theme);

  return (
    <section
      id={id}
      className={cn(
        getSectionSurfaceClass(settings),
        "site-section relative scroll-mt-24 overflow-x-clip sm:scroll-mt-28 md:scroll-mt-32",
        dark && "grain overflow-hidden",
        className,
      )}
    >
      <div className="container-wide relative z-10">{children}</div>
    </section>
  );
}
