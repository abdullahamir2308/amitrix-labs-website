"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { MEDIA, REVEAL_START } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type TextRevealProps = {
  children: ReactNode;
  /** Element to render, e.g. "h1", "h2", "p". Default "h2". */
  as?: ElementType;
  className?: string;
  /** Seconds before the first line moves. */
  delay?: number;
  /** Seconds between lines. Default 0.08. */
  stagger?: number;
  duration?: number;
  /** "inView" (default) waits for scroll; "mount" plays immediately (above-the-fold heroes). */
  trigger?: "inView" | "mount";
  id?: string;
};

/**
 * Line-by-line masked reveal (GSAP SplitText, `mask: "lines"`, `autoSplit`
 * so lines re-flow on resize / font load). The full text is server-rendered.
 * Before the split it is `visibility: hidden` (CSS, with a 2.5s failsafe and
 * a <noscript> override); reduced motion shows it as-is, never split.
 */
export function TextReveal({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.08,
  duration = 1,
  trigger = "inView",
  id,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const ready = () => el.setAttribute("data-ready", "");

      if (window.matchMedia(MEDIA.reducedMotion).matches) {
        ready();
        return;
      }

      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "text-reveal-line",
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          ready();
          return gsap.from(self.lines, {
            yPercent: 110,
            duration,
            delay,
            stagger,
            ease: "expo.out",
            scrollTrigger:
              trigger === "inView" ? { trigger: el, start: REVEAL_START, once: true } : undefined,
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [delay, stagger, duration, trigger] },
  );

  return (
    <Tag ref={ref} id={id} data-text-reveal="" className={cn(className)}>
      {children}
    </Tag>
  );
}
