"use client";

import { useEffect, useRef } from "react";

const POST_IMAGE_SELECTOR =
  ".eapps-instagram-feed-post img, .es-post img";

interface ElfsightEmbedProps {
  appId: string;
  onReady?: () => void;
}

export function ElfsightEmbed({ appId, onReady }: ElfsightEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onReady) return;

    const widgetRoot = containerRef.current?.closest(".instagram-feed-widget");
    if (!widgetRoot) return;

    let done = false;
    let settleTimer: number | null = null;

    const markReady = () => {
      if (done) return;

      const postImg = widgetRoot.querySelector(
        POST_IMAGE_SELECTOR,
      ) as HTMLImageElement | null;

      if (!postImg?.complete || postImg.naturalWidth === 0) return;

      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }

      settleTimer = window.setTimeout(() => {
        if (done) return;
        done = true;
        onReady();
        observer.disconnect();
        window.clearInterval(poll);
      }, 300);
    };

    const observer = new MutationObserver(markReady);
    observer.observe(widgetRoot, { childList: true, subtree: true });
    const poll = window.setInterval(markReady, 150);
    const fallback = window.setTimeout(() => {
      if (done) return;
      done = true;
      onReady();
      observer.disconnect();
      window.clearInterval(poll);
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
    }, 8000);
    markReady();

    return () => {
      observer.disconnect();
      window.clearInterval(poll);
      window.clearTimeout(fallback);
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
    };
  }, [onReady]);

  return (
    <div
      ref={containerRef}
      className={`elfsight-app-${appId} max-w-full`}
      data-elfsight-app-lazy="disabled"
    />
  );
}
