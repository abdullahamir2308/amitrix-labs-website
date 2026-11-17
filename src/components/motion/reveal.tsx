"use client";

import { Children, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

const TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  article: motion.article,
} as const;

type RevealTag = keyof typeof TAGS;

export type RevealProps = {
  children: ReactNode;
  /** Wrapper element. Default "div". */
  as?: RevealTag;
  /** Seconds before the reveal starts. */
  delay?: number;
  /** When set, each direct child reveals in turn, this many seconds apart. */
  stagger?: number;
  /** Element wrapping each child in stagger mode. Default "div" ("li" when as="ul"/"ol"). */
  itemAs?: RevealTag;
  itemClassName?: string;
  /** Start offset in px (slides up from here). Default 24. */
  y?: number;
  duration?: number;
  /** Only reveal once (default) or every time it enters. */
  once?: boolean;
  /** Portion of the element that must be visible to trigger (0–1). Default 0.2. */
  amount?: number;
  className?: string;
};

/**
 * Fade + slide up when the element enters the viewport.
 * Content is in the server HTML. Reduced motion: shown immediately
 * (globals.css forces `[data-reveal]` to its final state; MotionConfig
 * skips transforms). Transforms only, so no layout shift.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  stagger,
  itemAs,
  itemClassName,
  y = 24,
  duration = DURATION.reveal,
  once = true,
  amount = 0.2,
  className,
}: RevealProps) {
  const Tag = TAGS[as];
  const viewport = { once, amount };
  const transition = { duration, ease: EASE.expoOut };

  if (stagger === undefined) {
    return (
      <Tag
        data-reveal=""
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ ...transition, delay }}
      >
        {children}
      </Tag>
    );
  }

  const Item = TAGS[itemAs ?? (as === "ul" || as === "ol" ? "li" : "div")];
  const parent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition },
  };

  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={viewport} variants={parent}>
      {Children.toArray(children).map((child, i) => (
        <Item key={i} data-reveal="" variants={item} className={cn(itemClassName)}>
          {child}
        </Item>
      ))}
    </Tag>
  );
}
