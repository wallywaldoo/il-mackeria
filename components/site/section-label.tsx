import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionLabelIcon = LucideIcon | React.ComponentType<{ className?: string }>;

type SectionLabelSurface = "light" | "dark";

interface SectionLabelProps {
  icon: SectionLabelIcon;
  children: React.ReactNode;
  className?: string;
  surface?: SectionLabelSurface;
}

const surfaceStyles: Record<
  SectionLabelSurface,
  { box: string; text: string }
> = {
  light: {
    box: "border-line/60 bg-cream-light text-warm-gray surface-shadow-sm",
    text: "text-warm-gray",
  },
  dark: {
    box: "border-cream/25 bg-cream/10 text-cream surface-shadow-dark",
    text: "text-cream/70",
  },
};

export function SectionLabel({
  icon: Icon,
  children,
  className,
  surface = "light",
}: SectionLabelProps) {
  const styles = surfaceStyles[surface];

  return (
    <div className={cn("flex w-full items-center gap-2.5 max-lg:justify-center lg:justify-start", className)}>
      <span
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-md border",
          styles.box,
        )}
        aria-hidden
      >
        <Icon className="size-3.5" strokeWidth={2} />
      </span>
      <p className={cn("text-label", styles.text)}>{children}</p>
    </div>
  );
}
