/**
 * POST /api/contact — contact form submissions.
 *
 * A Route Handler (rather than a Server Action) so the endpoint has explicit HTTP semantics
 * (400 / 429 / 503 status codes, Retry-After) and can be tested with curl. Flow:
 *   rate limit → parse JSON → honeypot (silent success) → zod validation (shared schema)
 *   → service check → send via Resend (React Email templates) → optional auto-reply.
 * Without RESEND_API_KEY: development logs the payload and succeeds; production answers 503.
 */
import { createElement } from "react";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { ContactAutoReply } from "@/emails/contact-auto-reply";
import { ContactNotification } from "@/emails/contact-notification";
import {
  HONEYPOT_FIELD,
  OTHER_SERVICE,
  contactSchema,
  getFieldErrors,
  type ContactResponse,
} from "@/lib/contact-schema";
import { getServices } from "@/lib/content";
import { getContactEnv } from "@/lib/env";
import { createRateLimiter, getClientKey } from "@/lib/rate-limit";
import { site } from "@/lib/site";

/** 5 submissions per IP per 10 minutes (per server instance — see src/lib/rate-limit.ts). */
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const MAX_BODY_BYTES = 20_000;

function json(body: ContactResponse, status = 200, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  const rate = limiter.check(getClientKey(request.headers));
  if (!rate.ok) {
    return json(
      { ok: false, error: `Too many messages in a short time. Please try again in ${Math.ceil(rate.retryAfter / 60)} min, or email ${site.contact.email}.` },
      429,
      { "Retry-After": String(rate.retryAfter) },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: "Message is too large." }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "Invalid request body (expected JSON)." }, 400);
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return json({ ok: false, error: "Invalid request body (expected a JSON object)." }, 400);
  }

  // Honeypot: bots fill every field. Pretend it worked so they don't adapt; send nothing.
  const trap = (raw as Record<string, unknown>)[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    return json({ ok: true });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors: getFieldErrors(parsed.error) },
      400,
    );
  }
  const data = parsed.data;

  const services = getServices();
  const service = services.find((s) => s.slug === data.service);
  if (!service && data.service !== OTHER_SERVICE) {
    return json(
      { ok: false, error: "Please check the highlighted fields.", fieldErrors: { service: ["Please pick what you need help with."] } },
      400,
    );
  }
  const serviceLabel = service?.title ?? "Something else";

  const env = getContactEnv();
  const submittedAt = new Date().toISOString();
  const subject = `New enquiry: ${data.name}${data.company ? ` (${data.company})` : ""} — ${serviceLabel}`;

  if (!env.resendApiKey) {
    if (env.isProduction) {
      console.error("[contact] RESEND_API_KEY is not set — submission not sent.");
      return json(
        { ok: false, error: `Our contact form is temporarily unavailable. Please email us at ${site.contact.email}.` },
        503,
      );
    }
    // Render the template anyway so template errors surface in development.
    const preview = await render(
      createElement(ContactNotification, {
        name: data.name,
        email: data.email,
        company: data.company || undefined,
        budget: data.budget,
        service: serviceLabel,
        message: data.message,
        submittedAt,
      }),
      { plainText: true },
    );
    console.info("[contact] RESEND_API_KEY missing — dev mode, not sending. Payload:", {
      to: env.to,
      from: env.from,
      subject,
      ...data,
    });
    console.info(`[contact] rendered notification (plain text):
${preview}`);
    return json({
      ok: true,
      dev: true,
      notice: "Development mode: RESEND_API_KEY is not set, so the message was logged on the server instead of emailed.",
    });
  }

  const notification = createElement(ContactNotification, {
    name: data.name,
    email: data.email,
    company: data.company || undefined,
    budget: data.budget,
    service: serviceLabel,
    message: data.message,
    submittedAt,
  });

  try {
    // Rendered here (not via Resend's `react` option) so the bundled @react-email/render is used.
    const [html, text] = await Promise.all([render(notification), render(notification, { plainText: true })]);
    const resend = new Resend(env.resendApiKey);
    const { error } = await resend.emails.send({
      from: env.from,
      to: env.to,
      replyTo: data.email,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[contact] Resend rejected the notification:", error);
      return json({ ok: false, error: `We couldn't send your message. Please email us at ${site.contact.email}.` }, 502);
    }

    // Auto-reply is a courtesy: failures are logged, never surfaced.
    try {
      const reply = createElement(ContactAutoReply, { name: data.name, service: serviceLabel });
      const [replyHtml, replyText] = await Promise.all([render(reply), render(reply, { plainText: true })]);
      const { error: replyError } = await resend.emails.send({
        from: env.from,
        to: data.email,
        replyTo: env.to,
        subject: `Thanks for reaching out to ${site.name}`,
        html: replyHtml,
        text: replyText,
      });
      if (replyError) console.warn("[contact] auto-reply failed:", replyError);
    } catch (replyErr) {
      console.warn("[contact] auto-reply failed:", replyErr);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return json({ ok: false, error: `We couldn't send your message. Please email us at ${site.contact.email}.` }, 502);
  }
}
