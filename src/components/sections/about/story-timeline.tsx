"use client";

import { useRef } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { gsap, registerGsapPlugins, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";

registerGsapPlugins(DrawSVGPlugin);

export type TimelineItem = { year: string; title: string; description: string };

/**
 * Vertical story timeline. A hairline track runs down the left; an indigo→cyan line draws
 * over it as you scroll (DrawSVGPlugin, scrubbed) and each milestone's dot lights up when the
 * line reaches it. SSR / no-JS / reduced motion: fully drawn, every milestone active.
 * Same layout on mobile (lighter: no scrub smoothing).
 */
export function StoryTimeline({ items, className }: { items: readonly TimelineItem[]; className?: string }) {
  const rootRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || window.matchMedia(MEDIA.reducedMotion).matches) return;
      const line = root.querySelector<SVGLineElement>("[data-progress]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", root);
      if (!line) return;

      const mobile = window.matchMedia(MEDIA.mobile).matches;
      root.dataset.ready = "";

      gsap.fromTo(
        line,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 65%", scrub: mobile ? true : 0.6 },
        },
      );

      for (const node of nodes) {
        ScrollTrigger.create({
          trigger: node,
          start: "top 68%",
          onEnter: () => node.setAttribute("data-active", ""),
          onLeaveBack: () => node.removeAttribute("data-active"),
        });
      }

      return () => {
        delete root.dataset.ready;
        nodes.forEach((n) => n.removeAttribute("data-active"));
      };
    },
    { scope: rootRef },
  );

  return (
    <ol ref={rootRef} className={cn("group/timeline relative flex flex-col gap-14 md:gap-20", className)}>
      {/* Track + drawn progress line (2px wide, stretches to the list height). */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-2 bottom-2 left-[7px] h-[calc(100%-1rem)] w-[2px] overflow-visible md:left-[calc(9rem+7px)]"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-indigo)" />
            <stop offset="100%" stopColor="var(--brand-cyan)" />
          </linearGradient>
        </defs>
        <line x1="1" y1="0" x2="1" y2="100" stroke="var(--line-strong)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <line
          data-progress=""
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="url(#timeline-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {items.map((item, i) => (
        <li
          key={`${item.title}-${i}`}
          data-node=""
          className="group/node relative grid grid-cols-[16px_1fr] gap-x-6 md:grid-cols-[9rem_16px_1fr] md:gap-x-10"
        >
          <p className="col-start-2 row-start-1 mb-2 font-mono text-label text-highlight transition-colors duration-500 md:col-start-1 md:mb-0 md:pt-0.5 md:text-right group-data-ready/timeline:not-group-data-active/node:text-muted-foreground">
            {item.year}
          </p>
          <span
            aria-hidden="true"
            className="relative col-start-1 row-span-2 row-start-1 mt-1 flex size-4 items-center justify-center md:col-start-2 md:row-span-1"
          >
            <span className="absolute inset-0 rounded-full border border-line-strong bg-background" />
            <span className="relative size-2 rounded-full bg-indigo shadow-[0_0_0_4px_rgb(91_76_245/0.18)] transition-[transform,opacity] duration-500 ease-expo-out group-data-ready/timeline:not-group-data-active/node:scale-50 group-data-ready/timeline:not-group-data-active/node:opacity-30" />
          </span>
          <div className="col-start-2 max-w-xl transition-opacity duration-500 md:col-start-3 md:row-start-1 group-data-ready/timeline:not-group-data-active/node:opacity-55">
            <h3 className="text-heading-md text-foreground">{item.title}</h3>
            <p className="mt-2 text-body text-muted-foreground">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
