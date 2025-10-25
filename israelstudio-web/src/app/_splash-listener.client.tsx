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
      
      console.log("🔍 Global splash listener triggered", { 
        target: el, 
        anchor: anchor.href,
        isCarousel: el.closest("[data-no-splash]") !== null
      });

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
          console.log("🚫 Global splash listener blocked by data-no-splash zone");
          return;
        }

        // 🎯 PATHNAME COMPARISON
        // Only trigger splash if destination differs from current pathname
        const currentPath = window.location.pathname;
        const destPath = new URL(anchor.href, window.location.href).pathname;
        if (destPath === currentPath) {
          console.log("🚫 Global splash listener blocked by same pathname", { current: currentPath, dest: destPath });
          return; // same page (hash/scroll)
        }

        // ✨ SPLASH TRIGGER
        console.log("✨ Global splash listener triggering splash", { href: anchor.href, pathname: destPath });
        triggerPageSplashFromEvent(e);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true } as any);
  }, []);

  return null;
}
