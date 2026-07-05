"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { useCanHover } from "@/hooks/use-can-hover";
import { cn } from "@/lib/utils";

interface HoverBoxProps extends HTMLMotionProps<"div"> {
  variant?: "light" | "dark";
}

export function HoverBox({
  children,
  className,
  variant = "light",
  ...props
}: HoverBoxProps) {
  const canHover = useCanHover();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "hover-box",
        variant === "dark" && "hover-box-dark",
        className,
      )}
      whileHover={
        canHover && !reduceMotion
          ? {
              y: -6,
              transition: { type: "spring", stiffness: 400, damping: 28 },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
