import { renderOgImage } from "@/components/seo/og-image";
import { getProduct, getProducts } from "@/lib/content";

export const alt = "Amitrix Labs product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return new Response("Not found", { status: 404 });
  return renderOgImage({
    eyebrow: `Product — ${product.category}`,
    title: product.name,
    description: product.tagline,
  });
}
