import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type BackgroundIllustrationSurface = "cream" | "dark";

type BackgroundIllustrationProps = {
  src: string;
  alt?: string;
  className?: string;
  surface?: BackgroundIllustrationSurface;
  hideOnMobile?: boolean;
  width?: number;
  height?: number;
};

function maskStyle(src: string): CSSProperties {
  return {
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}

export function BackgroundIllustration({
  src,
  alt = "",
  className,
  surface = "cream",
  hideOnMobile = false,
  width = 480,
  height = 480,
}: BackgroundIllustrationProps) {
  const common = cn(
    "pointer-events-none absolute z-0 aspect-square max-w-none select-none",
    hideOnMobile && "hidden desktop-site:block",
    className,
  );

  if (surface === "dark") {
    return (
      <div
        aria-hidden
        className={cn(common, "bg-cream opacity-[0.06] desktop-site:opacity-[0.08]")}
        style={maskStyle(src)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={false}
      aria-hidden
      className={cn(common, "opacity-[0.04] desktop-site:opacity-[0.06]")}
    />
  );
}
