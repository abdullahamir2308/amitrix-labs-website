"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  ServiceRow,
  type ServiceRowData,
} from "@/components/cards/service-row";
import { useFinePointer, useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { EASE } from "@/lib/motion";

const PREVIEW_W = 340;
const PREVIEW_H = 255;
const FOLLOW = { stiffness: 260, damping: 28, mass: 0.6 } as const;

/**
 * Every service as a large row. On desktop with a mouse, a framed preview of the hovered
 * service's image follows the cursor (spring-smoothed, cross-fading between services).
 * Touch, < lg and reduced motion: no floating preview; rows show their image inline (< lg).
 */
export function ServiceList({ services }: { services: ServiceRowData[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const enabled = fine && !reduced && wide;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, FOLLOW);
  const sy = useSpring(y, FOLLOW);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = listRef.current;
    if (!enabled || !el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    // Centre on the cursor, clamped inside the list so it never causes horizontal overflow.
    const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));
    const px = clamp(
      event.clientX - rect.left - PREVIEW_W / 2,
      rect.width - PREVIEW_W,
    );
    const py = clamp(
      event.clientY - rect.top - PREVIEW_H / 2,
      rect.height - PREVIEW_H,
    );
    // Snap (no spring) when the preview first appears, so it doesn't fly in from a corner.
    if (active === null) {
      x.jump(px);
      y.jump(py);
      sx.jump(px);
      sy.jump(py);
    } else {
      x.set(px);
      y.set(py);
    }
  };

  const activeService = active === null ? null : services[active];

  return (
    <div
      ref={listRef}
      className="group/list relative border-b border-line"
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
    >
      {services.map((service, i) => (
        <ServiceRow
          key={service.slug}
          service={service}
          index={i + 1}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setActive(i);
          }}
        />
      ))}

      {enabled ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10"
          style={{ x: sx, y: sy, width: PREVIEW_W, height: PREVIEW_H }}
        >
          <AnimatePresence>
            {activeService?.image ? (
              <motion.div
                key="preview"
                className="section-dark absolute inset-0 overflow-hidden rounded-xl border border-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_30px_80px_-24px_rgb(10_10_18/0.55)]"
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
                transition={{ duration: 0.35, ease: EASE.expoOut }}
              >
                {services.map((s, i) =>
                  s.image ? (
                    <Image
                      key={s.slug}
                      src={s.image}
                      alt=""
                      fill
                      sizes={`${PREVIEW_W}px`}
                      className="object-cover transition-opacity duration-300 ease-expo-out"
                      style={{ opacity: i === active ? 1 : 0 }}
                    />
                  ) : null,
                )}
                <span className="absolute bottom-3 left-3 rounded-md bg-ink/70 px-2 py-1 font-mono text-[0.625rem] tracking-[0.14em] text-paper uppercase backdrop-blur-md">
                  {String((active ?? 0) + 1).padStart(2, "0")} —{" "}
                  {activeService.title}
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}
