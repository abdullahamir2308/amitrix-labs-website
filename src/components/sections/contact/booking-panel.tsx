import { CalendarDays, Clock, Video } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CalEmbed } from "./cal-embed";

/** Static mock of a month grid, so the placeholder card reads as "booking goes here". */
function CalendarSketch() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const available = new Set([5, 6, 8, 12, 13, 15, 19, 20, 22, 26, 27]);
  return (
    <div aria-hidden="true" className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
        <span>[Month]</span>
        <span>‹ ›</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[0.6875rem] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="pb-1">
            {d}
          </span>
        ))}
        {days.map((d) => (
          <span
            key={d}
            className={
              d < 1 || d > 30
                ? "aspect-square"
                : available.has(d)
                  ? "flex aspect-square items-center justify-center rounded-md bg-indigo/12 text-foreground ring-1 ring-indigo/25"
                  : "flex aspect-square items-center justify-center rounded-md"
            }
          >
            {d >= 1 && d <= 30 ? d : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Booking column: Cal.com inline embed when a real link is configured; otherwise a styled
 * placeholder card (never a broken iframe).
 */
export function BookingPanel({ calLink, placeholder, email }: { calLink: string; placeholder: boolean; email: string }) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-line bg-card p-5 shadow-card sm:p-8">
      <div className="flex flex-col gap-3">
        <Eyebrow>Book a call</Eyebrow>
        <h2 className="text-heading-md text-foreground">Prefer to talk? Pick a time.</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Clock aria-hidden="true" className="size-4 text-highlight" />
            30 minutes
          </li>
          <li className="flex items-center gap-2">
            <Video aria-hidden="true" className="size-4 text-highlight" />
            Video call
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4 text-highlight" />
            No prep needed
          </li>
        </ul>
      </div>

      {placeholder ? (
        <div className="flex flex-col gap-5 rounded-2xl border border-dashed border-line-strong p-5">
          <CalendarSketch />
          <div className="flex flex-col gap-2">
            <p className="font-mono text-label text-highlight">[Placeholder] Booking calendar</p>
            <p className="text-body-sm text-muted-foreground">
              The Cal.com booking calendar appears here once <code className="font-mono text-[0.8125rem] text-foreground">NEXT_PUBLIC_CAL_LINK</code>{" "}
              is set. Until then, email us and we&apos;ll send a few times that work.
            </p>
          </div>
          <a
            href={`mailto:${email}?subject=${encodeURIComponent("Booking a call")}`}
            className="inline-flex h-10 w-fit items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
          >
            Email to book a call
          </a>
        </div>
      ) : (
        <CalEmbed calLink={calLink} />
      )}
    </div>
  );
}
