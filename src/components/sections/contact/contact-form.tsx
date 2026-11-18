"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type * as Schema from "@/lib/contact-schema";
import type { ContactField, ContactFieldErrors, ContactResponse } from "@/lib/contact-schema";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/site";
import { SuccessCheck } from "./success-check";

export type ServiceOption = { value: string; label: string };

/*
 * The zod schema (src/lib/contact-schema.ts) is loaded on demand: the header's "Book a call"
 * link prefetches /contact from every page, and zod would otherwise ride along (~35 KB gzip).
 * It starts loading when the visitor first focuses the form. The constants below mirror the
 * schema module and are typed against it, so any drift is a type error.
 */
const BUDGETS: typeof Schema.BUDGETS = site.contact.budgets;
const OTHER_SERVICE: typeof Schema.OTHER_SERVICE = "other";
const HONEYPOT_FIELD: typeof Schema.HONEYPOT_FIELD = "website";

let schemaModule: Promise<typeof Schema> | null = null;
const loadSchema = () => (schemaModule ??= import("@/lib/contact-schema"));

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; notice?: string }
  | { kind: "error"; message: string };

const control =
  "w-full rounded-lg border border-input bg-surface-raised px-3.5 text-body-sm text-foreground transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground hover:border-foreground/25 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15";

function Field({
  id,
  label,
  optional,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-body-sm font-medium text-foreground">
        {label}
        {optional ? <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">Optional</span> : null}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-caption text-destructive"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function readForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const value = (key: string) => {
    const v = data.get(key);
    return typeof v === "string" ? v : undefined;
  };
  return {
    name: value("name") ?? "",
    email: value("email") ?? "",
    company: value("company") ?? "",
    budget: value("budget"),
    service: value("service") ?? "",
    message: value("message") ?? "",
    [HONEYPOT_FIELD]: value(HONEYPOT_FIELD) ?? "",
  };
}

/**
 * Contact form. Validates with the shared zod schema (src/lib/contact-schema.ts) on submit and
 * re-validates touched fields as you type; the server validates again. POSTs JSON to
 * /api/contact. Success swaps the form for a drawn checkmark.
 */
export function ContactForm({ services, email }: { services: ServiceOption[]; email: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const validate = async () => {
    const form = formRef.current;
    if (!form) return null;
    const { contactSchema, getFieldErrors } = await loadSchema();
    const result = contactSchema.safeParse(readForm(form));
    const fieldErrors: ContactFieldErrors = result.success ? {} : getFieldErrors(result.error);
    setErrors(fieldErrors);
    return { ok: result.success, fieldErrors };
  };

  const onChange = () => {
    if (submitted) void validate();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const form = event.currentTarget;
    const result = await validate();
    if (!result?.ok) {
      const first = result ? Object.keys(result.fieldErrors)[0] : undefined;
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readForm(form)),
      });
      const body = (await res.json().catch(() => null)) as ContactResponse | null;
      if (res.ok && body?.ok) {
        setStatus({ kind: "success", notice: body.notice });
        form.reset();
        setSubmitted(false);
        return;
      }
      if (body && !body.ok && body.fieldErrors) setErrors(body.fieldErrors);
      setStatus({
        kind: "error",
        message: (body && !body.ok && body.error) || `Something went wrong. Please email us at ${email}.`,
      });
    } catch {
      setStatus({ kind: "error", message: `Network error. Please try again or email us at ${email}.` });
    }
  };

  const err = (field: ContactField) => errors[field]?.[0];
  const invalid = (field: ContactField) =>
    err(field) ? { "aria-invalid": true as const, "aria-describedby": `contact-${field}-error` } : {};

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status.kind === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE.expoOut }}
            className="flex min-h-[32rem] flex-col items-center justify-center gap-6 px-4 py-12 text-center"
          >
            <SuccessCheck className="size-20" />
            <div className="flex max-w-sm flex-col gap-3">
              <h3 className="text-heading-md text-foreground">Message sent.</h3>
              <p className="text-body text-muted-foreground">
                Thanks — a real person will read it and reply with honest next steps, usually within one business day.
              </p>
              {status.notice ? (
                <p className="mt-2 rounded-lg border border-dashed border-warning/40 bg-warning/5 px-3 py-2 font-mono text-[0.75rem] leading-relaxed text-warning">
                  {status.notice}
                </p>
              ) : null}
            </div>
            <Button type="button" variant="ghost" size="md" onClick={() => setStatus({ kind: "idle" })}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            onChange={onChange}
            onFocus={() => void loadSchema()}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE.expoOut }}
            className="flex flex-col gap-6"
            aria-describedby={status.kind === "error" ? "contact-form-error" : undefined}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="contact-name" label="Name" error={err("name")}>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={cn(control, "h-11")}
                  placeholder="Ada Lovelace"
                  {...invalid("name")}
                />
              </Field>
              <Field id="contact-email" label="Work email" error={err("email")}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  className={cn(control, "h-11")}
                  placeholder="you@company.com"
                  {...invalid("email")}
                />
              </Field>
              <Field id="contact-company" label="Company" optional error={err("company")}>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className={cn(control, "h-11")}
                  placeholder="Company or project"
                  {...invalid("company")}
                />
              </Field>
              <Field id="contact-service" label="What do you need?" error={err("service")}>
                <div className="relative">
                  <select
                    id="contact-service"
                    name="service"
                    required
                    defaultValue=""
                    className={cn(control, "h-11 appearance-none pr-10 invalid:text-muted-foreground")}
                    {...invalid("service")}
                  >
                    <option value="" disabled>
                      Pick a service
                    </option>
                    {services.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                    <option value={OTHER_SERVICE}>Something else</option>
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
            </div>

            <fieldset className="flex flex-col gap-3" aria-describedby={err("budget") ? "contact-budget-error" : undefined}>
              <legend className="mb-2 text-body-sm font-medium text-foreground">Budget range</legend>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b, i) => (
                  <label key={b} className="relative">
                    <input
                      type="radio"
                      name="budget"
                      value={b}
                      id={i === 0 ? "contact-budget" : undefined}
                      className="peer absolute inset-0 cursor-pointer opacity-0"
                    />
                    <span className="inline-flex h-9 items-center rounded-full border border-line-strong bg-surface-raised px-3.5 font-mono text-[0.75rem] tracking-[0.02em] text-muted-foreground transition-colors duration-200 peer-checked:border-indigo peer-checked:bg-indigo/10 peer-checked:text-foreground peer-hover:border-foreground/30 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
              <AnimatePresence initial={false}>
                {err("budget") ? (
                  <motion.p
                    id="contact-budget-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-caption text-destructive"
                  >
                    {err("budget")}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </fieldset>

            <Field id="contact-message" label="Tell us about the project" error={err("message")}>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                className={cn(control, "min-h-36 resize-y py-3 leading-relaxed")}
                placeholder="What are you building, where are you stuck, and what does success look like?"
                {...invalid("message")}
              />
            </Field>

            {/* Honeypot: hidden from people and assistive tech; bots fill it and get a fake success. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={`contact-${HONEYPOT_FIELD}`}>Leave this field empty</label>
              <input id={`contact-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <AnimatePresence initial={false}>
              {status.kind === "error" ? (
                <motion.p
                  id="contact-form-error"
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-body-sm text-destructive"
                >
                  {status.message}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-caption text-muted-foreground">
                We only use your details to reply. See our{" "}
                <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                  privacy policy
                </a>
                .
              </p>
              <Button type="submit" variant="primary" size="lg" disabled={status.kind === "submitting"} className="sm:min-w-44">
                {status.kind === "submitting" ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <Send aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
