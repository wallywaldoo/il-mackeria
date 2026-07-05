import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const adminPanelIconClass =
  "bg-[var(--admin-info-bg,rgba(158,23,40,0.08))] text-[var(--admin-accent,#9E1728)]";

export const adminTable = {
  table: "min-w-full text-left text-sm",
  thead: "bg-neutral-50",
  th: "px-4 py-3 font-semibold text-neutral-800",
  tbody: "divide-y divide-neutral-100 bg-white",
  tr: "transition-colors hover:bg-neutral-50",
  td: "px-4 py-3 text-neutral-700",
  tdMedium: "px-4 py-3 font-medium text-neutral-900",
} as const;

export const adminInputClass =
  "h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:border-[var(--admin-accent,#9E1728)]/40 focus:ring-2 focus:ring-[var(--admin-accent,#9E1728)]/10";

export const adminSelectClass =
  "h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none focus:border-[var(--admin-accent,#9E1728)]/40 focus:ring-2 focus:ring-[var(--admin-accent,#9E1728)]/10";

export const adminLabelClass =
  "text-xs font-semibold uppercase tracking-wide text-neutral-500";

export const adminPrimaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-full bg-[var(--admin-accent,#9E1728)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--admin-accent-hover,#76101D)] disabled:cursor-not-allowed disabled:opacity-60";

export const adminSecondaryLinkClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--admin-accent,#9E1728)_22%,transparent)] bg-white px-5 text-sm font-semibold text-[var(--admin-accent,#9E1728)] shadow-sm transition hover:bg-[var(--admin-info-bg,rgba(158,23,40,0.08))]";

export function AdminPanel({
  icon: Icon,
  title,
  description,
  children,
  className = "",
  headerAction,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${adminPanelIconClass}`}
          >
            <Icon className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
            ) : null}
          </div>
        </div>
        {headerAction}
      </div>
      {children}
    </section>
  );
}

export function AdminTableShell({
  icon: Icon,
  title,
  description,
  children,
  isEmpty = false,
  emptyMessage = "Inget att visa.",
  headerAction,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: ReactNode;
  headerAction?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${adminPanelIconClass}`}
          >
            <Icon className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
            {description ? (
              <p className="text-xs text-neutral-500">{description}</p>
            ) : null}
          </div>
        </div>
        {headerAction}
      </div>
      <div className="bg-white">
        {isEmpty ? (
          <p className="px-5 py-12 text-center text-sm text-neutral-600">
            {emptyMessage}
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export function AdminAttentionCard({
  href,
  icon: Icon,
  label,
  description,
  value,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  value: number;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition hover:border-neutral-300 hover:bg-white hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${adminPanelIconClass} transition group-hover:bg-[var(--admin-accent,#9E1728)] group-hover:text-white`}
          >
            <Icon className="size-4" aria-hidden />
          </span>
          <h3 className="text-sm font-semibold text-neutral-800 group-hover:text-[var(--admin-accent,#9E1728)]">
            {label}
          </h3>
        </div>
        <span className="shrink-0 text-2xl font-semibold tabular-nums text-neutral-900">
          {value}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">
        {description}
      </p>
    </Link>
  );
}

export function AdminModuleCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${adminPanelIconClass}`}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function AdminPrimaryLink({
  children,
  className = "",
  ...props
}: React.ComponentProps<typeof Link> & { className?: string }) {
  return (
    <Link className={`${adminPrimaryButtonClass} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function AdminPrimaryButton({
  children,
  className = "",
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { className?: string }) {
  return (
    <button
      type={type}
      className={`${adminPrimaryButtonClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminBackLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center gap-1 text-sm font-medium text-neutral-500 hover:text-[var(--admin-accent,#9E1728)] ${className}`}
    >
      ← {children}
    </Link>
  );
}

export function AdminEmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 py-10 text-center text-sm text-neutral-600 sm:text-base">
      {children}
    </p>
  );
}

export function AdminStatusBadge({
  published,
}: {
  published: boolean;
}) {
  return (
    <span
      className={
        published
          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600"
      }
    >
      {published ? "Publicerad" : "Utkast"}
    </span>
  );
}
