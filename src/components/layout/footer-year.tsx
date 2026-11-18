import { cacheLife } from "next/cache";

/**
 * Current year for the © line. Cache Components forbids `new Date()` in the prerendered
 * shell, so the value is cached (and refreshed daily) instead of computed per request.
 */
export async function FooterYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
