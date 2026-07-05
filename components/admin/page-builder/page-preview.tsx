"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PageRenderer } from "@/components/site/page-renderer";
import { PreviewFrame } from "@/components/admin/page-builder/preview-frame";
import type { HomePageSection } from "@/types/cms";
import type { MenuItem, NewsPost, OpeningHour } from "@/types/site";
import { cn } from "@/lib/utils";

interface PagePreviewProps {
  sections: HomePageSection[];
  menuItems: MenuItem[];
  openingHours: OpeningHour[];
  contactEmail: string;
  newsPosts: NewsPost[];
  viewport: "desktop" | "mobile";
  activeSectionId?: string;
}

export function PagePreview({
  sections,
  menuItems,
  openingHours,
  contactEmail,
  newsPosts,
  viewport,
  activeSectionId,
}: PagePreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const iframeDocRef = useRef<Document | null>(null);
  const [mobilePreviewReady, setMobilePreviewReady] = useState(false);

  const handleDocumentReady = useCallback((doc: Document | null) => {
    iframeDocRef.current = doc;
    setMobilePreviewReady(Boolean(doc));
  }, []);

  useEffect(() => {
    if (!activeSectionId) return;

    const root =
      viewport === "mobile" ? iframeDocRef.current : scrollRef.current;

    if (!root) return;

    const frame = root.querySelector(
      `#preview-section-${CSS.escape(activeSectionId)}`,
    );

    if (frame instanceof HTMLElement) {
      frame.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSectionId, sections, viewport, mobilePreviewReady]);

  const previewContent = (
    <PageRenderer
      sections={sections}
      menuItems={menuItems}
      openingHours={openingHours}
      contactEmail={contactEmail}
      newsPosts={newsPosts}
      preview
      activeSectionId={activeSectionId}
    />
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-muted/30 p-4">
      <PreviewFrame
        viewport={viewport}
        onDocumentReady={handleDocumentReady}
        className={cn(
          "mx-auto h-full min-h-0 rounded-xl border border-neutral-200 bg-cream-light shadow-sm transition-all",
          viewport === "desktop"
            ? "w-full max-w-none overflow-y-auto"
            : "w-[390px] max-w-full",
        )}
      >
        {viewport === "desktop" ? (
          <div ref={scrollRef}>{previewContent}</div>
        ) : (
          previewContent
        )}
      </PreviewFrame>
    </div>
  );
}
