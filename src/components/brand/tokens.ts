import type { CSSProperties } from "react";

/** Core brand colours ("Lab (default)" palette). Keep in sync with scripts/brand-assets.mjs. */
export const BRAND = {
  paper: "#FAFAF9",
  ink: "#0A0A12",
  indigo: "#5B4CF5",
  cyan: "#22D3EE",
  slate: "#64748B",
} as const;

type Swatch = { name: string; hex: string; role: string };

type Mode = {
  background: string;
  foreground: string;
  card: string;
  secondary: string;
  muted: string;
  line: string;
  primary: string;
  onPrimary: string;
  signal: string;
  ring: string;
};

export type Palette = {
  id: "lab" | "warm" | "electric";
  name: string;
  note: string;
  swatches: Swatch[];
  light: Mode;
  dark: Mode;
};

export const PALETTES: Palette[] = [
  {
    id: "lab",
    name: "Lab (default)",
    note: "Neutral paper and ink with an indigo primary and a cyan signal. Precise, technical, calm.",
    swatches: [
      { name: "Paper", hex: "#FAFAF9", role: "Light base" },
      { name: "Ink", hex: "#0A0A12", role: "Text / dark base" },
      { name: "Indigo", hex: "#5B4CF5", role: "Primary" },
      { name: "Cyan", hex: "#22D3EE", role: "Signal" },
      { name: "Slate", hex: "#64748B", role: "Muted" },
      { name: "Line", hex: "#E5E7EB", role: "Border (light)" },
      { name: "Line dark", hex: "#1F2030", role: "Border (dark)" },
    ],
    light: {
      background: "#FAFAF9",
      foreground: "#0A0A12",
      card: "#FFFFFF",
      secondary: "#F0F0EE",
      muted: "#64748B",
      line: "#E5E7EB",
      primary: "#5B4CF5",
      onPrimary: "#FFFFFF",
      signal: "#22D3EE",
      ring: "#5B4CF5",
    },
    dark: {
      background: "#0A0A12",
      foreground: "#FAFAF9",
      card: "#12121C",
      secondary: "#1A1A28",
      muted: "#94A3B8",
      line: "#1F2030",
      primary: "#5B4CF5",
      onPrimary: "#FFFFFF",
      signal: "#22D3EE",
      ring: "#8C7CFF",
    },
  },
  {
    id: "warm",
    name: "Warm",
    note: "Warmer paper and a brown-black ink, with a coral primary and an amber signal. Friendlier, more editorial.",
    swatches: [
      { name: "Paper", hex: "#FAF7F2", role: "Light base" },
      { name: "Ink", hex: "#1A1410", role: "Text / dark base" },
      { name: "Coral", hex: "#E4572E", role: "Primary" },
      { name: "Amber", hex: "#F59E0B", role: "Signal" },
      { name: "Stone", hex: "#736C67", role: "Muted" },
      { name: "Line", hex: "#EAE3D8", role: "Border (light)" },
      { name: "Line dark", hex: "#2D251F", role: "Border (dark)" },
    ],
    light: {
      background: "#FAF7F2",
      foreground: "#1A1410",
      card: "#FFFFFF",
      secondary: "#F1EBE2",
      muted: "#736C67",
      line: "#EAE3D8",
      primary: "#E4572E",
      // White on coral is 3.7:1; ink on coral is 4.95:1 (AA).
      onPrimary: "#1A1410",
      signal: "#F59E0B",
      ring: "#E4572E",
    },
    dark: {
      background: "#1A1410",
      foreground: "#FAF7F2",
      card: "#231B16",
      secondary: "#2D251F",
      muted: "#A8A29E",
      line: "#2D251F",
      primary: "#E4572E",
      onPrimary: "#1A1410",
      signal: "#F59E0B",
      ring: "#F59E0B",
    },
  },
  {
    id: "electric",
    name: "Electric",
    note: "Lab's paper, ink and indigo, but the signal colour becomes electric green. Louder and more product-y on dark.",
    swatches: [
      { name: "Paper", hex: "#FAFAF9", role: "Light base" },
      { name: "Ink", hex: "#0A0A12", role: "Text / dark base" },
      { name: "Indigo", hex: "#5B4CF5", role: "Primary" },
      { name: "Volt", hex: "#2EF28A", role: "Signal" },
      { name: "Slate", hex: "#64748B", role: "Muted" },
      { name: "Line", hex: "#E5E7EB", role: "Border (light)" },
      { name: "Line dark", hex: "#1F2030", role: "Border (dark)" },
    ],
    light: {
      background: "#FAFAF9",
      foreground: "#0A0A12",
      card: "#FFFFFF",
      secondary: "#F0F0EE",
      muted: "#64748B",
      line: "#E5E7EB",
      primary: "#5B4CF5",
      onPrimary: "#FFFFFF",
      signal: "#2EF28A",
      ring: "#5B4CF5",
    },
    dark: {
      background: "#0A0A12",
      foreground: "#FAFAF9",
      card: "#12121C",
      secondary: "#1A1A28",
      muted: "#94A3B8",
      line: "#1F2030",
      primary: "#5B4CF5",
      onPrimary: "#FFFFFF",
      signal: "#2EF28A",
      ring: "#2EF28A",
    },
  },
];

/**
 * Scoped CSS variables for a palette block. Overrides the shadcn/ui tokens locally, so
 * stock components (Button, Card) render in that palette without any extra props.
 */
export function paletteVars(mode: Mode): CSSProperties {
  return {
    "--background": mode.background,
    "--foreground": mode.foreground,
    "--card": mode.card,
    "--card-foreground": mode.foreground,
    "--primary": mode.primary,
    "--primary-foreground": mode.onPrimary,
    "--secondary": mode.secondary,
    "--secondary-foreground": mode.foreground,
    "--muted": mode.secondary,
    "--muted-foreground": mode.muted,
    "--accent": mode.secondary,
    "--accent-foreground": mode.foreground,
    "--border": mode.line,
    "--input": mode.line,
    "--ring": mode.ring,
    "--signal": mode.signal,
  } as CSSProperties;
}
