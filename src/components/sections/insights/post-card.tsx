import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PostSummary } from "./post-summary";

/** Mono meta line: "OCT 14, 2026 · AI AGENTS · 4 MIN READ". */
export function PostMeta({ post, className, showTag = true }: { post: PostSummary; className?: string; showTag?: boolean }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-label text-muted-foreground", className)}>
      <time dateTime={post.date}>{post.dateLabel}</time>
      {showTag && post.tags[0] ? (
        <>
          <span aria-hidden="true">·</span>
          <span className="text-highlight">{post.tags[0]}</span>
        </>
      ) : null}
      <span aria-hidden="true">·</span>
      <span>{post.readingTime} min read</span>
    </p>
  );
}

/** Blog card used on /insights and in "Related posts". Works in Server and Client Components. */
export function PostCard({ post, className, headingLevel = "h3" }: { post: PostSummary; className?: string; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "group/post relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-card transition-[box-shadow,border-color,transform] duration-500 ease-expo-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-elevated motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-surface">
        <Image
          src={post.cover}
          alt=""
          sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 100vw"
          className="size-full object-cover transition-transform duration-700 ease-expo-out group-hover/post:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <PostMeta post={post} />
        <Heading className="text-heading-sm text-foreground">
          <Link href={post.url} className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset">
            {post.title}
          </Link>
        </Heading>
        <p className="line-clamp-3 text-body-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-2">
          {post.author ? (
            <span className="flex min-w-0 items-center gap-2.5">
              <Image src={post.author.avatar} alt="" width={28} height={28} className="size-7 shrink-0 rounded-full ring-1 ring-line" />
              <span className="truncate text-body-sm text-foreground">{post.author.name}</span>
            </span>
          ) : (
            <span />
          )}
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-expo-out group-hover/post:translate-x-0.5 group-hover/post:-translate-y-0.5 group-hover/post:text-foreground"
          />
        </div>
      </div>
    </article>
  );
}
