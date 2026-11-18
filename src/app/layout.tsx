import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/layout/footer";
import { RouteProgress } from "@/components/layout/route-progress";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { site } from "@/lib/site";
import "./globals.css";

// Site-wide defaults. Pages build their own title/description/canonical/Open Graph with
// createMetadata() from @/lib/seo (a page-level openGraph replaces this one wholesale).
// The share image comes from src/app/opengraph-image.tsx unless a route has its own.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.defaultTitle,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  applicationName: site.name,
  keywords: [...site.seo.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
    title: site.seo.defaultTitle,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.defaultTitle,
    description: site.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Lets Next disable smooth scrolling while it scrolls to top on navigation.
      data-scroll-behavior="smooth"
      // next-themes sets the `dark` class before paint; the server HTML can't know it.
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Without JS, show text that motion primitives would otherwise reveal. */}
        <noscript>
          <style>{`[data-text-reveal],[data-reveal]{visibility:visible!important;opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>
          <SkipLink />
          <RouteProgress />
          <SiteHeader />
          {/* Pages must not render their own <main>. Content under the fixed header: see --header-h. */}
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
            {children}
          </main>
          <Footer />
          <CustomCursor />
        </Providers>
        <div aria-hidden="true" className="grain" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
