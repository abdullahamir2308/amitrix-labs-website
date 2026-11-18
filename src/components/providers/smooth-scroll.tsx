"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MEDIA, setLenis } from "@/lib/motion";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one RAF loop. Off under prefers-reduced-motion and on touch-only
 * devices (native momentum scrolling is better there). Lenis itself is
 * imported on demand, so phones and reduced-motion visitors never download it.
 */
export function SmoothScroll() {
  const reduced = useMediaQuery(MEDIA.reducedMotion);
  const touchOnly = useMediaQuery("(hover: none) and (pointer: coarse)");

  useEffect(() => {
    if (reduced || touchOnly) return;

    let cancelled = false;
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({
        lerp: 0.1,
        wheelMultiplier: 1,
        anchors: true,
        autoRaf: false,
      });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      if (!lenis) return;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced, touchOnly]);

  return null;
}
