import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Allow everything except the API and the hidden review pages (which are also noindex + off the sitemap). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/brand", "/playground"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
