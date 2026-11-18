"use client";

import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { EASE } from "@/lib/motion";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Copy = { heading: string; body: string; placeholder: string; button: string };

/** Newsletter field — UI only for now: client-side validation and a "Thanks" state, no network. */
export function FooterNewsletter({ copy }: { copy: Copy }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const email = value.trim();
    if (!email) return setError("Enter your email address.");
    if (!EMAIL.test(email)) return setError("That email doesn't look right.");
    setError(null);
    setDone(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <p id={`${id}-h`} className="text-sm font-medium text-foreground">
        {copy.heading}
      </p>
      <p className="max-w-sm text-[0.8125rem] leading-relaxed text-muted-foreground">{copy.body}</p>
      <div className="relative min-h-[2.75rem]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.p
              key="thanks"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE.expoOut }}
              className="flex h-11 items-center gap-2.5 text-sm text-foreground"
            >
              <span className="grid size-6 place-items-center rounded-full bg-success/15 text-success">
                <Check aria-hidden="true" className="size-3.5" />
              </span>
              Thanks — you&apos;re on the list.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              noValidate
              aria-labelledby={`${id}-h`}
              onSubmit={onSubmit}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
              className="flex max-w-sm flex-col gap-1.5"
            >
              <label htmlFor={`${id}-email`} className="sr-only">
                Email address
              </label>
              <div className="flex h-11 items-center gap-1 rounded-xl border border-line-strong bg-surface p-1 pl-3.5 transition-[border-color,box-shadow] duration-200 focus-within:border-highlight focus-within:shadow-[0_0_0_3px_rgb(91_76_245/0.25)] has-aria-invalid:border-destructive">
                <input
                  id={`${id}-email`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={copy.placeholder}
                  value={value}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-err` : undefined}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (error) setError(null);
                  }}
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                />
                <button
                  type="submit"
                  className="group/sub inline-flex h-full shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[0.8125rem] font-medium text-background transition-colors duration-200 hover:bg-foreground/85"
                >
                  {copy.button}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-300 ease-expo-out group-hover/sub:translate-x-0.5"
                  />
                </button>
              </div>
              {error ? (
                <p id={`${id}-err`} className="text-[0.8125rem] text-destructive">
                  {error}
                </p>
              ) : null}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
