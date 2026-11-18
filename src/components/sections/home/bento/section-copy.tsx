import { TextReveal } from "@/components/motion";
import type { SectionCopy } from "@/lib/site";

/**
 * `site.sections.*.eyebrow` is written as display text ("// 01 — SERVICES"),
 * while <Eyebrow>/<Section> render the "//" and dash themselves. Split it
 * into the number and the label.
 */
export function parseEyebrow(raw: string): { index?: string; label: string } {
  const text = raw.replace(/^\s*\/\/\s*/, "").trim();
  const match = text.match(/^(\d+)\s*[—–-]\s*(.+)$/);
  return match ? { index: match[1], label: match[2] } : { label: text };
}

/**
 * Header props for <Section>: eyebrow label + number, a <TextReveal> heading
 * (rendered inside Section's own <h2>) and the optional intro line.
 */
export function sectionHeader(copy: SectionCopy) {
  const { index, label } = parseEyebrow(copy.eyebrow);
  return {
    eyebrow: label,
    index,
    title: (
      <TextReveal as="span" className="block">
        {copy.heading}
      </TextReveal>
    ),
    intro: copy.subheading,
  };
}
