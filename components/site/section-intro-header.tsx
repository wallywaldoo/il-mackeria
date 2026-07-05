import type { LucideIcon } from "lucide-react";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { SectionLabel } from "@/components/site/section-label";
import { cn } from "@/lib/utils";

interface SectionIntroHeaderProps {
  label?: string;
  heading?: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  dark?: boolean;
  className?: string;
}

export function SectionIntroHeader({
  label,
  heading,
  icon,
  dark = false,
  className,
}: SectionIntroHeaderProps) {
  if (!label && !heading) return null;

  return (
    <div className={cn("section-intro", className)}>
      {label ? (
        <SectionLabel icon={icon} surface={dark ? "dark" : "light"}>
          {label}
        </SectionLabel>
      ) : null}
      {heading ? (
        <>
          <h2
            className={cn(
              label ? "mt-2" : "mt-0",
              "text-section-title leading-tight",
              dark ? "text-white" : "text-charcoal",
            )}
          >
            {heading}
          </h2>
          <ItalianFlagAccent />
        </>
      ) : null}
    </div>
  );
}
