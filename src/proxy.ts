/**
 * Real 404s for unknown content slugs.
 *
 * With Cache Components, `dynamicParams` is unavailable, and on the production server the PPR shell
 * streams before `notFound()` runs: /services/does-not-exist answered 200 with the not-found UI
 * (a "soft 404"). This proxy runs before routing, checks the slug against what exists in /content and
 * rewrites unknown ones to a path that matches no route, so Next serves its genuine 404 page.
 *
 * The allowlist is read straight from Velite's output (/.velite/*.json). Velite rebuilds it on every
 * `next dev` content change and `next build` runs it first, so the list never drifts from content.
 * Draft entries count as unknown in production (same rule as src/lib/content.ts).
 */
import { NextResponse, type NextRequest } from "next/server";
import posts from "../.velite/posts.json";
import products from "../.velite/products.json";
import services from "../.velite/services.json";
import work from "../.velite/work.json";

type Entry = { slug: string; draft: boolean };

const showDrafts = process.env.NODE_ENV !== "production";
const slugs = (items: readonly Entry[]) =>
  new Set(items.filter((item) => showDrafts || !item.draft).map((item) => item.slug));

const KNOWN: Record<string, Set<string>> = {
  products: slugs(products),
  services: slugs(services),
  work: slugs(work),
  insights: slugs(posts),
};

/** No route can match this path, so the rewrite resolves to the app's real 404 (app/not-found.tsx). */
const NOT_FOUND_PATH = "/__not-found__";

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  const known = KNOWN[section];
  if (!known || known.has(slug)) return;
  const url = request.nextUrl.clone();
  url.pathname = NOT_FOUND_PATH;
  return NextResponse.rewrite(url);
}

// Only `/<section>/<slug>`: the index pages, deeper paths (e.g. opengraph-image) and everything else are untouched.
export const config = {
  matcher: ["/products/:slug", "/services/:slug", "/work/:slug", "/insights/:slug"],
};
