import Link from "next/link";
import { money } from "@/lib/format";

type ProductCardProps = {
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  image?: string;
};

export function ProductCard({ slug, title, priceCents, currency, image }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft">
      <Link href={`/product/${slug}`} className="block">
        <div className="aspect-square bg-neutral-100">
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,#f3f3f3,transparent_60%)]" />
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-base font-medium">
          <Link href={`/product/${slug}`} className="hover:underline">{title}</Link>
        </h3>
        <p className="mt-1 text-sm text-neutral-600">{money(priceCents, currency)}</p>
        <div className="mt-3">
          <Link className="btn btn-ghost" href={`/product/${slug}`}>View</Link>
        </div>
      </div>
    </article>
  );
}
