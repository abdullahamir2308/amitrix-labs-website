"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { MEDIA, REVEAL_START } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type CounterProps = {
  /** Final value (rendered in the server HTML). */
  value: number;
  /** Start value. Default 0. */
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. Default 1.6. */
  duration?: number;
  delay?: number;
  /** Thousands separators etc. Fixed locale keeps server and client output identical. */
  locale?: string;
  /**
   * "inView" (default) counts when it scrolls into view; "mount" counts right after hydration
   * (above-the-fold stats, e.g. the hero), independent of scroll position / ScrollTrigger.
   */
  trigger?: "inView" | "mount";
  className?: string;
};

/**
 * Counts up to `value` when it scrolls into view (or on mount with `trigger="mount"`). The final value is in the
 * server HTML and in an sr-only copy; the animated digits are aria-hidden and
 * sit on top of an invisible copy of the final value, so the width never
 * changes (no layout shift). Reduced motion: static final value.
 */
export function Counter({
  value,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  delay = 0,
  locale = "en-US",
  trigger = "inView",
  className,
}: CounterProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    `${prefix}${n.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  const finalText = format(value);

  useGSAP(
    () => {
      const root = rootRef.current;
      const live = liveRef.current;
      if (!root || !live) return;
      if (window.matchMedia(MEDIA.reducedMotion).matches) return;

      const state = { n: from };
      const render = () => {
        live.textContent = format(state.n);
      };
      render();

      const play = () => gsap.to(state, { n: value, duration, delay, ease: "expo.out", onUpdate: render });
      if (trigger === "mount") play();
      else ScrollTrigger.create({ trigger: root, start: REVEAL_START, once: true, onEnter: play });

      return () => {
        live.textContent = finalText;
      };
    },
    { scope: rootRef, dependencies: [value, from, decimals, prefix, suffix, duration, delay, locale, trigger] },
  );

  return (
    <span ref={rootRef} data-slot="counter" className={cn("inline-grid tabular-nums", className)}>
      <span className="sr-only">{finalText}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {finalText}
      </span>
      <span ref={liveRef} aria-hidden="true" className="col-start-1 row-start-1 text-right">
        {finalText}
      </span>
    </span>
  );
}
