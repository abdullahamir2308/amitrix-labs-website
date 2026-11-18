"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { LatticeLockup } from "@/components/brand/logos";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { EASE, MEDIA, getLenis } from "@/lib/motion";
import { lockScroll } from "./route-store";
import { ServiceIcon } from "./service-icon";
import { BookingStatus } from "./booking-status";
import type { HeaderData, MegaMenu } from "./nav-types";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

/**
 * Full-screen mobile menu (<768px): ink sheet with large staggered links, expandable
 * Products / Services lists and the CTA pinned at the bottom. Modal dialog: scroll lock,
 * focus trap, Esc to close, focus returns to the menu button.
 */
export function MobileMenu({
  open,
  data,
  onClose,
  onNavigate,
}: {
  open: boolean;
  data: HeaderData;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const mounted = useMounted();
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open ? <MenuSheet key="sheet" data={data} onClose={onClose} onNavigate={onNavigate} /> : null}
    </AnimatePresence>,
    document.body,
  );
}

function MenuSheet({
  data,
  onClose,
  onNavigate,
}: {
  data: HeaderData;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<MegaMenu["id"] | null>(null);

  // Scroll lock + initial focus + close when the viewport grows past mobile.
  useEffect(() => {
    const unlock = lockScroll(getLenis());
    closeRef.current?.focus({ preventScroll: true });
    const mql = window.matchMedia(MEDIA.mobile);
    const onChange = () => {
      if (!mql.matches) onClose();
    };
    mql.addEventListener("change", onChange);
    return () => {
      unlock();
      mql.removeEventListener("change", onChange);
    };
  }, [onClose]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const item = (i: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.expoOut, delay: 0.08 + i * 0.04 } },
    exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
  });

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-mobile-menu=""
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)", transition: { duration: 0.28, ease: EASE.inOut } }}
      transition={{ duration: 0.45, ease: EASE.expoOut }}
      className="section-dark fixed inset-0 z-[55] flex flex-col overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(91 76 245 / 0.6), transparent 65%)" }}
      />

      <div className="flex h-(--header-h) shrink-0 items-center justify-between px-gutter">
        <Link href="/" aria-label="Amitrix Labs — home" onClick={onNavigate} className="-m-1 rounded-md p-1">
          <LatticeLockup aria-hidden="true" className="h-7 w-auto" />
        </Link>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-surface-raised/60 transition-colors hover:bg-muted"
        >
          <X aria-hidden="true" className="size-[1.125rem]" />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-gutter pt-6 pb-8" data-lenis-prevent>
        <ul className="flex flex-col">
          {data.links.map((link, i) => {
            const menu = link.menu;
            const isOpen = menu ? expanded === menu.id : false;
            return (
              <motion.li key={link.href} {...item(i)} className="border-b border-line">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="flex-1 py-3.5 text-[1.875rem] leading-tight font-medium tracking-[-0.03em]"
                  >
                    {link.label}
                  </Link>
                  {menu ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`mobile-${menu.id}`}
                      aria-label={`${isOpen ? "Hide" : "Show"} ${menu.label.toLowerCase()}`}
                      onClick={() => setExpanded(isOpen ? null : menu.id)}
                      className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-muted-foreground"
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={cn("size-4 transition-transform duration-300", isOpen && "rotate-180")}
                      />
                    </button>
                  ) : null}
                </div>
                {menu ? (
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.ul
                        id={`mobile-${menu.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE.expoOut }}
                        className="overflow-hidden"
                      >
                        {menu.items.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={onNavigate}
                              className="flex items-center gap-3 rounded-lg py-2.5 text-[0.9375rem] text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-surface-raised text-foreground">
                                {sub.image ? (
                                  <Image src={sub.image.src} width={32} height={32} unoptimized alt="" className="size-full" />
                                ) : (
                                  <ServiceIcon name={sub.icon} className="size-4" strokeWidth={1.6} />
                                )}
                              </span>
                              <span className="truncate">{sub.title}</span>
                            </Link>
                          </li>
                        ))}
                        <li className="pt-1 pb-4">
                          <Link
                            href={menu.href}
                            onClick={onNavigate}
                            className="inline-flex items-center gap-1 text-label text-highlight"
                          >
                            {menu.allLabel}
                            <ArrowUpRight aria-hidden="true" className="size-3.5" />
                          </Link>
                        </li>
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>
                ) : null}
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <motion.div
        {...item(data.links.length)}
        className="flex shrink-0 flex-col gap-4 border-t border-line px-gutter pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-between">
          <BookingStatus />
          <ThemeToggle />
        </div>
        <Button href={data.cta.href} variant="primary" size="lg" withArrow onClick={onNavigate} className="w-full">
          {data.cta.label}
        </Button>
      </motion.div>
    </motion.div>
  );
}
