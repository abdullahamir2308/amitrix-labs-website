import type { Graph, Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  data: WithContext<Thing> | Graph;
};

// Line / paragraph separators: valid in JSON, but they used to break JavaScript parsers.
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * Renders structured data as `<script type="application/ld+json">` (server component).
 * `<` is escaped to its unicode form so content can never close the script tag (XSS-safe).
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data)
    .replaceAll("<", "\\u003c")
    .replaceAll(LINE_SEPARATOR, "\\u2028")
    .replaceAll(PARAGRAPH_SEPARATOR, "\\u2029");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
