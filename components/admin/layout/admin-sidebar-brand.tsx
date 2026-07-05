import Link from "next/link";
import { cn } from "@/lib/utils";

type AdminSidebarBrandProps = {
  href?: string;
  flagClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
  onClick?: () => void;
  showText?: boolean;
};

export function AdminSidebarBrand({
  href = "/admin",
  flagClassName = "h-8 w-8",
  titleClassName,
  subtitleClassName,
  className,
  onClick,
  showText = true,
}: AdminSidebarBrandProps) {
  const content = (
    <>
      <div
        className={cn(
          "shrink-0 rounded-lg italian-flag ring-1 ring-neutral-200",
          flagClassName,
        )}
        aria-hidden
      />
      {showText ? (
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-semibold text-neutral-900",
              titleClassName,
            )}
          >
            il mackeria
          </p>
          <p
            className={cn(
              "truncate text-xs text-neutral-500",
              subtitleClassName,
            )}
          >
            Administration
          </p>
        </div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 transition hover:bg-neutral-100/80",
          className,
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50 p-2.5",
        className,
      )}
    >
      {content}
    </div>
  );
}
