"use client";

import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";

import { resolveAdminPageTitle } from "@/lib/admin/navigation";

type AdminTopbarProps = {
  actions?: React.ReactNode;
};

export function AdminTopbar({ actions }: AdminTopbarProps) {
  const pathname = usePathname();
  const title = resolveAdminPageTitle(pathname);

  return (
    <header className="relative z-30 shrink-0 border-b border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-500">
            <LayoutGrid className="size-3.5" aria-hidden />
          </span>
          <h1 className="truncate text-sm font-semibold text-neutral-900">
            {title}
          </h1>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
