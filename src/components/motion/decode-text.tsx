"use client";

import { useRef, type ElementType } from "react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { gsap, registerGsapPlugins, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { DECODE_CHARS, MEDIA, REVEAL_START } from "@/lib/motion";
import { cn } from "@/lib/cn";

registerGsapPlugins(ScrambleTextPlugin);

export type DecodeTextProps = {
  /** The final text (plain string). */
  children: string;
  /** Element to render. Default "span". */
  as?: ElementType;
  className?: string;
  /** "inView" (default), "mount", or "hover" (plays on mount-in-view and again on each hover). */
  trigger?: "inView" | "mount" | "hover";
  /** Seconds. Default scales with length, ~0.9–1.6s. */
  duration?: number;
  delay?: number;
  /** Character pool for the scramble. */
  chars?: string;
  id?: string;
};

/**
 * Scrambles from random characters into the final text (GSAP ScrambleTextPlugin).
 * The real text stays in the DOM the whole time (only its colour is made
 * transparent while an aria-hidden overlay scrambles on top), so screen
 * readers, SEO and layout never see the random characters. The overlay is clipped
 * horizontally to the word's box, so wide scramble glyphs never spill past the
 * final text. Reduced motion: static.
 */
export function DecodeText({
  children: text,
  as: Tag = "span",
  className,
  trigger = "inView",
  duration,
  delay = 0,
  chars = DECODE_CHARS,
  id,
}: DecodeTextProps) {
  const rootRef = useRef<HTMLElement>(null);
  const finalRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      const final = finalRef.current;
      const overlay = overlayRef.current;
      if (!root || !final || !overlay || !contextSafe) return;
      if (window.matchMedia(MEDIA.reducedMotion).matches) return;

      const total = duration ?? Math.min(1.6, 0.6 + text.length * 0.025);
      let tween: gsap.core.Tween | null = null;

      const finish = () => {
        final.style.color = "";
        overlay.textContent = "";
      };

      const play = contextSafe((withDelay: boolean) => {
        tween?.kill();
        final.style.color = "transparent";
        overlay.textContent = text.replace(/\S/g, () => chars[Math.floor(Math.random() * chars.length)]);
        tween = gsap.to(overlay, {
          duration: total,
          delay: withDelay ? delay : 0,
          ease: "none",
          scrambleText: { text, chars, speed: 0.6, revealDelay: total * 0.25, tweenLength: false },
          onComplete: finish,
        });
      });

      if (trigger === "mount") {
        play(true);
      } else {
        ScrollTrigger.create({
          trigger: root,
          start: REVEAL_START,
          once: true,
          onEnter: () => play(true),
        });
      }

      if (trigger === "hover") {
        const onEnter = () => play(false);
        root.addEventListener("pointerenter", onEnter);
        return () => {
          root.removeEventListener("pointerenter", onEnter);
          finish();
        };
      }
      return finish;
    },
    { scope: rootRef, dependencies: [text, trigger, duration, delay, chars] },
  );

  return (
    <Tag ref={rootRef} id={id} data-slot="decode-text" className={cn(className)}>
      <span className="relative inline-block max-w-full">
        <span ref={finalRef}>{text}</span>
        <span
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-x-clip whitespace-pre-wrap"
        />
      </span>
    </Tag>
  );
}
