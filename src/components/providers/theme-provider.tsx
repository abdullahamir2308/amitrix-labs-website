"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes injects a blocking <script> that sets the `dark` class on <html>
 * before first paint (no flash). On the client the script is marked
 * `text/plain` so React 19 never warns about rendering a script tag;
 * next-themes already sets suppressHydrationWarning on it.
 */
const scriptProps = {
  type: typeof window === "undefined" ? "text/javascript" : "text/plain",
} as const;

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // No disableTransitionOnChange: it also fires on hydration (global <style> inject + remove =
      // two full-page style recalcs). ThemeToggle disables transitions itself, on click only.
      scriptProps={scriptProps}
      {...props}
    />
  );
}
