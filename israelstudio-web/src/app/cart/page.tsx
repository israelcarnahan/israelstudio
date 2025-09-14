"use client";
import { useCart } from "@/components/cart";
import { money } from "@/lib/format";

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
            {cart.lines.map(l => (
              <li key={l.slug} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-neutral-600">
                    {l.quantity} × {money(l.amountCents)}
                  </div>
                </div>
                <button className="btn btn-ghost" onClick={() => cart.remove(l.slug)}>Remove</button>
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
            <button className="btn btn-ghost" onClick={() => cart.clear()}>Clear</button>
          </div>
        </div>
      )}
    </section>
  );
}