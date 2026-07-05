"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, easeOut, fadeUp, slideLeft, slideRight, viewport } from "@/lib/motion";
import {
  isMobileSiteLayout,
  subscribeMobileSiteLayout,
} from "@/lib/site-layout";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right" | "fade";

const directionVariants = {
  up: fadeUp,
  left: slideLeft,
  right: slideRight,
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
};

function getMobileSnapshot() {
  return isMobileSiteLayout();
}

function getMobileServerSnapshot() {
  return false;
}

function useIsMobileSiteLayout() {
  return useSyncExternalStore(
    subscribeMobileSiteLayout,
    getMobileSnapshot,
    getMobileServerSnapshot,
  );
}

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  direction?: RevealDirection;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  ...props
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobileSiteLayout();
  const effectiveDirection =
    isMobile && (direction === "left" || direction === "right") ? "up" : direction;
  const variants = directionVariants[effectiveDirection];

  return (
    <motion.div
      className={cn("w-full min-w-0", className)}
      variants={variants}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={viewport}
      transition={{
        duration: reduceMotion ? 0 : DURATION,
        ease: easeOut,
        delay: reduceMotion ? 0 : delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
