"use client";

import { useId, useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Wraps the server-rendered process steps and draws the connecting hairline
 * with scroll (DrawSVG, scrubbed). Each `[data-step]` gets `data-active` once
 * the drawn line passes its `[data-dot]`. Horizontal line from md, vertical
 * below. Reduced motion: the line is drawn and every step is lit (the SSR state).
 *
 * The SVGs scale non-uniformly along the line only (viewBox 100×2 / 2×100 with
 * a 2px cross-axis), so stroke width stays crisp without non-scaling-stroke and
 * DrawSVG's lengths stay in consistent user units.
 */
export function ProcessLine({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useGSAP(
    () => {
      const el = root.current!;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 48rem)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          if (reduce) return;

          const svg = el.querySelector<SVGSVGElement>(desktop ? "[data-line-h]" : "[data-line-v]")!;
          const line = svg.querySelector<SVGLineElement>("[data-draw]")!;
          let thresholds: number[] = [];

          const measure = () => {
            const box = svg.getBoundingClientRect();
            thresholds = steps.map((step) => {
              const dot = step.querySelector<HTMLElement>("[data-dot]")!.getBoundingClientRect();
              const t = desktop
                ? (dot.left + dot.width / 2 - box.left) / box.width
                : (dot.top + dot.height / 2 - box.top) / box.height;
              return Math.max(0, Math.min(1, t));
            });
          };
          const apply = (progress: number) => {
            steps.forEach((step, i) => {
              const on = progress > 0.002 && progress >= thresholds[i] - 0.002;
              if (on) step.setAttribute("data-active", "");
              else step.removeAttribute("data-active");
            });
          };

          measure();
          apply(0);
          gsap.fromTo(
            line,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: desktop ? "top 78%" : "top 70%",
                end: desktop ? "bottom 55%" : "bottom 70%",
                scrub: 0.5,
                onRefresh: measure,
              },
              onUpdate() {
                apply(this.progress());
              },
            },
          );

          return () => steps.forEach((step) => step.setAttribute("data-active", ""));
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const stroke = `url(#${gid}-grad)`;
  return (
    <div ref={root} className="relative">
      {/* Horizontal (md+): from the first dot's centre to the right edge */}
      <svg
        data-line-h=""
        aria-hidden="true"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-[6.5px] right-0 left-[7.5px] hidden h-[2px] w-[calc(100%-7.5px)] overflow-visible md:block"
      >
        <defs>
          <linearGradient id={`${gid}-grad`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand-indigo)" />
            <stop offset="1" stopColor="var(--brand-cyan)" />
          </linearGradient>
        </defs>
        <line x1="0" y1="1" x2="100" y2="1" stroke="var(--line-strong)" strokeWidth="1" />
        <line data-draw="" x1="0" y1="1" x2="100" y2="1" stroke={stroke} strokeWidth="1.5" />
      </svg>
      {/* Vertical (mobile): down the left edge through every dot */}
      <svg
        data-line-v=""
        aria-hidden="true"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-[10px] bottom-0 left-[6.5px] h-[calc(100%-10px)] w-[2px] overflow-visible md:hidden"
      >
        <defs>
          <linearGradient id={`${gid}-grad-v`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand-indigo)" />
            <stop offset="1" stopColor="var(--brand-cyan)" />
          </linearGradient>
        </defs>
        <line x1="1" y1="0" x2="1" y2="100" stroke="var(--line-strong)" strokeWidth="1" />
        <line data-draw="" x1="1" y1="0" x2="1" y2="100" stroke={`url(#${gid}-grad-v)`} strokeWidth="1.5" />
      </svg>
      {children}
    </div>
  );
}
