"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PageSplashTransition() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const varsRef = useRef({ x: 0, y: 0 });
  const kill = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    (window as any).__startPageSplash = (x: number, y: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      varsRef.current = { x, y };
      // write CSS variables only after mount to avoid SSR/CSR mismatch
      const el = document.querySelector<HTMLElement>(".page-splash");
      if (el) {
        el.style.setProperty("--splash-x", `${x}px`);
        el.style.setProperty("--splash-y", `${y}px`);
      }
      setActive(true);
      if (kill.current) window.clearTimeout(kill.current);
      kill.current = window.setTimeout(() => setActive(false), 450);
    };
    return () => {
      if (kill.current) window.clearTimeout(kill.current);
      delete (window as any).__startPageSplash;
    };
  }, []);

  // No inline style until mounted => avoids hydration diff
  return (
    <div className={`page-splash${active ? " is-active" : ""}`} aria-hidden>
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

export function triggerPageSplashFromEvent(e: {
  clientX: number;
  clientY: number;
}) {
  (window as any).__startPageSplash?.(e.clientX, e.clientY);
}
