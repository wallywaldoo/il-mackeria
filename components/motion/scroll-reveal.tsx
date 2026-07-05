"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, easeOut, fadeUp, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right" | "fade";

const directionVariants = {
  up: fadeUp,
  left: fadeUp,
  right: fadeUp,
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
};

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
  const variants = directionVariants[direction];

  return (
    <motion.div
      className={cn("w-full min-w-0", className)}
      variants={variants}
      initial={false}
      whileInView={reduceMotion ? undefined : "show"}
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
