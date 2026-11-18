"use client";

import { useEffect, useRef } from "react";

/**
 * Thin indigo→cyan bar fixed to the top of the viewport that fills as you read the element
 * with id `targetId`. Uses scaleX (compositor only) updated in rAF; works with Lenis because
 * Lenis scrolls the window. Reduced motion is fine: it tracks position, it doesn't animate.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const target = document.getElementById(targetId);
    if (!bar || !target) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const read = -rect.top + window.innerHeight * 0.25;
      const progress = total > 0 ? Math.min(1, Math.max(0, read / total)) : 1;
      bar.style.transform = `scaleX(${progress})`;
      bar.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId]);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-indigo to-cyan shadow-[0_0_12px_rgb(91_76_245/0.6)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
