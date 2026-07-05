"use client";

import { useEffect, useRef } from "react";

const BRANDING_SELECTORS = [
  ".eapps-widget-toolbar",
  ".eapps-branding",
  ".eapps-link",
  ".eapps-instagram-feed-footer",
  'a[href*="elfsight.com"]',
];

const FEED_READY_SELECTOR =
  ".es-layout, .eapps-instagram-feed-posts, [class*='layout']";

function hideBranding(widgetRoot: ParentNode) {
  BRANDING_SELECTORS.forEach((selector) => {
    widgetRoot.querySelectorAll(selector).forEach((node) => {
      (node as HTMLElement).style.display = "none";
    });
  });

  widgetRoot.querySelectorAll("*").forEach((node) => {
    if (node.childElementCount > 0) return;

    const text = node.textContent?.trim();
    if (!text || !/free instagram feed widget/i.test(text)) return;

    const parent = node.parentElement;
    if (!parent || parent.closest(FEED_READY_SELECTOR)) return;

    parent.style.display = "none";
  });
}

interface ElfsightEmbedProps {
  appId: string;
}

export function ElfsightEmbed({ appId }: ElfsightEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widgetRoot = containerRef.current?.closest(".instagram-feed-widget");
    if (!widgetRoot) return;

    let debounce: number | null = null;
    let stopAt: number | null = null;
    let observer: MutationObserver | null = null;

    const run = () => {
      hideBranding(widgetRoot);

      if (widgetRoot.querySelector(FEED_READY_SELECTOR)) {
        observer?.disconnect();
        if (stopAt !== null) window.clearTimeout(stopAt);
      }
    };

    const schedule = () => {
      if (debounce !== null) window.clearTimeout(debounce);
      debounce = window.setTimeout(run, 150);
    };

    observer = new MutationObserver(schedule);
    observer.observe(widgetRoot, { childList: true, subtree: true });

    run();
    stopAt = window.setTimeout(() => observer?.disconnect(), 12000);

    return () => {
      observer?.disconnect();
      if (debounce !== null) window.clearTimeout(debounce);
      if (stopAt !== null) window.clearTimeout(stopAt);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`elfsight-app-${appId} max-w-full`}
      data-elfsight-app-lazy="disabled"
    />
  );
}
