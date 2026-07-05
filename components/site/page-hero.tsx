import type { LucideIcon } from "lucide-react";
import { SectionLabel } from "@/components/site/section-label";
import { ItalianFlagAccent } from "@/components/site/italian-flag-accent";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label: string;
  title: string;
  description?: string;
  variant?: "green" | "burgundy" | "cream";
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export function PageHero({
  label,
  title,
  description,
  variant = "green",
  icon,
  children,
}: PageHeroProps) {
  const labelSurface = variant === "cream" ? "light" : "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden page-hero-padding",
        variant === "green" && "section-green grain",
        variant === "burgundy" && "section-dark grain",
        variant === "cream" && "bg-cream grain",
      )}
    >
      <div className="container-wide">
        {icon ? (
          <SectionLabel icon={icon} surface={labelSurface}>
            {label}
          </SectionLabel>
        ) : (
          <p
            className={cn(
              "text-label",
              labelSurface === "light" ? "text-warm-gray" : "text-cream/70",
            )}
          >
            {label}
          </p>
        )}
        <h1
          className={cn(
            "mt-3 font-heading text-3xl font-semibold sm:text-5xl md:text-7xl",
            variant === "cream" ? "text-charcoal" : "text-cream",
          )}
        >
          {title}
        </h1>
        <ItalianFlagAccent />
        {description && (
          <p
            className={cn(
              "mt-4 max-w-lg text-lg",
              variant === "cream" ? "text-warm-gray" : "text-cream/80",
            )}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
