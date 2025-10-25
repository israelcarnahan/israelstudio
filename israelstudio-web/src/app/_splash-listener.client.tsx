"use client";
import { useEffect } from "react";
import { triggerPageSplashFromEvent } from "@/components/PageSplashTransition";

export default function SplashListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const anchor = el.closest<HTMLAnchorElement>("a[href^='/']");
      if (!anchor) return;

      // 🛡️ GUARD CONDITIONS (same as SplashLink)
      // Only normal left-click navigations
      if (
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // 🚫 NO-SPLASH ZONE CHECK
        // Respect [data-no-splash] containers (carousel viewport, etc.)
        if (el.closest("[data-no-splash]")) {
          return;
        }

        // 🎯 PATHNAME COMPARISON
        // Only trigger splash if destination differs from current pathname
        const currentPath = window.location.pathname;
        const destPath = new URL(anchor.href, window.location.href).pathname;
        if (destPath === currentPath) {
          return; // same page (hash/scroll)
        }

        // ✨ SPLASH TRIGGER
        triggerPageSplashFromEvent(e);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true } as any);
  }, []);

  return null;
}
