import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { site } from "@/lib/site";
import { PostMeta } from "./post-card";
import type { PostSummary } from "./post-summary";

/** Large editorial card for the featured post at the top of /insights. */
export function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <article className="group/featured relative grid overflow-hidden rounded-3xl border border-line bg-card shadow-card transition-[box-shadow,border-color] duration-500 ease-expo-out hover:border-line-strong hover:shadow-elevated lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface lg:aspect-auto lg:min-h-[26rem] lg:border-r lg:border-b-0">
        <Image
          src={post.cover}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-left transition-transform duration-700 ease-expo-out group-hover/featured:scale-[1.02] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-col gap-6 p-6 sm:p-10">
        <Badge variant="indigo" className="h-6 font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
          Featured
        </Badge>
        <PostMeta post={post} />
        <h2 className="text-heading-lg text-foreground">
          <Link
            href={post.url}
            className="outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-body-lg text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-2">
          {post.author ? (
            <span className="flex items-center gap-3">
              <Image src={post.author.avatar} alt="" width={36} height={36} className="size-9 rounded-full ring-1 ring-line" />
              <span className="flex flex-col">
                <span className="text-body-sm font-medium text-foreground">{post.author.name}</span>
                <span className="text-caption text-muted-foreground">{post.author.role}</span>
              </span>
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2 text-sm font-medium text-highlight">
            {site.ctaLabels.readArticle}
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-expo-out group-hover/featured:translate-x-1"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
