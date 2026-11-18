"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useFinePointer, useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

const SPRING = { stiffness: 150, damping: 20, mass: 0.5 } as const;
/** Max pointer tilt in degrees. */
const MAX_TILT = 7;
/** Resting tilt (rotateX) when the frame sits low in the viewport; it flattens as you scroll. */
const ENTRY_TILT = 16;

/**
 * 3D-tilting product frame. The frame starts leaning back and flattens as it scrolls into place,
 * then tilts toward the pointer (spring-smoothed) with a moving glare. Touch / coarse pointers and
 * reduced motion get a flat, static frame (same markup, no transforms, so no layout shift).
 */
export function TiltFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });
  const entry = useTransform(scrollYProgress, [0, 1], [ENTRY_TILT, 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, SPRING);
  const spy = useSpring(py, SPRING);

  const rotateX = useTransform(() => entry.get() - spy.get() * MAX_TILT);
  const rotateY = useTransform(() => spx.get() * MAX_TILT);
  const glareX = useTransform(spx, [-1, 1], [20, 80]);
  const glareY = useTransform(spy, [-1, 1], [10, 70]);
  const glare = useMotionTemplate`radial-gradient(60% 60% at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.09), transparent 70%)`;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!active || event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    py.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={ref}
      className={cn("relative [perspective:1600px]", className)}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.div
        className="relative [transform-style:preserve-3d] will-change-transform"
        style={
          active ? { rotateX, rotateY, transformOrigin: "50% 100%" } : undefined
        }
      >
        {children}
        {active ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ backgroundImage: glare }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
