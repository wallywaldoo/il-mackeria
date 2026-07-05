import Image from "next/image";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  variant?: "default" | "on-dark";
  priority?: boolean;
}

export function SiteLogo({
  className,
  variant = "default",
  priority = false,
}: SiteLogoProps) {
  const src =
    variant === "on-dark"
      ? "/images/il-mackeria-logo-light.png"
      : "/images/il-mackeria-logo.png";

  return (
    <Image
      src={src}
      alt="il mackeria"
      width={1024}
      height={622}
      unoptimized
      priority={priority}
      loading={priority ? "eager" : undefined}
      className={cn("block h-auto w-auto", className)}
    />
  );
}
