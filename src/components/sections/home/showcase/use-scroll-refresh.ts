"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps pinned ScrollTriggers honest while the page settles:
 * - refreshes once web fonts are ready (text reflow changes section heights);
 * - refreshes (debounced) when the document height changes for reasons
 *   ScrollTrigger can't see — lazy 3D, images, other sections hydrating.
 * Triggers are sorted first so pins refresh in page order (products → work),
 * whatever order their components mounted in. Safe to call from several
 * components: a refresh records the new height, so the other observers skip.
 */
export function useScrollRefresh() {
  useEffect(() => {
    let lastHeight = document.documentElement.scrollHeight;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const refresh = () => {
      if (cancelled) return;
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const onRefresh = () => {
      lastHeight = document.documentElement.scrollHeight;
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    document.fonts?.ready.then(refresh).catch(() => {});

    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (Math.abs(document.documentElement.scrollHeight - lastHeight) > 2) refresh();
      }, 250);
    });
    observer.observe(document.body);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, []);
}
