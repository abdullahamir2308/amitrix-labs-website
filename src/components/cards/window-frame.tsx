import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type WindowFrameProps = {
  children: ReactNode;
  /** Mono label in the title bar, e.g. "agent-studio.app". */
  label?: string;
  className?: string;
  /** Hide the title bar (dots + label). */
  bare?: boolean;
};

/**
 * Product-UI frame: 1px hairline, 12px radius, inner top highlight and a title bar with three
 * dots. Always rendered on ink (forced dark), so it reads the same in both site themes.
 */
export function WindowFrame({
  children,
  label,
  className,
  bare = false,
}: WindowFrameProps) {
  return (
    <div
      className={cn(
        "section-dark relative overflow-hidden rounded-xl border border-white/10 bg-[#0d0d16] shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_30px_80px_-30px_rgb(0_0_0/0.6)]",
        className,
      )}
    >
      {bare ? null : (
        <div className="flex h-8 items-center gap-3 border-b border-white/8 px-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
          </span>
          {label ? (
            <span className="truncate font-mono text-[0.625rem] tracking-[0.12em] text-white/55 uppercase">
              {label}
            </span>
          ) : null}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
