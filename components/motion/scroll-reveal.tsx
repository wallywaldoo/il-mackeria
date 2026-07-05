"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, easeOut, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/components/motion/use-scroll-reveal";

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
  const { ref, isVisible } = useScrollReveal(!!reduceMotion);
  const variants = directionVariants[direction];

  return (
    <motion.div
      ref={ref}
      className={cn("w-full min-w-0", className)}
      variants={variants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : isVisible ? "show" : "hidden"}
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
