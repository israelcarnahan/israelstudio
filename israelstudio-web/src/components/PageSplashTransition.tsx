"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Global paint-splash overlay. Lives once in root layout.
 * Call window.__startPageSplash(x, y) to trigger.
 */
export default function PageSplashTransition() {
  const [active, setActive] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const killTimer = useRef<number | null>(null);

  useEffect(() => {
    // Expose a global trigger for our custom Link wrapper and generic anchors
    (window as any).__startPageSplash = (x: number, y: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setCoords({ x, y });
      setActive(true);
      if (killTimer.current) window.clearTimeout(killTimer.current);
      // Let the animation run ~420ms; it will persist across the route swap
      killTimer.current = window.setTimeout(() => setActive(false), 450);
    };

    return () => {
      if (killTimer.current) window.clearTimeout(killTimer.current);
      delete (window as any).__startPageSplash;
    };
  }, []);

  // CSS variables drive position
  const style: React.CSSProperties = {
    // Fail-safe defaults centered if no coords yet
    // (still overridden whenever triggered)
    ["--splash-x" as any]: `${coords.x || (typeof window !== "undefined" ? window.innerWidth / 2 : 0)}px`,
    ["--splash-y" as any]: `${coords.y || (typeof window !== "undefined" ? window.innerHeight / 2 : 0)}px`,
  };

  return (
    <div
      className={`page-splash ${active ? "is-active" : ""}`}
      style={style}
      aria-hidden
    >
      {/* The growing image */}
      <Image
        src="/pagechangepaintsplash.png"
        alt=""
        className="page-splash__img"
        width={512}
        height={512}
        priority
      />
    </div>
  );
}

/**
 * Helper to trigger from events (onClick etc)
 */
export function triggerPageSplashFromEvent(e: {
  clientX: number;
  clientY: number;
}) {
  const fn = (window as any).__startPageSplash as
    | undefined
    | ((x: number, y: number) => void);
  if (fn) fn(e.clientX, e.clientY);
}
