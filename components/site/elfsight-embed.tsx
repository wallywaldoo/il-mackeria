"use client";

import { useEffect, useRef } from "react";

const BRANDING_SELECTORS = [
  ".eapps-widget-toolbar",
  ".eapps-branding",
  ".eapps-link",
];

const HEADER_SELECTORS = [
  ".eapps-instagram-feed-header",
  ".es-header",
];

const ROUNDED_SELECTORS = [
  ".es-post",
  ".eapps-instagram-feed-post",
  ".es-post-media",
  ".eapps-instagram-feed-post-media",
  ".es-post-media-image",
  ".eapps-instagram-feed-post-image",
];

const ROUNDED_IMAGE_SELECTORS = [
  ".es-layout img",
  ".eapps-instagram-feed-posts img",
  ".es-post-media-image img",
  ".eapps-instagram-feed-post-image img",
];

interface ElfsightEmbedProps {
  appId: string;
}

export function ElfsightEmbed({ appId }: ElfsightEmbedProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widgetRoot = widgetRef.current?.closest(".instagram-feed-widget");
    if (!widgetRoot) return;

    const applyWidgetStyles = () => {
      HEADER_SELECTORS.forEach((selector) => {
        widgetRoot.querySelectorAll(selector).forEach((node) => {
          (node as HTMLElement).style.display = "none";
        });
      });

      ROUNDED_SELECTORS.forEach((selector) => {
        widgetRoot.querySelectorAll(selector).forEach((node) => {
          const element = node as HTMLElement;
          element.style.borderRadius = "1rem";
          element.style.overflow = "hidden";
        });
      });

      widgetRoot
        .querySelectorAll(".es-post, .eapps-instagram-feed-post")
        .forEach((node) => {
          (node as HTMLElement).style.boxShadow =
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
        });

      ROUNDED_IMAGE_SELECTORS.forEach((selector) => {
        widgetRoot.querySelectorAll(selector).forEach((node) => {
          (node as HTMLElement).style.borderRadius = "1rem";
        });
      });

      BRANDING_SELECTORS.forEach((selector) => {
        widgetRoot.querySelectorAll(selector).forEach((node) => {
          (node as HTMLElement).style.display = "none";
        });
      });

      widgetRoot.querySelectorAll('[class*="eapps-"], [class*="es-"]').forEach((node) => {
        const element = node as HTMLElement;
        element.style.maxWidth = "100%";
      });

      widgetRoot.querySelectorAll(".es-layout, .eapps-instagram-feed-posts, [class*='layout']").forEach((node) => {
        const element = node as HTMLElement;
        element.style.maxWidth = "100%";
        element.style.overflowX = "hidden";
      });

      widgetRoot.querySelectorAll('a[href*="elfsight.com"]').forEach((node) => {
        (node as HTMLElement).style.display = "none";
      });

      widgetRoot.querySelectorAll("*").forEach((node) => {
        const text = node.textContent?.trim();
        if (!text || !/free instagram feed widget/i.test(text)) return;

        const element = node as HTMLElement;
        const hasFeedPosts = element.querySelector(
          ".es-layout, .eapps-instagram-feed-posts, [class*='layout']",
        );

        if (!hasFeedPosts) {
          element.style.display = "none";
        }
      });
    };

    applyWidgetStyles();

    const observer = new MutationObserver(applyWidgetStyles);
    observer.observe(widgetRoot, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={widgetRef}
      className={`elfsight-app-${appId} max-w-full overflow-hidden`}
      data-elfsight-app-lazy
    />
  );
}
