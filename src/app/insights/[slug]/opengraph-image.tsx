import { renderOgImage } from "@/components/seo/og-image";
import { getPost, getPosts } from "@/lib/content";

export const alt = "Amitrix Labs insight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });
  return renderOgImage({
    eyebrow: post.tags[0] ? `Insights — ${post.tags[0]}` : "Insights",
    title: post.title,
  });
}
