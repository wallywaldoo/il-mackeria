import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-burgundy font-semibold text-white",
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-12 text-base",
      )}
      aria-hidden
    >
      {initial}
    </span>
  );
}
