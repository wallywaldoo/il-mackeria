"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface PreviewFrameProps {
  viewport: "desktop" | "mobile";
  className?: string;
  onDocumentReady?: (doc: Document | null) => void;
  children: ReactNode;
}

function copyStyles(targetDoc: Document) {
  targetDoc.head.replaceChildren();

  const viewportMeta = targetDoc.createElement("meta");
  viewportMeta.name = "viewport";
  viewportMeta.content = "width=device-width, initial-scale=1";
  targetDoc.head.appendChild(viewportMeta);

  document
    .querySelectorAll('link[rel="stylesheet"], style')
    .forEach((node) => {
      targetDoc.head.appendChild(node.cloneNode(true));
    });
}

function setupIframeDocument(doc: Document) {
  copyStyles(doc);

  doc.documentElement.lang = document.documentElement.lang;
  doc.documentElement.className = document.documentElement.className;
  doc.body.className = "bg-cream-light text-charcoal antialiased";
  doc.body.style.margin = "0";
  doc.body.style.minHeight = "100%";
  doc.body.style.overflowY = "auto";
  doc.body.style.overflowX = "hidden";
}

export function PreviewFrame({
  viewport,
  className,
  onDocumentReady,
  children,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (viewport !== "mobile") {
      setMountNode(null);
      onDocumentReady?.(null);
      return;
    }

    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write("<!DOCTYPE html><html><head></head><body></body></html>");
    doc.close();

    setupIframeDocument(doc);

    const root = doc.createElement("div");
    root.id = "site-preview-root";
    doc.body.appendChild(root);

    setMountNode(root);
    onDocumentReady?.(doc);
  }, [viewport, onDocumentReady]);

  useEffect(() => {
    if (viewport !== "mobile") return;

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;

    const observer = new MutationObserver(() => {
      copyStyles(doc);
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [viewport]);

  if (viewport === "desktop") {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <iframe
        ref={iframeRef}
        title="Mobilförhandsgranskning"
        className={cn(
          "h-full w-full border-0 bg-cream-light",
          className,
        )}
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
}
