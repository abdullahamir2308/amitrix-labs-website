import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Container } from "@/components/ui/container";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Layout for /privacy and /terms: placeholder warning, "last updated" line, sticky contents
 * list and numbered sections at a readable measure.
 */
export function LegalDocument({ lastUpdated, sections }: { lastUpdated: string; sections: LegalSection[] }) {
  return (
    <section aria-label="Document" className="pt-10 pb-section md:pt-14">
      <Container>
        <div
          role="note"
          className="mb-12 flex gap-4 rounded-2xl border border-warning/35 bg-warning/[0.07] p-5 text-body-sm text-foreground sm:p-6"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning" />
          <div className="flex flex-col gap-1">
            <p className="font-mono text-label text-warning">[Placeholder] Not legal advice</p>
            <p className="text-muted-foreground">
              This is template text with a sensible structure. It must be reviewed and completed by a qualified lawyer for
              your jurisdiction before launch. Replace every “[Placeholder]” and “[bracketed]” value.
            </p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Sections" className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-4">
              <p className="font-mono text-label text-muted-foreground">Contents</p>
              <ol className="flex flex-col gap-2 border-l border-line">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px flex gap-2 border-l border-transparent py-0.5 pl-4 text-body-sm text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground"
                    >
                      <span className="font-mono text-[0.75rem] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="flex max-w-[68ch] flex-col">
            <p className="mb-10 font-mono text-label text-muted-foreground">
              Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time> <span className="text-warning">[Placeholder]</span>
            </p>
            {sections.map((s, i) => (
              <article key={s.id} id={s.id} className="scroll-mt-28 border-t border-line py-10 first-of-type:border-t-0 first-of-type:pt-0">
                <h2 className="mb-4 flex items-baseline gap-3 text-heading-md text-foreground">
                  <span className="font-mono text-label text-highlight tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="flex flex-col gap-4 text-body text-muted-foreground [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-[0.8em] [&_li]:before:left-0 [&_li]:before:h-px [&_li]:before:w-2.5 [&_li]:before:bg-highlight [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
                  {s.body}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
