export const easeOut = [0.22, 1, 0.36, 1] as const;

export const DURATION = 0.45;
export const STAGGER = 0.08;

export const viewport = {
  once: true,
  amount: 0.2,
  margin: "-60px 0px" as const,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
};

export const slideRight = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0 },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER,
      delayChildren: 0.05,
    },
  },
};
