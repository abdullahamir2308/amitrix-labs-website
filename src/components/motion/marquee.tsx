"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export type MarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop. Default 40. */
  duration?: number;
  direction?: "left" | "right";
  /** Speed multiplier while hovered (0 = stop). Default 0.2. */
  hoverSpeed?: number;
  /** Gap between items and between copies (CSS length). Default "3rem". */
  gap?: string;
  /** Total copies of the content (≥2). Raise it for short content on wide screens. */
  copies?: number;
  /** Fade the left/right edges. Default true. */
  fade?: boolean;
  className?: string;
  /** Accessible name for the region. */
  label?: string;
};

/**
 * Infinite horizontal loop (CSS animation, compositor-only). Eases down to
 * `hoverSpeed` on hover via the Web Animations playbackRate, pauses while
 * offscreen, and the duplicated copies are aria-hidden. Reduced motion:
 * no animation, a single wrapped row.
 */
export function Marquee({
  children,
  duration = 40,
  direction = "left",
  hoverSpeed = 0.2,
  gap = "3rem",
  copies = 2,
  fade = true,
  className,
  label,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.getAnimations !== "function") return;
    const animations = () => el.getAnimations({ subtree: true });
    const rate = { value: 1 };
    const apply = () => animations().forEach((a) => (a.playbackRate = rate.value));
    const ease = (to: number) => gsap.to(rate, { value: to, duration: 0.8, ease: "power3.out", onUpdate: apply, overwrite: true });

    const onEnter = () => ease(hoverSpeed);
    const onLeave = () => ease(1);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      animations().forEach((a) => (entry.isIntersecting ? a.play() : a.pause()));
    });
    io.observe(el);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      io.disconnect();
      gsap.killTweensOf(rate);
    };
  }, [hoverSpeed]);

  const style = { "--marquee-duration": `${duration}s`, "--marquee-gap": gap } as CSSProperties;

  return (
    <div
      ref={ref}
      role={label ? "region" : undefined}
      aria-label={label}
      data-slot="marquee"
      data-direction={direction}
      className={cn("marquee", fade && "mask-fade-x", className)}
      style={style}
    >
      {Array.from({ length: Math.max(2, copies) }, (_, i) => (
        <div key={i} className="marquee-track" aria-hidden={i > 0 ? true : undefined}>
          {children}
        </div>
      ))}
    </div>
  );
}
