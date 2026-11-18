import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { TeamMember } from "@/lib/content";

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-[0.6875rem] tracking-[0.12em] text-paper uppercase transition-colors hover:border-white/35 hover:bg-white/10"
    >
      {label}
      <ArrowUpRight className="size-3" aria-hidden="true" />
    </a>
  );
}

/**
 * Team grid. Photo + name always visible; role, bio and profile links slide up over the photo
 * on hover or keyboard focus (focus-within). Touch / no-hover devices show them permanently
 * below the name, so nothing is hover-only.
 */
export function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" itemClassName="flex">
      {team.map((member) => {
        const links = [
          member.linkedin && { href: member.linkedin, label: "LinkedIn" },
          member.x && { href: member.x, label: "X" },
          member.github && { href: member.github, label: "GitHub" },
        ].filter((l): l is { href: string; label: string } => Boolean(l));
        return (
          <article
            key={member.id}
            className="group/member relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-card"
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-surface sm:aspect-[4/5]">
              <Image
                src={member.avatar}
                alt={`Portrait of ${member.name}`}
                sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 100vw"
                className="size-full object-cover transition-transform duration-700 ease-expo-out group-hover/member:scale-[1.03] motion-reduce:transition-none"
              />
              {/* Hover / focus reveal (hover-capable devices only). */}
              <div className="absolute inset-x-0 bottom-0 hidden translate-y-3 flex-col gap-3 bg-gradient-to-t from-ink via-ink/85 to-transparent p-5 pt-16 text-paper opacity-0 transition-[opacity,transform] duration-500 ease-expo-out group-hover/member:translate-y-0 group-hover/member:opacity-100 group-focus-within/member:translate-y-0 group-focus-within/member:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-opacity [@media(hover:hover)]:flex">
                <p aria-hidden="true" className="font-mono text-label text-cyan">
                  {member.role}
                </p>
                {member.bio ? <p className="text-body-sm text-paper/80">{member.bio}</p> : null}
                {links.length ? (
                  <div className="flex flex-wrap gap-2">
                    {links.map((l) => (
                      <SocialLink key={l.label} {...l} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-line p-5">
              <h3 className="text-heading-sm text-foreground">{member.name}</h3>
              <p className="text-body-sm text-muted-foreground [@media(hover:hover)]:sr-only">{member.role}</p>
              {links.length ? (
                <div className="mt-2 flex flex-wrap gap-3 [@media(hover:hover)]:hidden">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-body-sm text-highlight underline-offset-4 hover:underline"
                    >
                      {l.label}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </Reveal>
  );
}
