import { MDXContent } from "@/lib/mdx";
import { cn } from "@/lib/cn";
import styles from "./prose.module.css";

/** Renders a Velite MDX body with the site's long-form styles. Server component. */
export function Prose({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <div className={cn(styles.prose, className)}>
      <MDXContent code={code} />
    </div>
  );
}
