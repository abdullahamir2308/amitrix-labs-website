/**
 * Server-side environment access for the contact form. Never import this from a Client
 * Component (only NEXT_PUBLIC_* variables reach the browser). See .env.example for each key.
 */
import { site } from "@/lib/site";

export type ContactEnv = {
  resendApiKey: string | undefined;
  to: string;
  from: string;
  isProduction: boolean;
};

export function getContactEnv(): ContactEnv {
  return {
    resendApiKey: process.env.RESEND_API_KEY?.trim() || undefined,
    to: process.env.CONTACT_TO_EMAIL?.trim() || site.contact.email,
    from: process.env.CONTACT_FROM_EMAIL?.trim() || `${site.name} <noreply@${site.domain}>`,
    isProduction: process.env.NODE_ENV === "production",
  };
}

/** Cal.com "username/event" link: NEXT_PUBLIC_CAL_LINK overrides site.contact.calLink. */
export function getCalLink(): string {
  return process.env.NEXT_PUBLIC_CAL_LINK?.trim() || site.contact.calLink;
}

/** True while the booking link is still the "[Placeholder]" value (show a placeholder card instead of the embed). */
export function isPlaceholderCalLink(link: string): boolean {
  return !link || link.startsWith("placeholder") || /[[\]]/.test(link) || !link.includes("/");
}
