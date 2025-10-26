"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { clampQty } from "@/lib/stockPolicy";
import { loadCart, saveCart } from "@/lib/storage";

export type CartLine = {
  id: string; // Unique identifier for cart line
  slug: string;
  name: string;
  amountCents: number;
  quantity: number;
  image?: string;
  category?: string;
};

type CartLineInput = Omit<CartLine, 'id'>;

type CartCtx = {
  lines: CartLine[];
  add: (l: CartLineInput) => void;
  remove: (slug: string) => void;
  clear: () => void;
  setQuantity: (lineId: string, quantity: number) => Promise<void>;
  increment: (lineId: string) => Promise<void>;
  decrement: (lineId: string) => Promise<void>;
  totalCents: number;
  checkout: () => Promise<void>;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCart();
    if (savedCart.length > 0) {
      setLines(savedCart);
    }
  }, []);

  // Persist cart to localStorage whenever lines change
  useEffect(() => {
    if (lines.length > 0) {
      saveCart(lines);
    }
  }, [lines]);

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
      // Generate unique ID for new cart line
      const newLine = { ...l, id: `${l.slug}-${Date.now()}-${Math.random()}` };
      return [...prev, newLine];
    });
  };

  const remove: CartCtx["remove"] = (slug) => {
    setLines((prev) => prev.filter((p) => p.slug !== slug));
  };

  const clear = () => setLines([]);

  const setQuantity: CartCtx["setQuantity"] = async (lineId, quantity) => {
    const line = lines.find(l => l.id === lineId);
    if (!line) return;

    const clampedQty = await clampQty(line.slug, quantity);
    
    setLines((prev) =>
      prev.map((l) =>
        l.id === lineId ? { ...l, quantity: clampedQty } : l
      )
    );
  };

  const increment: CartCtx["increment"] = async (lineId) => {
    const line = lines.find(l => l.id === lineId);
    if (!line) return;
    await setQuantity(lineId, line.quantity + 1);
  };

  const decrement: CartCtx["decrement"] = async (lineId) => {
    const line = lines.find(l => l.id === lineId);
    if (!line) return;
    await setQuantity(lineId, line.quantity - 1);
  };

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
    <Ctx.Provider value={{ lines, add, remove, clear, setQuantity, increment, decrement, totalCents, checkout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("CartProvider missing");
  return c;
}
