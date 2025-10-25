// 🧩 ProductCard
// Grid-card image uses object-fit: cover to fill a square.
// For a "fit inside" effect, switch to contain (may show letterboxing).
// "Add to Cart" uses useCart(); "View" links to product page.

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
          <Link className="btn btn-ghost-sparkle" href={`/product/${slug}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
