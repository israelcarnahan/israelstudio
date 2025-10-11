"use client";
import { createContext, useContext, useMemo, useState } from "react";

export type CartLine = {
  slug: string;
  name: string;
  amountCents: number;
  quantity: number;
  image?: string;
  category?: string;
};

type CartCtx = {
  lines: CartLine[];
  add: (l: CartLine) => void;
  remove: (slug: string) => void;
  clear: () => void;
  totalCents: number;
  checkout: () => Promise<void>;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const totalCents = useMemo(
    () => lines.reduce((sum, l) => sum + l.amountCents * l.quantity, 0),
    [lines]
  );

  const add: CartCtx["add"] = (l) => {
    setLines((prev) => {
      const existing = prev.find((p) => p.slug === l.slug);
      if (existing) {
        return prev.map((p) =>
          p.slug === l.slug ? { ...p, quantity: p.quantity + l.quantity } : p
        );
      }
      return [...prev, l];
    });
  };

  const remove: CartCtx["remove"] = (slug) => {
    setLines((prev) => prev.filter((p) => p.slug !== slug));
  };

  const clear = () => setLines([]);

  const checkout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines }),
    });
    if (!res.ok) throw new Error("checkout_failed");
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <Ctx.Provider value={{ lines, add, remove, clear, totalCents, checkout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("CartProvider missing");
  return c;
}
