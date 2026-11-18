import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import { CustomCursor } from "@/components/motion";
import { Footer } from "@/components/layout/footer";
import { RouteProgress } from "@/components/layout/route-progress";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://amitrixlabs.com"),
  title: {
    default: "Amitrix Labs",
    template: "%s — Amitrix Labs",
  },
  description: "We build software and AI that actually ships.",
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
      </body>
    </html>
  );
}
