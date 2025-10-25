// 🎨 SplashLink
// Wrapper around Next.js Link that triggers paint splash only for real route transitions
// Fires splash only for real navigations (no modifiers, not a drag, different pathname, not under [data-no-splash])

// ⚙️ Dependencies: Next.js navigation, PageSplashTransition trigger function

// 📋 DEV GUIDE
// Purpose: Smart Link wrapper that triggers splash only on actual route changes
// 
// Key Logic Areas:
//   🎯 Navigation detection: pathname comparison, modifier key checks (lines ~25-35)
//   🚫 Drag prevention: mouse movement threshold detection (lines ~36-42)
//   🛡️ Guard zones: respects [data-no-splash] containers (line ~33)
//   ⚡ Performance: prevents unnecessary splash triggers
//
// Key Rules:
//   ✅ Only triggers on left-click, no modifier keys
//   ✅ Ignores hash-only changes (same page)
//   ✅ Respects [data-no-splash] containers
//   ✅ Prevents drag-triggered splashes
//   ❌ Do not use for same-page actions (Add to Cart, etc.)
//
// Related Files:
//   - PageSplashTransition.tsx: triggerPageSplashFromEvent function
//   - Next.js navigation: usePathname, useRouter hooks
//   - Components: Replace Link with SplashLink for navigation

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { triggerPageSplashFromEvent } from "./PageSplashTransition";

type Props = React.ComponentProps<typeof Link>;

export default function SplashLink({ href, onClick, ...rest }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const down = React.useRef<{x:number;y:number}|null>(null);

  // 🔗 URL PARSING
  // Converts href to URL object for pathname comparison
  const toUrl = (h: Props["href"]) =>
    typeof h === "string" ? new URL(h, location.href) : new URL(h.toString(), location.href);

  return (
    <a
      {...rest}
      href={typeof href === "string" ? href : href.toString()}
      onMouseDown={(e) => { 
        // 📍 MOUSE DOWN TRACKING
        // Store initial position to detect drag vs click
        down.current = { x: e.clientX, y: e.clientY }; 
      }}
      onClick={(e) => {
        onClick?.(e);
        
        // 🚫 GUARD CONDITIONS
        // Prevent splash on: prevented events, non-left clicks, modifier keys
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        
        // 🛡️ NO-SPLASH ZONE CHECK
        // Respect [data-no-splash] containers (carousel viewport, etc.)
        if ((e.target as Element)?.closest("[data-no-splash]")) {
          return;
        }
        
        // 🖱️ DRAG DETECTION
        // Prevent splash if mouse moved > 8px between down/up (drag, not click)
        if (down.current) {
          const dx = Math.abs(e.clientX - down.current.x);
          const dy = Math.abs(e.clientY - down.current.y);
          if (dx > 8 || dy > 8) return;
        }
        
        // 🎯 PATHNAME COMPARISON
        // Only trigger splash if destination differs from current pathname OR has different query params
        const dest = toUrl(href);
        if (dest.pathname === pathname && dest.search === window.location.search) {
          return; // same page (hash/scroll)
        }
        
        // ✨ SPLASH TRIGGER
        // All conditions met: trigger splash and navigate
        e.preventDefault();
        triggerPageSplashFromEvent(e);
        router.push(dest.pathname + dest.search + dest.hash);
      }}
    />
  );
}

// 🔗 CROSS-FILE LINKS
// - PageSplashTransition.tsx: triggerPageSplashFromEvent function
// - Next.js navigation: usePathname, useRouter hooks
// - Components: Replace Link with SplashLink for navigation

// 📋 CURSOR AUDIT NOTES
// ✅ Verified pathname comparison: prevents same-page triggers
// ✅ Drag detection: 8px threshold prevents accidental triggers
// ✅ Modifier key handling: respects keyboard shortcuts
// ✅ Guard zone support: respects [data-no-splash] containers
// ✅ Performance: minimal overhead, only triggers on real navigation
// 
// Future improvements: touch gesture support, accessibility enhancements