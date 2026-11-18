"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

/** Circle + checkmark that draw themselves in (Motion pathLength). Reduced motion: static. */
export function SuccessCheck({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = (delay: number, duration: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { delay, duration, ease: EASE.expoOut }, opacity: { delay, duration: 0.01 } },
        };

  return (
    <motion.svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      initial={reduce ? false : { scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE.expoOut }}
    >
      <circle cx="32" cy="32" r="30" fill="rgb(91 76 245 / 0.12)" />
      <motion.circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="var(--brand-indigo)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ rotate: -90, transformOrigin: "50% 50%" }}
        {...draw(0.05, 0.7)}
      />
      <motion.path
        d="M20 33.5 28.5 42 45 24"
        fill="none"
        stroke="var(--highlight)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0.45, 0.5)}
      />
    </motion.svg>
  );
}
