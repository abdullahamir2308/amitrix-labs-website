import { renderOgImage } from "@/components/seo/og-image";
import { getWork, getWorkItem } from "@/lib/content";

export const alt = "Amitrix Labs case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getWork().map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return new Response("Not found", { status: 404 });
  return renderOgImage({
    eyebrow: `Case study — ${item.industry}`,
    title: item.title,
  });
}
