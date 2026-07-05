"use client";

import { useEffect, useRef } from "react";

const POST_IMAGE_SELECTOR =
  ".eapps-instagram-feed-post img, .es-post img";
const MIN_POST_IMAGE_WIDTH = 200;

function hideBranding(widgetRoot: ParentNode) {
  widgetRoot.querySelectorAll('a[href*="elfsight.com"]').forEach((node) => {
    (node as HTMLElement).style.setProperty("display", "none", "important");
  });
}

interface ElfsightEmbedProps {
  appId: string;
  onReady?: () => void;
}

export function ElfsightEmbed({ appId, onReady }: ElfsightEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const widgetRoot = containerRef.current?.closest(".instagram-feed-widget");
    if (!widgetRoot) return;

    let done = false;
    let settleScheduled = false;
    let settleTimer: number | null = null;

    const finishReady = () => {
      if (done || !onReady) return;
      done = true;
      onReady();
      observer.disconnect();
      if (poll !== null) window.clearInterval(poll);
      if (fallback !== null) window.clearTimeout(fallback);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
    };

    const getReadyPostImage = () => {
      const images = [
        ...widgetRoot.querySelectorAll(POST_IMAGE_SELECTOR),
      ] as HTMLImageElement[];

      return images.find(
        (img) => img.complete && img.naturalWidth >= MIN_POST_IMAGE_WIDTH,
      );
    };

    const markReady = () => {
      if (done || !onReady) return;

      hideBranding(widgetRoot);

      const postImg = getReadyPostImage();
      if (!postImg || settleScheduled) return;

      settleScheduled = true;
      settleTimer = window.setTimeout(finishReady, 300);
    };

    const observer = new MutationObserver(markReady);
    observer.observe(widgetRoot, { childList: true, subtree: true });
    hideBranding(widgetRoot);

    const poll = onReady ? window.setInterval(markReady, 150) : null;
    const fallback = onReady
      ? window.setTimeout(finishReady, 8000)
      : null;

    markReady();

    return () => {
      observer.disconnect();
      if (poll !== null) window.clearInterval(poll);
      if (fallback !== null) window.clearTimeout(fallback);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
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
