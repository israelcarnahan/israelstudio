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

      // Only normal left-click navigations
      if (
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        triggerPageSplashFromEvent(e);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true } as any);
  }, []);

  return null;
}
