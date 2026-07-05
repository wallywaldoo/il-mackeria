"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AnimatedFlagBandProps {
  className?: string;
}

export function AnimatedFlagBand({ className }: AnimatedFlagBandProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("italian-flag h-1.5 w-full origin-left md:h-2", className)}
      role="presentation"
      aria-hidden
      initial={reduceMotion ? false : { scaleX: 0 }}
      animate={reduceMotion ? undefined : { scaleX: 1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        ease: easeOut,
      }}
    />
  );
}
