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
  viewport,
} from "@/lib/motion";

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

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={reduceMotion ? false : "hidden"}
      whileInView="show"
      viewport={viewport}
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
