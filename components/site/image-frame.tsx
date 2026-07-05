import { cn } from "@/lib/utils";

interface ImageFrameProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  roundedClassName?: string;
  shadow?: "md" | "lg";
}

export function ImageFrame({
  children,
  className,
  innerClassName,
  roundedClassName = "rounded-2xl",
  shadow = "lg",
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        roundedClassName,
        shadow === "lg" ? "shadow-lg" : "shadow-md",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          roundedClassName,
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
