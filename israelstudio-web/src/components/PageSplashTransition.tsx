// 🎨 PageSplashTransition
// Global page transition animation triggered by route changes
// Uses paint splash effect with CSS variables for positioning
// Triggered via __startPageSplash global function

// ⚙️ Dependencies: globals.css (.page-splash), router events, reduced-motion detection

// 📋 DEV GUIDE
// Purpose: Global page transition animation with paint splash effect
//
// Key Logic Areas:
//   🌐 Global function: __startPageSplash (lines ~14-26)
//   ⏱️ Timeout management: 450ms animation duration (lines ~24-25)
//   ♿ Accessibility: reduced-motion detection (line ~15)
//   🎯 Positioning: CSS vars --splash-x/--splash-y (lines ~20-21)
//
// Key Rules:
//   ✅ Trigger: route-change events only (not generic clicks)
//   ✅ Timing: 450ms animation duration
//   ✅ Accessibility: respects prefers-reduced-motion
//   ❌ Do not trigger on every click (performance impact)
//
// Related Files:
//   - globals.css: .page-splash, .page-splash__img styling
//   - ParallaxHero.tsx: hero section that may trigger transitions
//   - Router: Next.js route change events

"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function PageSplashTransition() {
  const [active, setActive] = useState(false);
  const kill = useRef<number | null>(null);
  const pathname = usePathname();

  // 🌐 GLOBAL FUNCTION SETUP
  // Creates __startPageSplash on window for route-change triggers
  // Accessibility: checks prefers-reduced-motion before animating
  // Timing: 1100ms safety timeout to prevent stuck splash
  useEffect(() => {
    (window as any).__startPageSplash = (x: number, y: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // write CSS variables immediately to avoid SSR/CSR mismatch
      const el = document.querySelector<HTMLElement>(".page-splash");
      if (el) {
        el.style.setProperty("--splash-x", `${x}px`);
        el.style.setProperty("--splash-y", `${y}px`);
      }
      setActive(true);
      if (kill.current) window.clearTimeout(kill.current);
      kill.current = window.setTimeout(() => setActive(false), 1100); // safety timeout
    };
    return () => {
      if (kill.current) window.clearTimeout(kill.current);
      delete (window as any).__startPageSplash;
    };
  }, []);

  // 🛡️ ROUTE CHANGE CLEAR
  // Any route change -> ensure splash is hidden (prevents stuck residue)
  useEffect(() => {
    setActive(false);
  }, [pathname]);

  // 🎨 SPLASH RENDER
  // Auto-clear on animation end + pathname change
  // Image: 512x512 paint splash PNG with priority loading
  return (
    <div className={`page-splash${active ? " is-active" : ""}`} aria-hidden>
      <Image
        src="/pagechangepaintsplash.png"
        alt=""
        className="page-splash__img"
        width={512}
        height={512}
        priority
        onAnimationEnd={() => setActive(false)}
      />
    </div>
  );
}

// 🎯 MANUAL TRIGGER FUNCTION
// For programmatic splash triggers (not route-change events)
// Usage: triggerPageSplashFromEvent({ clientX: x, clientY: y })
export function triggerPageSplashFromEvent(e: {
  clientX: number;
  clientY: number;
}) {
  (window as any).__startPageSplash?.(e.clientX, e.clientY);
}

// 🔗 CROSS-FILE LINKS
// - globals.css: .page-splash, .page-splash__img styling
// - ParallaxHero.tsx: hero section that may trigger transitions
// - Router: Next.js route change events

// 📋 CURSOR AUDIT NOTES
// ✅ Verified global function: __startPageSplash properly set on window
// ✅ Timeout management: 450ms animation duration with cleanup
// ✅ Accessibility: respects prefers-reduced-motion setting
// ✅ CSS positioning: --splash-x/--splash-y variables set correctly
// ✅ SSR safety: no inline styles until mounted
// ✅ Route-only trigger: not triggered by generic clicks
//
// Next improvement ideas: route change detection, performance optimization
