"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PreviewSectionFrameProps {
  sectionId: string;
  title: string;
  active: boolean;
  hidden?: boolean;
  children: ReactNode;
}

export function PreviewSectionFrame({
  sectionId,
  title,
  active,
  hidden = false,
  children,
}: PreviewSectionFrameProps) {
  return (
    <div
      id={`preview-section-${sectionId}`}
      data-section-id={sectionId}
      className={cn(
        "relative scroll-mt-4 transition-all duration-300",
        active &&
          "z-10 shadow-[inset_0_0_0_3px_var(--admin-accent,#9E1728)]",
        !active && "opacity-50 saturate-[0.85]",
        hidden && !active && "opacity-35",
      )}
    >
      {active ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
          <span className="mt-3 rounded-full bg-[var(--admin-accent,#9E1728)] px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-sm">
            Redigerar: {title}
          </span>
        </div>
      ) : null}
      {hidden ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
          <span
            className={cn(
              "mt-3 rounded-full bg-neutral-800/75 px-3 py-1 text-xs font-semibold tracking-wide text-white",
              active && "mt-12",
            )}
          >
            Dold sektion
          </span>
        </div>
      ) : null}
      {children}
    </div>
  );
}
