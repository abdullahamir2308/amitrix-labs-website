"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu } from "lucide-react";
import { LatticeLockup, LatticeMark } from "@/components/brand/logos";
import { Magnetic } from "@/components/motion";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { MegaMenuContent } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { ROUTE_CHANGE_EVENT } from "./route-store";
import type { HeaderData, HeaderNavLink, MegaMenu } from "./nav-types";

type MenuId = MegaMenu["id"];
type Tone = "auto" | "light" | "dark";

const DARK_SELECTOR = '.section-dark, [data-theme-section="dark"]';
/** Scroll distance before the header may hide on scroll-down. */
const HIDE_AFTER = 160;

/**
 * Which palette sits under the header bar? Hit-tests the page just below the bar's
 * centre line (ignoring the header itself; pointer-events:none layers like the grain and
 * cursor are skipped by the browser) and checks for a forced-dark ancestor.
 */
function probeTone(header: HTMLElement): Exclude<Tone, "auto"> {
  const y = Math.min(header.offsetHeight / 2, 32);
  const stack = document.elementsFromPoint(window.innerWidth / 2, y);
  for (const el of stack) {
    if (header.contains(el) || el.closest("[data-mobile-menu]")) continue;
    return el.closest(DARK_SELECTOR) ? "dark" : "light";
  }
  return "light";
}

/**
 * Sticky site header. Transparent at the top, glass after scrolling, hides on scroll-down
 * and returns on scroll-up. Its palette follows what is underneath (light page vs dark
 * section) so it stays legible over the dark hero and on light pages.
 */
export function Header({ data }: { data: HeaderData }) {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const panelId = useId();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tone, setTone] = useState<Tone>("auto");
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [direction, setDirection] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pinnedRef = useRef(false);
  useEffect(() => {
    pinnedRef.current = openMenu !== null || mobileOpen;
  }, [openMenu, mobileOpen]);

  // ---------------------------------------------------------------------------
  // Scroll: glass state, hide/show, tone under the bar
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      setScrolled(y > 8);
      if (pinnedRef.current || header.contains(document.activeElement) || y < HIDE_AFTER) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }
      if (Math.abs(delta) > 6 || y < HIDE_AFTER) lastY = y;
      setTone(probeTone(header));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Route changes swap the content under the bar without a scroll event.
    const onRoute = () => {
      lastY = window.scrollY;
      setHidden(false);
      schedule();
    };

    // Streaming content / late sections change what sits under the bar: re-probe on resize.
    const main = document.getElementById("main");
    const ro = main ? new ResizeObserver(schedule) : null;
    if (main) ro?.observe(main);

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener(ROUTE_CHANGE_EVENT, onRoute);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(ROUTE_CHANGE_EVENT, onRoute);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Mega menu: hover intent, click, keyboard, outside click
  // ---------------------------------------------------------------------------
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);
  const focusFirstOnOpen = useRef(false);
  const menuIds = data.links.flatMap((l) => (l.menu ? [l.menu.id] : []));

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const show = useCallback(
    (id: MenuId) => {
      setOpenMenu((current) => {
        if (current && current !== id) {
          setDirection(menuIds.indexOf(id) > menuIds.indexOf(current) ? 1 : -1);
        }
        return id;
      });
    },
    // menuIds is derived from static props
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const close = useCallback((focusTrigger?: MenuId | null) => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setOpenMenu(null);
    if (focusTrigger) triggerRefs.current[focusTrigger]?.focus();
  }, []);

  const onTriggerEnter = (id: MenuId, pointerType: string) => {
    if (pointerType !== "mouse") return;
    clearTimers();
    const delay = openMenu ? 0 : 90;
    openTimer.current = window.setTimeout(() => {
      hoverOpenedAt.current = performance.now();
      show(id);
    }, delay);
  };

  const onRegionLeave = (pointerType: string) => {
    if (pointerType !== "mouse") return;
    window.clearTimeout(openTimer.current);
    if (!openMenu) return;
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 220);
  };

  const onRegionEnter = () => window.clearTimeout(closeTimer.current);

  const onTriggerClick = (id: MenuId) => {
    clearTimers();
    // A click right after hover-open should not immediately close the panel again.
    if (openMenu === id && performance.now() - hoverOpenedAt.current > 400) {
      setOpenMenu(null);
    } else {
      show(id);
    }
  };

  const onTriggerKeyDown = (id: MenuId, event: ReactKeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusFirstOnOpen.current = true;
      show(id);
      requestAnimationFrame(() => focusFirstLink());
    }
  };

  const focusFirstLink = () => {
    focusFirstOnOpen.current = false;
    document.getElementById(panelId)?.querySelector<HTMLElement>("a[href]")?.focus();
  };

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(openMenu);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu, close]);

  useEffect(() => () => clearTimers(), []);

  const onNavBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (openMenu && (!next || !navRef.current?.contains(next))) setOpenMenu(null);
  };

  const activeMenu = openMenu ? data.links.find((l) => l.menu?.id === openMenu)?.menu : undefined;
  const solid = scrolled || openMenu !== null;

  return (
    <>
      <header
        ref={headerRef}
        data-site-header=""
        data-header-tone={tone}
        data-scrolled={solid ? "" : undefined}
        data-hidden={hidden ? "" : undefined}
        style={{ viewTransitionName: "site-header" }}
        onFocus={() => setHidden(false)}
        className="group/header fixed inset-x-0 top-0 z-50 text-foreground transition-[translate,color] duration-500 ease-expo-out data-hidden:-translate-y-full motion-reduce:transition-none"
      >
        {/* Glass bar (fades in after scrolling or while a menu is open). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-b border-transparent opacity-0 transition-[opacity,border-color,background-color] duration-300 group-data-scrolled/header:border-line group-data-scrolled/header:opacity-100"
          style={{
            backgroundColor: "color-mix(in oklab, var(--background) 72%, transparent)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
          }}
        />

        <div className="relative mx-auto flex h-(--header-h) w-full max-w-wide items-center gap-4 px-gutter">
          <Link
            href="/"
            aria-label="Amitrix Labs — home"
            className="relative z-10 -m-1 flex shrink-0 items-center rounded-md p-1 text-foreground"
            onClick={() => close()}
          >
            <LatticeLockup aria-hidden="true" className="h-7 w-auto md:hidden lg:block" />
            <LatticeMark aria-hidden="true" className="hidden size-8 md:block lg:hidden" />
          </Link>

          {/* Desktop nav (≥768px) */}
          <div
            ref={navRef}
            className="hidden flex-1 justify-center md:flex"
            onPointerEnter={onRegionEnter}
            onPointerLeave={(e) => onRegionLeave(e.pointerType)}
            onBlur={onNavBlur}
          >
            <nav aria-label="Main">
              <Suspense
                fallback={
                  <NavList
                    links={data.links}
                    pathname={null}
                    openMenu={openMenu}
                    panelId={panelId}
                    triggerRefs={triggerRefs}
                    onTriggerEnter={onTriggerEnter}
                    onTriggerClick={onTriggerClick}
                    onTriggerKeyDown={onTriggerKeyDown}
                    onLinkEnter={() => onRegionLeave("mouse")}
                  />
                }
              >
                <NavListWithPath
                  links={data.links}
                  openMenu={openMenu}
                  panelId={panelId}
                  triggerRefs={triggerRefs}
                  onTriggerEnter={onTriggerEnter}
                  onTriggerClick={onTriggerClick}
                  onTriggerKeyDown={onTriggerKeyDown}
                  onLinkEnter={() => onRegionLeave("mouse")}
                />
              </Suspense>
            </nav>

            {/* Shared mega-menu panel: one surface that morphs between menus. */}
            <div className="pointer-events-none absolute inset-x-0 top-full flex justify-center px-gutter pt-2">
              <AnimatePresence>
                {activeMenu ? (
                  <MegaPanel
                    key="panel"
                    id={panelId}
                    menu={activeMenu}
                    direction={direction}
                    onNavigate={() => close()}
                    onPointerEnter={onRegionEnter}
                    onPointerLeave={(e) => onRegionLeave(e.pointerType)}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <ThemeToggle className="hidden md:inline-flex" />
            <Magnetic className="hidden md:inline-block" strength={0.3} max={10}>
              <Button href={data.cta.href} variant="primary" size="sm" className="h-9 px-3.5" onClick={() => close()}>
                {data.cta.label}
              </Button>
            </Magnetic>
            <button
              ref={mobileButtonRef}
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-surface-raised/60 text-foreground backdrop-blur transition-colors duration-200 hover:bg-muted md:hidden"
            >
              <Menu aria-hidden="true" className="size-[1.125rem]" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        data={data}
        onClose={() => {
          setMobileOpen(false);
          mobileButtonRef.current?.focus({ preventScroll: true });
        }}
        onNavigate={() => setMobileOpen(false)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Desktop nav list
// ---------------------------------------------------------------------------

type NavListProps = {
  links: HeaderNavLink[];
  openMenu: MenuId | null;
  panelId: string;
  triggerRefs: React.RefObject<Partial<Record<MenuId, HTMLButtonElement | null>>>;
  onTriggerEnter: (id: MenuId, pointerType: string) => void;
  onTriggerClick: (id: MenuId) => void;
  onTriggerKeyDown: (id: MenuId, event: ReactKeyboardEvent) => void;
  onLinkEnter: () => void;
};

/** Reads the pathname for the active state. Kept in its own Suspense boundary (Cache Components). */
function NavListWithPath(props: NavListProps) {
  const pathname = usePathname();
  return <NavList {...props} pathname={pathname} />;
}

const isActive = (pathname: string | null, href: string) =>
  !!pathname && (pathname === href || pathname.startsWith(`${href}/`));

const itemClass =
  "relative inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground aria-expanded:text-foreground data-active:text-foreground";

function NavList({
  links,
  pathname,
  openMenu,
  panelId,
  triggerRefs,
  onTriggerEnter,
  onTriggerClick,
  onTriggerKeyDown,
  onLinkEnter,
}: NavListProps & { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-0.5">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        const menu = link.menu;
        return (
          <li key={link.href} className="relative">
            {menu ? (
              <button
                ref={(node) => {
                  triggerRefs.current[menu.id] = node;
                }}
                type="button"
                aria-expanded={openMenu === menu.id}
                aria-controls={openMenu === menu.id ? panelId : undefined}
                data-active={active ? "" : undefined}
                onPointerEnter={(e) => onTriggerEnter(menu.id, e.pointerType)}
                onClick={() => onTriggerClick(menu.id)}
                onKeyDown={(e) => onTriggerKeyDown(menu.id, e)}
                className={itemClass}
              >
                {link.label}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-3.5 opacity-60 transition-transform duration-300 ease-expo-out",
                    openMenu === menu.id && "rotate-180",
                  )}
                />
                <ActiveDot active={active} />
              </button>
            ) : (
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                data-active={active ? "" : undefined}
                onPointerEnter={(e) => e.pointerType === "mouse" && onLinkEnter()}
                className={itemClass}
              >
                {link.label}
                <ActiveDot active={active} />
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ActiveDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-highlight transition-opacity duration-300",
        active ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Mega-menu panel
// ---------------------------------------------------------------------------

function MegaPanel({
  id,
  menu,
  direction,
  onNavigate,
  onPointerEnter,
  onPointerLeave,
}: {
  id: string;
  menu: MegaMenu;
  direction: number;
  onNavigate: () => void;
  onPointerEnter: () => void;
  onPointerLeave: (event: React.PointerEvent) => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const ro = new ResizeObserver(() => setHeight(inner.offsetHeight));
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      id={id}
      role="region"
      aria-label={menu.label}
      initial={{ opacity: 0, y: -8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.985, transition: { duration: 0.16, ease: EASE.inOut } }}
      transition={{ duration: 0.32, ease: EASE.expoOut }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="pointer-events-auto w-full max-w-[54rem] origin-top overflow-hidden rounded-2xl border border-line-strong bg-popover text-popover-foreground shadow-elevated"
      style={{ boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.06), var(--shadow-elevated)" }}
    >
      <motion.div
        animate={height === null ? undefined : { height }}
        transition={{ duration: 0.36, ease: EASE.expoOut }}
        className="relative overflow-hidden"
      >
        <div ref={innerRef}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={menu.id}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: 24 * d }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: -24 * d }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: EASE.expoOut }}
              className="w-full"
            >
              <MegaMenuContent menu={menu} onNavigate={onNavigate} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
