"use client";
import { useCart } from "@/components/cart";
import { money } from "@/lib/format";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

// Debounced input handler for quantity changes
function useDebouncedCallback(callback: (value: number) => void, delay: number) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  return useCallback((value: number) => {
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => callback(value), delay);
    setTimeoutId(newTimeoutId);
  }, [callback, delay, timeoutId]);
}

// Quantity controls component with accessibility
function QuantityControls({ 
  lineId, 
  currentQty, 
  onIncrement, 
  onDecrement, 
  onSetQuantity,
  productName 
}: {
  lineId: string;
  currentQty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onSetQuantity: (qty: number) => void;
  productName: string;
}) {
  const [inputValue, setInputValue] = useState(currentQty.toString());
  const debouncedSetQuantity = useDebouncedCallback(onSetQuantity, 200);

  // Sync input value with cart state when currentQty changes
  useEffect(() => {
    setInputValue(currentQty.toString());
  }, [currentQty]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      debouncedSetQuantity(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < 1) {
      setInputValue("1");
      onSetQuantity(1);
    } else {
      onSetQuantity(numValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div 
      role="group" 
      aria-label={`Quantity for ${productName}`}
      className="flex items-center gap-2"
    >
      <button
        onClick={onDecrement}
        disabled={currentQty <= 1}
        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Decrease quantity of ${productName}`}
      >
        −
      </button>
      
      <input
        type="number"
        min="1"
        step="1"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyPress={handleKeyPress}
        className="w-16 text-center border border-neutral-300 rounded px-2 py-1"
        aria-label={`Quantity of ${productName}`}
      />
      
      <button
        onClick={onIncrement}
        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
        aria-label={`Increase quantity of ${productName}`}
      >
        +
      </button>
    </div>
  );
}

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
                key={l.id}
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
                      {money(l.amountCents)} each
                    </div>
                    {/* Live subtotal */}
                    <div className="text-sm font-medium text-neutral-800" aria-live="polite">
                      Subtotal: {money(l.amountCents * l.quantity)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Quantity Controls */}
                  <QuantityControls
                    lineId={l.id}
                    currentQty={l.quantity}
                    onIncrement={() => cart.increment(l.id)}
                    onDecrement={() => cart.decrement(l.id)}
                    onSetQuantity={(qty) => cart.setQuantity(l.id, qty)}
                    productName={l.name}
                  />
                  
                  {/* Remove Button */}
                  <button
                    className="btn btn-ghost text-red-600 hover:text-red-700"
                    onClick={() => cart.remove(l.slug)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Total</div>
            <div className="text-lg" aria-live="polite">{money(cart.totalCents)}</div>
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
