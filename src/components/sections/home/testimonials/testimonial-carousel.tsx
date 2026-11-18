"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ContentImage } from "@/lib/content";
import styles from "./testimonials.module.css";

export type TestimonialSlide = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: ContentImage;
};

const SLIDE_MS = 7000;

/**
 * Auto-advancing testimonial carousel (WAI-ARIA APG carousel pattern):
 * region with aria-roledescription="carousel", slides as labelled groups, a
 * live region that is "off" while auto-playing and "polite" otherwise, and
 * explicit play/pause, previous and next controls. Pauses on hover, on focus
 * inside, and while off-screen. Reduced motion: no autoplay, no slide motion.
 * All slides are server-rendered and stacked in one grid cell, so the height
 * is that of the tallest quote (no layout shift when slides change).
 */
export function TestimonialCarousel({ slides, label }: { slides: TestimonialSlide[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const count = slides.length;

  const autoplay = !reduced && !userPaused && count > 1;
  const running = autoplay && !hovered && !focused && inView;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      className="relative overflow-hidden rounded-2xl border border-line bg-card shadow-card"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(91_76_245/0.10),transparent_65%)]"
      />
      <div className="relative grid gap-4 p-6 sm:p-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14 md:p-14">
        <span aria-hidden="true" className="font-mono text-[5rem] leading-[0.7] text-highlight select-none md:text-[7rem]">
          “
        </span>

        <div className="flex flex-col gap-10">
          <div aria-live={autoplay ? "off" : "polite"} className="grid">
            {slides.map((s, i) => {
              const on = i === index;
              return (
                <figure
                  key={s.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!on}
                  inert={!on}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col gap-8 transition-[opacity,transform] duration-700 ease-expo-out motion-reduce:transition-none",
                    on ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0 motion-reduce:translate-x-0",
                  )}
                >
                  <blockquote className="text-heading-md text-foreground md:text-heading-lg">
                    <p>{s.quote}</p>
                  </blockquote>
                  <figcaption className="flex items-center gap-4">
                    {s.avatar ? (
                      <Image
                        src={s.avatar}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 rounded-full border border-line bg-surface object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="inline-flex size-12 items-center justify-center rounded-full border border-line bg-surface font-mono text-sm text-muted-foreground"
                      >
                        {s.name.replace(/\[.*?\]\s*/g, "").charAt(0) || "·"}
                      </span>
                    )}
                    <div className="flex min-w-0 flex-col">
                      <span className="text-body-sm font-medium text-foreground">{s.name}</span>
                      <span className="text-caption text-muted-foreground">
                        {s.role}, {s.company}
                      </span>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {count > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
              <div className="flex flex-1 items-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show testimonial ${i + 1} of ${count}`}
                    aria-current={i === index ? "true" : undefined}
                    className="group/dot relative flex h-6 max-w-20 flex-1 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="relative h-0.5 w-full overflow-hidden rounded-full bg-line-strong">
                      {i === index && autoplay ? (
                        <span
                          key={`${index}`}
                          data-paused={running ? undefined : ""}
                          onAnimationEnd={() => go(index + 1)}
                          style={{ "--slide-duration": `${SLIDE_MS}ms` } as CSSProperties}
                          className={cn("absolute inset-0 rounded-full bg-indigo", styles.progress)}
                        />
                      ) : (
                        <span
                          className={cn(
                            "absolute inset-0 rounded-full bg-indigo transition-opacity duration-300",
                            i === index ? "opacity-100" : "opacity-0 group-hover/dot:opacity-40",
                          )}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {!reduced ? (
                  <ControlButton
                    label={userPaused ? "Start automatic slide show" : "Stop automatic slide show"}
                    onClick={() => setUserPaused((p) => !p)}
                  >
                    {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                  </ControlButton>
                ) : null}
                <ControlButton label="Previous testimonial" onClick={() => go(index - 1)}>
                  <ArrowLeft className="size-4" />
                </ControlButton>
                <ControlButton label="Next testimonial" onClick={() => go(index + 1)}>
                  <ArrowRight className="size-4" />
                </ControlButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface-raised text-foreground transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none"
    >
      <span aria-hidden="true" className="contents">
        {children}
      </span>
    </button>
  );
}
