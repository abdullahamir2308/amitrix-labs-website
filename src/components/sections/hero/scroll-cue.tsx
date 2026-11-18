"use client";

import { useRef } from "react";
import { scrollToTarget } from "@/lib/motion";
import { cn } from "@/lib/cn";
import styles from "./hero.module.css";

/** "Scroll" label with a travelling light; scrolls to the section after the hero. */
export function ScrollCue({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    const hero = ref.current?.closest("section");
    if (!hero) return;
    scrollToTarget(hero.offsetTop + hero.offsetHeight);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`${label} to content`}
      className={cn(
        "group inline-flex flex-col items-center gap-2.5 rounded-md px-2 py-1 font-mono text-[0.6875rem] tracking-[0.18em] text-muted-foreground uppercase transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <span>{label}</span>
      <span aria-hidden="true" className={styles.cueTrack} />
    </button>
  );
}
