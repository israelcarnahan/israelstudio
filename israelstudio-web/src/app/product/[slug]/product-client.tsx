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
  images?: string[];
  category?: string;
  blurb?: string;
};

export function ProductClient({ product }: { product: Product }) {
  const cart = useCart();

  // Handle multiple images - use the images array if available, otherwise fall back to single image
  const imageUrls =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const images = imageUrls.map((url, index) => ({
    alt: `${product.title} - Image ${index + 1}`,
    src: url,
  }));

  // Debug: log the product data to see what we're getting
  console.log("Product data:", product);
  console.log("Image URLs:", imageUrls);

  return (
    <section className="container py-10">
      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <Gallery images={images} />
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{product.title}</h1>
          <p className="mt-2 text-lg">
            {money(product.priceCents, product.currency)}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="btn btn-primary"
              onClick={() =>
                cart.add({
                  slug: product.slug,
                  name: product.title,
                  amountCents: product.priceCents,
                  quantity: 1,
                  image: product.image,
                  category: product.category,
                })
              }
            >
              Add to Cart
            </button>
            <a className="btn btn-ghost" href="/commissions">
              Request a Commission
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
