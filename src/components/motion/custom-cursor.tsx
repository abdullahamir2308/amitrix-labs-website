"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const INTERACTIVE =
  'a, button, [role="button"], [data-cursor], input, select, textarea, label, summary';
const VIEW = '[data-cursor="view"], img, picture, video';

type CursorState = "default" | "hover" | "view" | "hidden";

export type CustomCursorProps = {
  /** Hide the native cursor while the custom one is active. Default true. */
  hideNative?: boolean;
};

/**
 * Dot + trailing ring. The ring grows over links, buttons and `[data-cursor]`,
 * and turns into a "View" bubble over images and `[data-cursor="view"]`
 * (custom text: `data-cursor-label="Play"`). Not rendered on touch / coarse
 * pointers or under reduced motion. Mount once (Phase 4 puts it in the layout).
 */
export function CustomCursor({ hideNative = true }: CustomCursorProps) {
  const fine = useMediaQuery(MEDIA.finePointer);
  const reduced = useMediaQuery(MEDIA.reducedMotion);
  const enabled = fine && !reduced;

  if (!enabled) return null;
  return <CursorLayer hideNative={hideNative} />;
}

function CursorLayer({ hideNative }: { hideNative: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const root = document.documentElement;
    if (hideNative) root.setAttribute("data-custom-cursor", "");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let state: CursorState = "hidden";
    const setState = (next: CursorState, text = "View") => {
      if (next === state && (next !== "view" || label.textContent === text)) return;
      state = next;
      ring.dataset.state = next;
      dot.dataset.state = next;
      if (next === "view") label.textContent = text;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      if (state === "hidden") setState("default");
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      const view = target.closest<HTMLElement>(VIEW);
      if (view) {
        setState("view", view.dataset.cursorLabel ?? "View");
        return;
      }
      setState(target.closest(INTERACTIVE) ? "hover" : "default");
    };

    const onLeaveWindow = () => setState("hidden");
    const onDown = () => ring.setAttribute("data-pressed", "");
    const onUp = () => ring.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      root.removeAttribute("data-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([dot, ring]);
    };
  }, [hideNative]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        data-state="hidden"
        className="group/cursor fixed top-0 left-0 flex size-9 items-center justify-center rounded-full border border-indigo/60 transition-[width,height,background-color,border-color,opacity,scale] duration-300 ease-expo-out data-pressed:scale-90 data-[state=hidden]:opacity-0 data-[state=hover]:size-14 data-[state=hover]:border-indigo data-[state=hover]:bg-indigo/10 data-[state=view]:size-20 data-[state=view]:border-transparent data-[state=view]:bg-indigo data-[state=view]:shadow-glow-indigo"
      >
        <span
          ref={labelRef}
          className="font-mono text-[0.6875rem] font-medium tracking-[0.14em] text-white uppercase opacity-0 transition-opacity duration-200 group-data-[state=view]/cursor:opacity-100"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        data-state="hidden"
        className="fixed top-0 left-0 size-1.5 rounded-full bg-indigo transition-[opacity,scale] duration-200 data-[state=hidden]:opacity-0 data-[state=view]:scale-0"
      />
    </div>
  );
}
