"use client";
import { money } from "@/lib/format";
import { Gallery } from "@/components/gallery";
import { useCart } from "@/components/cart";

type Product = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  image?: string;
  blurb?: string;
};

export function ProductClient({ product }: { product: Product }) {
  const cart = useCart();
  const images = [{ alt: product.title, src: undefined }];

  return (
    <section className="container py-10">
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <Gallery images={images} />
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{product.title}</h1>
          <p className="mt-2 text-lg">{money(product.priceCents, product.currency)}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="btn btn-primary"
              onClick={() => cart.add({
                slug: product.slug,
                name: product.title,
                amountCents: product.priceCents,
                quantity: 1,
              })}
            >
              Add to Cart
            </button>
            <a className="btn btn-ghost" href="/commissions">Request a Commission</a>
          </div>
        </div>
      </div>
    </section>
  );
}
