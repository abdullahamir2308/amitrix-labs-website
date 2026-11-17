"use client";

import { useRef, type ComponentProps, type CSSProperties, type PointerEvent } from "react";
import { cn } from "@/lib/cn";

const COLORS = {
  indigo: "rgb(91 76 245 / 0.9)",
  cyan: "rgb(34 211 238 / 0.85)",
} as const;

export type SpotlightCardProps = ComponentProps<"div"> & {
  /** Glow colour: brand preset or any CSS colour. Default "indigo". */
  color?: keyof typeof COLORS | (string & {});
  /** Glow radius in px. Default 360. */
  size?: number;
};

/**
 * Card surface whose 1px border lights up with a radial glow that follows
 * the cursor (CSS variables --spot-x/--spot-y set on pointermove; the glow is
 * drawn by `.spotlight` pseudo-elements in globals.css). Touch / reduced
 * motion: a fixed soft highlight at the top edge.
 */
export function SpotlightCard({
  color = "indigo",
  size = 360,
  className,
  style,
  onPointerMove,
  children,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  const spotColor = color in COLORS ? COLORS[color as keyof typeof COLORS] : color;

  return (
    <div
      ref={ref}
      data-slot="spotlight-card"
      onPointerMove={handleMove}
      style={{ "--spot-color": spotColor, "--spot-size": `${size}px`, ...style } as CSSProperties}
      className={cn(
        "spotlight rounded-2xl border border-line bg-card text-card-foreground shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
