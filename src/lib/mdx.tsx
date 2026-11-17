/**
 * Renders MDX compiled by Velite (`body` fields in content collections).
 *
 *   import { MDXContent } from "@/lib/mdx";
 *   <MDXContent code={post.body} components={{ h2: MyHeading }} />
 *
 * Headings already carry `id`s (rehype-slug) that match `post.toc[].url`. Code blocks are
 * highlighted at build time by rehype-pretty-code (theme "github-dark-default", no background:
 * style `pre` / `[data-rehype-pretty-code-figure]` yourself or pass a `pre` component).
 * Works in Server Components; no client JS is added unless a passed component needs it.
 */
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";
import * as runtime from "react/jsx-runtime";

type MDXModule = (props: { components?: MDXComponents }) => React.ReactNode;

const cache = new Map<string, MDXModule>();

function getMDXComponent(code: string): MDXModule {
  let Component = cache.get(code);
  if (!Component) {
    // Velite outputs a function body that receives the JSX runtime and returns the module.
    const fn = new Function(code);
    Component = fn({ ...runtime }).default as MDXModule;
    cache.set(code, Component);
  }
  return Component;
}

/** Internal links use next/link (client-side navigation + prefetch); external ones open safely. */
function MdxLink({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

/** Wide tables scroll horizontally instead of breaking the layout on mobile. */
function MdxTable(props: ComponentProps<"table">) {
  return (
    <div className="my-6 w-full overflow-x-auto">
      <table {...props} />
    </div>
  );
}

export const defaultMdxComponents: MDXComponents = {
  a: MdxLink,
  table: MdxTable,
};

export function MDXContent({ code, components }: { code: string; components?: MDXComponents }) {
  const render = getMDXComponent(code);
  // MDX's compiled component is a plain function without hooks, so calling it directly is safe
  // and avoids creating a component type during render.
  return render({ components: { ...defaultMdxComponents, ...components } });
}
