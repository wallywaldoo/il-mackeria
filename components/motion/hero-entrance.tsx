"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, easeOut, fadeUp, staggerContainer } from "@/lib/motion";

interface HeroEntranceProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileHeroEntrance({ children, className }: HeroEntranceProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      transition={{ staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function HeroEntranceItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ duration: reduceMotion ? 0 : DURATION, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function DesktopHeroEntrance({
  children,
  className,
}: HeroEntranceProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        ease: easeOut,
        delay: reduceMotion ? 0 : 0.4,
      }}
    >
      {children}
    </motion.div>
  );
}
