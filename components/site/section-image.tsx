import Image from "next/image";
import { ImageFrame } from "@/components/site/image-frame";
import { cn } from "@/lib/utils";

type SectionImageAspect = "landscape" | "portrait" | "landscape-square-desktop";

interface SectionImageProps {
  src: string;
  alt: string;
  aspect?: SectionImageAspect;
  sizes?: string;
  frameClassName?: string;
  innerClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  mobileShadow?: boolean;
}

const aspectInnerClass: Record<SectionImageAspect, string> = {
  landscape: "section-media-aspect",
  portrait: "section-media-aspect-portrait",
  "landscape-square-desktop": "section-media-aspect lg:aspect-square",
};

const aspectDimensions: Record<
  SectionImageAspect,
  { width: number; height: number }
> = {
  landscape: { width: 1200, height: 900 },
  portrait: { width: 960, height: 1200 },
  "landscape-square-desktop": { width: 1200, height: 900 },
};

export function SectionImage({
  src,
  alt,
  aspect = "landscape",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  frameClassName,
  innerClassName,
  imageClassName,
  priority = false,
  mobileShadow = false,
}: SectionImageProps) {
  const { width, height } = aspectDimensions[aspect];

  return (
    <ImageFrame
      className={cn("w-full", frameClassName)}
      shadow={mobileShadow ? "md" : "lg"}
      innerClassName={cn(aspectInnerClass[aspect], innerClassName)}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          imageClassName,
        )}
        sizes={sizes}
      />
    </ImageFrame>
  );
}
