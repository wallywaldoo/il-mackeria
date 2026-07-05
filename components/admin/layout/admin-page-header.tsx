import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  meta?: string;
  sectionLabel?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  meta,
  sectionLabel = "Admin · il mackeria",
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {sectionLabel}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900">{title}</h1>
          {meta ? <p className="mt-1 text-sm text-neutral-600">{meta}</p> : null}
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex max-w-xl shrink-0 flex-col items-stretch gap-2 sm:items-end">
            <div className="flex flex-wrap items-center justify-end gap-2">
              {actions}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
