/**
 * Shared branded shell for transactional emails (React Email). Inline styles only — email
 * clients ignore stylesheets and most don't render SVG, so the logo is the PNG app icon.
 */
import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const brand = {
  paper: "#FAFAF9",
  ink: "#0A0A12",
  indigo: "#5B4CF5",
  cyan: "#22D3EE",
  slate: "#64748B",
  line: "#E5E7EB",
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

export const styles = {
  eyebrow: {
    fontFamily: brand.mono,
    fontSize: "11px",
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: brand.slate,
    margin: "0 0 8px",
  },
  heading: {
    fontSize: "24px",
    lineHeight: "1.25",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: brand.ink,
    margin: "0 0 16px",
  },
  text: { fontSize: "15px", lineHeight: "1.65", color: "#2B2D3A", margin: "0 0 16px" },
  muted: { fontSize: "13px", lineHeight: "1.6", color: brand.slate, margin: 0 },
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: brand.paper, fontFamily: brand.font, margin: 0, padding: "32px 12px" }}>
        <Container
          style={{
            maxWidth: "600px",
            backgroundColor: "#FFFFFF",
            border: `1px solid ${brand.line}`,
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <Section style={{ backgroundColor: brand.ink, padding: "20px 28px" }}>
            <Img
              src={`${site.url}/apple-icon.png`}
              width="28"
              height="28"
              alt=""
              style={{ display: "inline-block", verticalAlign: "middle", borderRadius: "6px" }}
            />
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginLeft: "10px",
                color: brand.paper,
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {site.name}
            </span>
          </Section>
          <Section style={{ height: "2px", backgroundColor: brand.indigo, lineHeight: "2px", fontSize: "2px" }}>
            &nbsp;
          </Section>
          <Section style={{ padding: "32px 28px 8px" }}>{children}</Section>
          <Section style={{ padding: "0 28px 28px" }}>
            <Hr style={{ borderColor: brand.line, margin: "8px 0 16px" }} />
            <Text style={styles.muted}>
              {site.name} · {site.positioning}
              <br />
              <Link href={site.url} style={{ color: brand.indigo, textDecoration: "none" }}>
                {site.domain}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
