import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/content";
import { site } from "@/lib/site";
import { OpenRoleFromHash } from "./open-role-from-hash";

const TYPE_LABEL: Record<Job["type"], string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-mono text-label text-muted-foreground">{title}</h4>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="relative pl-5 text-body text-foreground/85 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2.5 before:bg-highlight">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Always looking for great people" — the whole section when there are no open roles. */
export function AlwaysLooking({ compact = false }: { compact?: boolean }) {
  const mail = `mailto:${site.contact.email}?subject=${encodeURIComponent("Open application")}`;
  return (
    <div
      data-testid="careers-always-looking"
      className={
        compact
          ? "flex flex-col gap-4 rounded-2xl border border-dashed border-line-strong p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          : "section-dark relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-line p-8 sm:p-12"
      }
    >
      {compact ? null : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-70 mask-fade-radial" />
      )}
      <div className="flex max-w-xl flex-col gap-2">
        <h3 className={compact ? "text-heading-sm text-foreground" : "text-heading-lg text-foreground"}>
          {compact ? "Don't see your role?" : "Always looking for great people."}
        </h3>
        <p className="text-body text-muted-foreground">{site.about.noOpenRoles}</p>
      </div>
      <Button render={<a href={mail} />} nativeButton={false} variant={compact ? "secondary" : "primary"} size="md" withArrow>
        Send us a note
      </Button>
    </div>
  );
}

/**
 * Open roles from content/jobs.json. Each role is a native <details> (works without JS, keyboard
 * accessible) with its own anchor id (/careers#<slug> opens it) and a mailto apply link.
 * Renders <AlwaysLooking /> instead when `jobs` is empty.
 */
export function OpenRoles({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return <AlwaysLooking />;

  return (
    <div className="flex flex-col gap-8">
      <OpenRoleFromHash />
      <ul className="flex flex-col border-t border-line">
        {jobs.map((job) => (
          <li key={job.slug} id={job.slug} className="scroll-mt-28 border-b border-line">
            <details data-role="" className="group/role">
              <summary className="flex cursor-pointer list-none flex-col gap-3 py-6 outline-offset-4 sm:flex-row sm:items-center sm:gap-8 [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="text-heading-sm text-foreground transition-colors group-hover/role:text-highlight">{job.title}</span>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-label text-muted-foreground">
                    <span>{job.department}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{TYPE_LABEL[job.type]}</span>
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center self-start rounded-full border border-line-strong text-muted-foreground transition-[transform,color,border-color] duration-500 ease-expo-out group-open/role:rotate-45 group-open/role:border-indigo group-open/role:text-highlight sm:self-center"
                >
                  <Plus className="size-4" />
                </span>
              </summary>
              <div className="grid gap-8 pb-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-12">
                <div className="flex flex-col gap-8">
                  <p className="text-body-lg text-foreground">{job.summary}</p>
                  <List title="What you'll do" items={job.responsibilities} />
                  <List title="What we're looking for" items={job.requirements} />
                  <List title="Nice to have" items={job.niceToHave} />
                </div>
                <div className="flex flex-col gap-4 self-start rounded-2xl border border-line bg-surface-raised p-6 md:sticky md:top-28">
                  <p className="text-body-sm text-muted-foreground">
                    Send a short note about something you&apos;ve built and why this role. CVs optional, links encouraged.
                  </p>
                  <Button
                    render={<a href={job.applyUrl} />}
                    nativeButton={false}
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    {site.ctaLabels.apply}
                    <ArrowUpRight aria-hidden="true" />
                  </Button>
                  <a
                    href={`#${job.slug}`}
                    className="text-center font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase hover:text-foreground"
                  >
                    Link to this role
                  </a>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
      <AlwaysLooking compact />
    </div>
  );
}
