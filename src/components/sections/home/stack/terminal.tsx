"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { TerminalLine } from "@/lib/site";
import styles from "./stack.module.css";

const TONE: Record<NonNullable<TerminalLine["tone"]>, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-success",
  accent: "text-signal",
  warn: "text-warning",
};

/** ms per typed character, pause after the command, base gap between log lines. */
const TYPE_MS = 55;
const AFTER_COMMAND_MS = 380;
const LINE_MS = 200;

/**
 * Terminal that types `command` once when scrolled into view, then prints the
 * log lines with their pacing and an elapsed-time column. Every line is in the
 * DOM from the start (fixed height, no layout shift; opacity reveals them), and
 * a screen-reader transcript carries the content. Reduced motion: final state.
 */
export function Terminal({ command, lines }: { command: string; lines: readonly TerminalLine[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);

  // Elapsed time stamp per line (deterministic, from the configured delays).
  const stamps: string[] = [];
  let elapsed = 0;
  for (const line of lines) {
    elapsed += LINE_MS + (line.delay ?? 0);
    stamps.push(`${(elapsed / 1000).toFixed(2)}s`);
  }

  const done = reduced || shown >= lines.length;
  const typedCount = reduced ? command.length : typed;
  const shownCount = reduced ? lines.length : shown;

  useEffect(() => {
    if (!inView || reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 250;
    for (let i = 1; i <= command.length; i++) {
      t += TYPE_MS + (command[i - 1] === " " ? 40 : 0);
      timers.push(setTimeout(() => setTyped(i), t));
    }
    t += AFTER_COMMAND_MS;
    lines.forEach((line, i) => {
      t += LINE_MS + (line.delay ?? 0);
      timers.push(setTimeout(() => setShown(i + 1), t));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced, command, lines]);

  const typing = typedCount < command.length || (typedCount === command.length && shownCount === 0);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[#07070d] font-mono text-[0.8125rem] leading-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_30px_80px_-40px_rgb(91_76_245/0.45)]"
    >
      <div className="flex h-10 items-center gap-3 border-b border-white/8 px-4">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="text-[0.6875rem] tracking-[0.08em] text-muted-foreground">~/amitrix — deploy</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[0.6875rem] tracking-[0.08em] text-muted-foreground">
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full transition-colors duration-500",
              done ? "bg-success shadow-[0_0_8px_var(--success)]" : "bg-warning",
            )}
          />
          {done ? "ready" : "building"}
        </span>
      </div>

      <p className="sr-only">
        Example deploy log. Command: {command}. {lines.map((l) => l.text).join(". ")}
      </p>

      <div aria-hidden="true" className="overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-5">
        <div className="min-w-max">
          <div className="flex gap-2 whitespace-pre">
            <span className="text-highlight">❯</span>
            <span>
              <span className="text-foreground">{command.slice(0, typedCount)}</span>
              {typing ? <Caret /> : null}
              <span className="invisible">{command.slice(typedCount)}</span>
            </span>
          </div>
          <ol className="mt-1">
            {lines.map((line, i) => (
              <li
                key={i}
                data-reveal=""
                className={cn(
                  "flex gap-4 whitespace-pre transition-[opacity,transform] duration-300 ease-expo-out",
                  i < shownCount ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                )}
              >
                <span className="w-12 shrink-0 text-right text-white/50 tabular-nums">{stamps[i]}</span>
                <span className={TONE[line.tone ?? "default"]}>{line.text}</span>
              </li>
            ))}
          </ol>
          <div className={cn("mt-1 flex gap-2", done ? "opacity-100" : "opacity-0")}>
            <span className="text-highlight">❯</span>
            {done ? <Caret blink={!reduced} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Caret({ blink = false }: { blink?: boolean }) {
  return (
    <span
      className={cn("ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-cyan/90", blink && styles.blink)}
    />
  );
}
