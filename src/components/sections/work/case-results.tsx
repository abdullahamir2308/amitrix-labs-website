import { Counter, Reveal } from "@/components/motion";
import { Section } from "@/components/ui/section";
import type { WorkResult } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Animate only plain numeric metrics ("40%", "3x", "2 min"); show others ("24/7", "AA") as-is. */
function Metric({ result }: { result: WorkResult }) {
  if (result.value === null || result.suffix.startsWith("/"))
    return <span>{result.metric}</span>;
  const spaced = result.suffix && result.metric.includes(` ${result.suffix}`);
  return (
    <Counter
      value={result.value}
      decimals={result.decimals}
      prefix={result.prefix}
      suffix={spaced ? ` ${result.suffix}` : result.suffix}
    />
  );
}

/** Results band: big mono numbers that count up, separated by hairlines. Forced dark. */
export function CaseResults({
  results,
  index,
}: {
  results: WorkResult[];
  index?: number;
}) {
  if (!results.length) return null;
  const cols = results.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <Section
      tone="dark"
      eyebrow="Results"
      index={index}
      title="The results"
      grid
    >
      <Reveal
        stagger={0.1}
        className={cn("grid border-t border-line", cols)}
        itemClassName="h-full border-b border-line md:border-r md:border-b-0 md:last:border-r-0 md:px-8 md:first:pl-0"
      >
        {results.map((r) => (
          <div
            key={r.label}
            className="flex h-full flex-col gap-4 py-10 md:py-12"
          >
            <p className="font-mono text-display-lg font-medium tracking-[-0.04em] text-foreground">
              <Metric result={r} />
            </p>
            <p className="max-w-xs text-body-sm text-muted-foreground">
              {r.label}
            </p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
