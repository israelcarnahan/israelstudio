"use client";
import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/commissions", label: "Request a Commission" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* Replace with /logo.svg when ready */}
          <div className="h-8 w-8 rounded-xl bg-neutral-900" />
          <span className="font-display text-lg tracking-wide">Israel&apos;s Studio</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-neutral-800 hover:text-neutral-950">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="md:hidden btn btn-ghost px-3 py-2"
          onClick={() => setOpen(v => !v)}
        >
          Menu
        </button>
      </div>

      {/* Mobile sheet */}
      <div className={clsx(
        "md:hidden border-t border-neutral-200 bg-white transition-[height] overflow-hidden",
        open ? "h-auto" : "h-0"
      )}>
        <nav className="container py-3 flex flex-col gap-2">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-base py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
