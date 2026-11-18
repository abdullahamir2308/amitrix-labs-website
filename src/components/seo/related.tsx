import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContentIcon } from "@/components/cards/content-icon";
import { PostCard } from "@/components/sections/insights/post-card";
import { toPostSummary } from "@/components/sections/insights/post-summary";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getPostAuthor, type Post, type Service } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Posts related to a service or case study (cross-links). Renders nothing when empty. */
export function RelatedPosts({
  posts,
  title = "Related reading",
  eyebrow = "Insights",
  index,
  className,
}: {
  posts: Post[];
  title?: string;
  eyebrow?: string;
  index?: string | number;
  className?: string;
}) {
  if (!posts.length) return null;
  const cols = posts.length >= 3 ? "lg:grid-cols-3" : "";
  return (
    <Section
      eyebrow={eyebrow}
      index={index}
      title={title}
      className={className}
      actions={
        <Button variant="secondary" size="md" withArrow href="/insights">
          All insights
        </Button>
      }
    >
      <ul className={cn("grid gap-5 sm:grid-cols-2", cols)}>
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={toPostSummary(post, getPostAuthor(post))} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Services a post is about (cross-links). Renders nothing when empty. */
export function RelatedServices({
  services,
  title = "Where this applies",
  eyebrow = "Services",
  className,
}: {
  services: Service[];
  title?: string;
  eyebrow?: string;
  className?: string;
}) {
  if (!services.length) return null;
  return (
    <Section
      eyebrow={eyebrow}
      title={title}
      className={className}
      actions={
        <Button variant="secondary" size="md" withArrow href="/services">
          All services
        </Button>
      }
    >
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.slug}>
            <Link
              href={service.url}
              className="group/svc flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-indigo/10 text-highlight">
                  <ContentIcon name={service.icon} className="size-5" />
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform duration-300 ease-expo-out group-hover/svc:translate-x-0.5 group-hover/svc:-translate-y-0.5 group-hover/svc:text-foreground"
                />
              </span>
              <span className="text-heading-sm text-foreground">{service.title}</span>
              <span className="line-clamp-3 text-body-sm text-muted-foreground">{service.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
