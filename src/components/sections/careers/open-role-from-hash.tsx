"use client";

import { useEffect } from "react";

/** Opens the role <details> whose <li id> matches location.hash (on load and on hash change). */
export function OpenRoleFromHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const details = document.getElementById(id)?.querySelector<HTMLDetailsElement>("details[data-role]");
      if (details) details.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
