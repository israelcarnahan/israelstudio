// 🧩 ProductCard
// Grid-card image uses object-fit: cover to fill a square.
// For a "fit inside" effect, switch to contain (may show letterboxing).
// "Add to Cart" uses useCart(); "View" links to product page.

// ⚙️ Dependencies: useCart hook, /lib/format (money), globals.css (btn styles)

// 📋 DEV GUIDE
// Purpose: Reusable product card for grid layouts and carousels
//
// Key Logic Areas:
//   🖼️ Image fit: object-cover for square fill (lines ~37-48)
//   🛒 Cart integration: Add to Cart with availability check (lines ~61-84)
//   🔗 Navigation: View button links to product page (lines ~85-87)
//   📱 Responsive: card-tilt hover effects from globals.css
//
// Key Rules:
//   ✅ Image fit: object-cover fills square, object-contain shows full image
//   ✅ Availability: isAvailable prop controls button state
//   ✅ Cart data: slug, name, amountCents, quantity, image, category
//   ❌ Do not hardcode image dimensions (use aspect-square)
//
// Related Files:
//   - globals.css: .card-tilt, .btn-sparkle, .btn-ghost-sparkle styling
//   - featured-carousel.client.tsx: uses this component in carousel
//   - /components/cart: useCart hook for cart state management

"use client";
import Link from "next/link";
import { money } from "@/lib/format";
import { useCart } from "@/components/cart";

type ProductCardProps = {
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  image?: string;
  category?: string;
  isAvailable?: boolean;
  status?: string;
};

export function ProductCard({
  slug,
  title,
  priceCents,
  currency,
  image,
  category,
  isAvailable = true,
  status,
}: ProductCardProps) {
  const cart = useCart();
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft card-tilt">
      <Link href={`/product/${slug}`} className="block">
        <div className="aspect-square bg-neutral-100">
          {image ? (
            // 🖼️ IMAGE FIT LOGIC
            // object-cover: fills square (crops to fit)
            // Alternative: object-contain (shows full image, may add padding)
            // If product thumbnails crop awkwardly, either:
            //   a) re-crop the source image, or
            //   b) change to object-fit: contain and accept padding.
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,#f3f3f3,transparent_60%)]" />
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-base font-medium">
          <Link href={`/product/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          {money(priceCents, currency)}
        </p>
        <div className="mt-3 flex gap-2">
          {/* 🛒 CART INTEGRATION
              Add to Cart: pink sparkle button with hover effects
              Sold Out: disabled ghost button with opacity */}
          {isAvailable ? (
            <button
              className="btn btn-sparkle flex-1"
              onClick={() =>
                cart.add({
                  slug,
                  name: title,
                  amountCents: priceCents,
                  quantity: 1,
                  image,
                  category,
                })
              }
            >
              Add to Cart
            </button>
          ) : (
            <button
              className="btn btn-ghost flex-1 opacity-50 cursor-not-allowed"
              disabled
            >
              Sold Out
            </button>
          )}
          {/* 🔗 NAVIGATION
              View button: ghost sparkle style, links to product page */}
          <Link className="btn btn-ghost-sparkle" href={`/product/${slug}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

// 🔗 CROSS-FILE LINKS
// - globals.css: .card-tilt, .btn-sparkle, .btn-ghost-sparkle styling
// - featured-carousel.client.tsx: uses this component in carousel
// - /components/cart: useCart hook for cart state management

// 📋 CURSOR AUDIT NOTES
// ✅ Verified cart integration: proper data structure (slug, name, amountCents, etc.)
// ✅ Image fit logic: object-cover for square fill, object-contain alternative
// ✅ Availability state: isAvailable prop controls button behavior
// ✅ Button styles: sparkle/ghost variants from globals.css
// ✅ Navigation: View button links to product page
// ✅ Hover effects: card-tilt from globals.css
//
// Future improvements: accessibility enhancements, loading states, error handling
