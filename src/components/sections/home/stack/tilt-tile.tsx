"use client";

import { type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

const SPRING = { stiffness: 260, damping: 22, mass: 0.5 };
const MAX_TILT = 12;

/**
 * Tile that tilts toward the pointer in 3D (Motion springs, transform only)
 * with a soft sheen that follows the cursor. Parent supplies `perspective`.
 * Static on touch / coarse pointers and under reduced motion.
 */
export function TiltTile({ children, className }: { children: ReactNode; className?: string }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const srx = useSpring(rx, SPRING);
  const sry = useSpring(ry, SPRING);
  const sheen = useMotionTemplate`radial-gradient(160px circle at ${mx}% ${my}%, rgb(34 211 238 / 0.14), transparent 70%)`;

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * MAX_TILT);
    rx.set(-(py - 0.5) * 2 * MAX_TILT);
    mx.set(px * 100);
    my.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={active ? { rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" } : undefined}
      className={cn(
        "group/tile relative isolate overflow-hidden rounded-xl border border-white/8 bg-surface shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-[border-color] duration-300 hover:border-cyan/30",
        className,
      )}
    >
      {active ? (
        <motion.span
          aria-hidden="true"
          style={{ backgroundImage: sheen }}
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
        />
      ) : null}
      {children}
    </motion.div>
  );
}
