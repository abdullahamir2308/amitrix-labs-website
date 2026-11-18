"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import s from "./bento.module.css";

/**
 * Decorative stage for a bento micro-animation. Animations only run while the
 * stage is on screen (IntersectionObserver toggles [data-active]); reduced
 * motion freezes them on their finished frame (CSS). Hidden from assistive tech.
 */
export function VisualFrame({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "80px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" data-active={active || undefined} className={cn(s.visual, className)}>
      {children}
    </div>
  );
}
