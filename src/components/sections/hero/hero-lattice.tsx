"use client";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";
import styles from "./hero.module.css";

// three.js / R3F live only in these async chunks, fetched after first paint + idle.
const LatticeScene = dynamic(() => import("./lattice-scene"), { ssr: false });
const LatticeCanvas2D = dynamic(() => import("./lattice-canvas-2d"), { ssr: false });

type Mode = "idle" | "webgl" | "2d";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** If the WebGL scene throws (context lost / creation failed), drop to the 2D canvas. */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Background controller for the hero lattice. Picks the variant after first
 * paint (WebGL ≥768px, 2D canvas below or without WebGL, nothing for reduced
 * motion — the CSS still covers that), pauses it off-screen or in a hidden tab,
 * and feeds it the hero's scroll-out progress.
 */
export function HeroLattice() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const [mode, setMode] = useState<Mode>("idle");
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const fallback = useCallback(() => setMode("2d"), []);

  // Choose + load the variant only after the page has loaded and the main thread is idle, so
  // the lattice chunk, its first frames and (for WebGL) shader compilation never compete with
  // hydration and the headline/LCP paint. The CSS glow + grid cover the hero until then.
  useEffect(() => {
    if (window.matchMedia(MEDIA.reducedMotion).matches) return;
    let idle = 0;
    let timer = 0;
    let raf = 0;
    const start = () => {
      setMode(window.matchMedia(MEDIA.mobile).matches || !supportsWebGL() ? "2d" : "webgl");
    };
    const schedule = () => {
      raf = requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 2000 });
        else timer = window.setTimeout(start, 300);
      });
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      cancelAnimationFrame(raf);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  // Pause when off-screen or the tab is hidden; track scroll-out progress.
  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.parentElement;
    if (!root || !hero) return;

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      scrollRef.current = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const active = inView && pageVisible;

  return (
    <div ref={rootRef} aria-hidden="true" className={cn(styles.lattice, ready && styles.latticeReady)}>
      {mode === "webgl" ? (
        <SceneBoundary onError={fallback}>
          <LatticeScene active={active} scrollRef={scrollRef} onReady={onReady} />
        </SceneBoundary>
      ) : null}
      {mode === "2d" ? <LatticeCanvas2D active={active} scrollRef={scrollRef} onReady={onReady} /> : null}
    </div>
  );
}
