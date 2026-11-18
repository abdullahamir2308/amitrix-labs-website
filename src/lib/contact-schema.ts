/**
 * Contact form schema — shared by the client form (instant field errors) and the
 * /api/contact Route Handler (the source of truth). Keep it free of server-only imports.
 */
import { z } from "zod";
import { site } from "@/lib/site";

export const BUDGETS = site.contact.budgets;

/** Value used when the visitor doesn't pick a specific service. */
export const OTHER_SERVICE = "other";

/** Name of the honeypot input. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = "website";

export const contactSchema = z.object({
  name: z
    .string("Please enter your name.")
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "That name is a bit long (100 characters max)."),
  email: z
    .string("Please enter your email address.")
    .trim()
    .max(200, "That email is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  company: z.string().trim().max(120, "120 characters max.").optional().default(""),
  budget: z.enum(BUDGETS, "Please pick a budget range."),
  /** A service slug from content/services, or "other". Checked against the real list on the server. */
  service: z
    .string("Please pick what you need help with.")
    .trim()
    .min(1, { error: "Please pick what you need help with.", abort: true })
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Please pick what you need help with."),
  message: z
    .string("Please add a short message.")
    .trim()
    .min(20, "Tell us a little more (20 characters minimum).")
    .max(5000, "5,000 characters max — attach details on the call."),
  /** Honeypot — must be empty. Validated separately so bots get a silent success. */
  [HONEYPOT_FIELD]: z.string().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;
export type ContactField = Exclude<keyof ContactPayload, typeof HONEYPOT_FIELD>;
export type ContactFieldErrors = Partial<Record<ContactField, string[]>>;

/** Shape of every /api/contact response body. */
export type ContactResponse =
  | { ok: true; dev?: boolean; notice?: string }
  | { ok: false; error: string; fieldErrors?: ContactFieldErrors };

export function getFieldErrors(error: z.ZodError): ContactFieldErrors {
  return z.flattenError(error).fieldErrors as ContactFieldErrors;
}
