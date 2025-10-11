"use client";
import { useCart } from "@/components/cart";
import { money } from "@/lib/format";
import Image from "next/image";

export default function CartPage() {
  const cart = useCart();
  return (
    <section className="container py-12">
      <h1 className="font-display text-3xl sm:text-4xl">Cart</h1>
      {cart.lines.length === 0 ? (
        <p className="mt-3 text-neutral-600">Your cart is empty.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
            {cart.lines.map((l) => (
              <li
                key={l.slug}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Preview Image */}
                  {l.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={l.image}
                        alt={l.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <div>
                    <div className="font-medium">{l.name}</div>
                    {l.category && (
                      <div className="text-sm text-neutral-500 capitalize">
                        {l.category}
                      </div>
                    )}
                    <div className="text-sm text-neutral-600">
                      {l.quantity} × {money(l.amountCents)}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => cart.remove(l.slug)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Total</div>
            <div className="text-lg">{money(cart.totalCents)}</div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={() => cart.checkout()}>
              Checkout with Square
            </button>
            <button className="btn btn-ghost" onClick={() => cart.clear()}>
              Clear
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
