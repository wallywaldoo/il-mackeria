"use client";

import { useEffect, useRef, useState } from "react";
import { viewport } from "@/lib/motion";

const ROOT_MARGIN = viewport.margin;
const THRESHOLD = viewport.amount;

function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  const topMargin = Math.abs(parseInt(ROOT_MARGIN, 10)) || 0;

  return (
    rect.top < window.innerHeight - topMargin && rect.bottom > topMargin
  );
}

export function useScrollReveal(disabled = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(disabled);

  useEffect(() => {
    if (disabled) return;

    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;
    let fallback: number | null = null;

    const reveal = () => {
      setIsVisible(true);
      observer?.disconnect();
      if (fallback !== null) {
        window.clearTimeout(fallback);
      }
    };

    const checkViewport = () => {
      if (isInViewport(el)) {
        reveal();
        return true;
      }

      return false;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (checkViewport()) return;

        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              reveal();
            }
          },
          { threshold: THRESHOLD, rootMargin: ROOT_MARGIN },
        );
        observer.observe(el);

        fallback = window.setTimeout(() => {
          checkViewport();
        }, 400);
      });
    });

    return () => {
      observer?.disconnect();
      if (fallback !== null) {
        window.clearTimeout(fallback);
      }
    };
  }, [disabled]);

  return { ref, isVisible };
}
