"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";

/**
 * Giant "AMITRIX" wordmark at the foot of the page. SVG text with textLength fills the
 * container width exactly at any size; it rises out of the bottom edge as the footer
 * scrolls into view (scrubbed). Reduced motion: static, fully risen.
 */
export function FooterWordmark({ text = "AMITRIX" }: { text?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia(MEDIA.reducedMotion).matches || !textRef.current) return;
      gsap.fromTo(
        textRef.current,
        { yPercent: 70, opacity: 0.2 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none relative overflow-hidden select-none">
      <svg viewBox="0 0 1000 152" className="block h-auto w-full" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="amx-wm-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fafaf9" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fafaf9" stopOpacity="0.015" />
          </linearGradient>
          <linearGradient id="amx-wm-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#5b4cf5" stopOpacity="0.75" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="amx-wm-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.35" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
          </linearGradient>
          <mask id="amx-wm-mask">
            <rect width="1000" height="152" fill="url(#amx-wm-fade)" />
          </mask>
        </defs>
        <g ref={textRef} mask="url(#amx-wm-mask)">
          <text
            x="2"
            y="152"
            textLength="996"
            lengthAdjust="spacingAndGlyphs"
            fontSize="208"
            fontWeight="600"
            letterSpacing="-4"
            fill="url(#amx-wm-fill)"
            stroke="url(#amx-wm-stroke)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {text}
          </text>
        </g>
      </svg>
    </div>
  );
}
