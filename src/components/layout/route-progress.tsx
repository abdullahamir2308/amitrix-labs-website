"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";
import { EASE, getLenis } from "@/lib/motion";
import { ROUTE_CHANGE_EVENT, doneProgress, onProgress, startProgress } from "./route-store";

/**
 * Thin indigo bar at the top of the viewport while a route loads, plus the shell's
 * route-change housekeeping (Lenis sync, ScrollTrigger refresh, focus to <main>).
 */
export function RouteProgress() {
  return (
    <>
      <ProgressBar />
      <Suspense fallback={null}>
        <RouteEvents />
      </Suspense>
    </>
  );
}

function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let trickle: ReturnType<typeof animate> | null = null;
    let failsafe = 0;
    let active = false;

    const off = onProgress((state) => {
      if (state === "start") {
        if (active) return;
        active = true;
        trickle?.stop();
        bar.style.opacity = "1";
        bar.style.transform = "scaleX(0)";
        trickle = animate(bar, { scaleX: [0, 0.3, 0.6, 0.85] }, { duration: 6, times: [0, 0.04, 0.3, 1], ease: "easeOut" });
        window.clearTimeout(failsafe);
        failsafe = window.setTimeout(doneProgress, 10000);
      } else {
        if (!active) return;
        active = false;
        window.clearTimeout(failsafe);
        trickle?.stop();
        trickle = animate(bar, { scaleX: 1 }, { duration: 0.25, ease: EASE.expoOut });
        trickle.then(() => {
          if (!active) animate(bar, { opacity: 0 }, { duration: 0.3 });
        });
      }
    });

    // Start on internal link clicks that will change the pathname.
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !anchor.href || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      startProgress();
    };
    document.addEventListener("click", onClick, true);
    return () => {
      off();
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(failsafe);
      trickle?.stop();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-0.5">
      <div
        ref={barRef}
        className="h-full origin-left bg-indigo opacity-0 shadow-[0_0_10px_rgb(91_76_245/0.7),0_0_2px_rgb(34_211_238/0.6)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

function RouteEvents() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    // First render (and Strict Mode's effect re-run) is the initial page load, not a navigation.
    const previous = lastPath.current;
    lastPath.current = pathname;
    if (previous === null || previous === pathname) return;
    doneProgress();

    const lenis = getLenis();
    const hash = location.hash;
    if (lenis) {
      if (hash && document.getElementById(decodeURIComponent(hash.slice(1)))) {
        lenis.scrollTo(hash, { immediate: true, force: true, offset: -64 });
      } else if (popped.current) {
        // Back/forward: keep the position the browser restored, just resync Lenis.
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      } else {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
    } else if (!hash && !popped.current) {
      window.scrollTo(0, 0);
    }
    popped.current = false;

    document.getElementById("main")?.focus({ preventScroll: true });

    // Let the new page mount its ScrollTriggers, then measure everything again
    // (once now, once after the view transition / images settle).
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
      });
    });
    const late = window.setTimeout(() => {
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
    }, 700);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(late);
    };
  }, [pathname]);

  return null;
}
