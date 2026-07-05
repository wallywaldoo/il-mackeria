import { cn } from "@/lib/utils";

interface ItalianFlagAccentProps {
  className?: string;
}

export function ItalianFlagAccent({ className }: ItalianFlagAccentProps) {
  return (
    <div
      className={cn("mt-2 h-1 w-16 italian-flag max-lg:mx-auto lg:mx-0", className)}
      aria-hidden
    />
  );
}
