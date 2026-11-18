"use client";

import { useId, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { LayoutGroup, motion } from "motion/react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const OPTIONS: { value: "light" | "dark" | "system"; label: string; Icon: LucideIcon }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const noopSubscribe = () => () => {};

/**
 * Switch theme without every colour transition on the page firing at once. Done here, on the
 * user's click, instead of next-themes' `disableTransitionOnChange`: that option also runs on
 * hydration, injecting and removing a global <style> (two full-document style recalcs, ~250ms
 * of main-thread time on a mid-range phone) for a theme change that never happens.
 */
function withoutTransitions(apply: () => void) {
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  apply();
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
}

/** True after hydration; false on the server and during hydration. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Light / dark / system segmented control. The active pill renders only after
 * mount (the stored theme is unknown on the server), so there is no hydration
 * mismatch; the page itself never flashes because next-themes sets the class
 * before paint.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme: setNextTheme } = useTheme();
  const setTheme = (value: string) => withoutTransitions(() => setNextTheme(value));
  const mounted = useMounted();
  const active = mounted ? (theme ?? "system") : null;
  const groupId = useId();

  return (
    <LayoutGroup id={groupId}>
      <div
        role="radiogroup"
        aria-label="Colour theme"
        data-slot="theme-toggle"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full border border-line bg-surface-raised/70 p-0.5 backdrop-blur",
          className,
        )}
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const current = OPTIONS.findIndex((o) => o.value === (active ?? "system"));
          const step = event.key === "ArrowRight" ? 1 : -1;
          const next = OPTIONS[(current + step + OPTIONS.length) % OPTIONS.length];
          setTheme(next.value);
          const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
          buttons[OPTIONS.indexOf(next)]?.focus();
        }}
      >
        {OPTIONS.map(({ value, label, Icon }) => {
          const checked = active === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={label}
              title={label}
              tabIndex={checked || (active === null && value === "system") ? 0 : -1}
              onClick={() => setTheme(value)}
              className={cn(
                "relative inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                checked && "text-foreground",
              )}
            >
              {checked ? (
                <motion.span
                  layoutId="theme-toggle-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-background shadow-soft ring-1 ring-line"
                />
              ) : null}
              <Icon className="relative size-3.5" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
