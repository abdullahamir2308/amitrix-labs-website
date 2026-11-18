import { renderOgImage } from "@/components/seo/og-image";
import { getService, getServices } from "@/lib/content";

export const alt = "Amitrix Labs service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return new Response("Not found", { status: 404 });
  return renderOgImage({
    eyebrow: "Service",
    title: service.title,
    description: service.summary,
  });
}
