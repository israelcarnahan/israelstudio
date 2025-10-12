"use client";
import Link from "next/link";
import SplashLink from "./SplashLink";
import { useState } from "react";
import { clsx } from "clsx";
import { Brand } from "@/components/brand";
import { useCart } from "@/components/cart";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/#commission", label: "Request a Commission" },
  { href: "/cart", label: "Cart" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const cart = useCart();

  // Calculate total items in cart
  const totalItems = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <header className="site">
      <div className="container h-16 flex items-center justify-between">
        <Brand />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <SplashLink
              key={l.href}
              href={l.href}
              className="text-sm text-neutral-800 hover:text-neutral-950 hover:underline underline-offset-4 relative flex items-center gap-2"
            >
              {l.label}
              {l.href === "/cart" && totalItems > 0 && (
                <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </SplashLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="md:hidden btn btn-ghost px-3 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={clsx(
          "md:hidden border-t border-neutral-200 bg-white transition-[height] overflow-hidden",
          open ? "h-auto" : "h-0"
        )}
      >
        <nav className="container py-3 flex flex-col gap-2">
          {links.map((l) => (
            <SplashLink
              key={l.href}
              href={l.href}
              className="text-base py-2 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
              {l.href === "/cart" && totalItems > 0 && (
                <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </SplashLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
