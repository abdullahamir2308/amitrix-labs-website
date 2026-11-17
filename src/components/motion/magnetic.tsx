"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { SPRING } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

export type MagneticProps = {
  children: ReactNode;
  /** 0–1: how far the child follows the cursor (fraction of the offset). Default 0.35. */
  strength?: number;
  /** Max travel in px. Default 18. */
  max?: number;
  className?: string;
  disabled?: boolean;
};

/**
 * Pulls its child toward the cursor with a spring, and springs back on leave.
 * Transform only (no layout shift). Off for touch / coarse pointers and
 * reduced motion, where it renders a plain inline-block wrapper.
 */
export function Magnetic({ children, strength = 0.35, max = 18, className, disabled }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const active = fine && !reduced && !disabled;

  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(clamp((event.clientX - (rect.left + rect.width / 2)) * strength));
    y.set(clamp((event.clientY - (rect.top + rect.height / 2)) * strength));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-slot="magnetic"
      className={cn("inline-block", className)}
      style={active ? { x: sx, y: sy } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
