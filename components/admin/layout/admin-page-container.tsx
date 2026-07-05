import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const ADMIN_PAGE_CONTAINER_CLASS = "w-full min-w-0 space-y-4";

export function AdminPageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(ADMIN_PAGE_CONTAINER_CLASS, className)}>{children}</div>;
}
