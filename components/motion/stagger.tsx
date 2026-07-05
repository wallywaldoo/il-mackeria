"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import {
  DURATION,
  easeOut,
  fadeUp,
  staggerContainer,
} from "@/lib/motion";
import { useScrollReveal } from "@/components/motion/use-scroll-reveal";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  stagger?: number;
}

export function StaggerContainer({
  children,
  className,
  stagger,
  ...props
}: StaggerContainerProps) {
  const reduceMotion = useReducedMotion();
  const { ref, isVisible } = useScrollReveal(!!reduceMotion);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : isVisible ? "show" : "hidden"}
      transition={
        stagger
          ? { staggerChildren: reduceMotion ? 0 : stagger }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function StaggerItem({
  children,
  className,
  delay = 0,
  ...props
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
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
