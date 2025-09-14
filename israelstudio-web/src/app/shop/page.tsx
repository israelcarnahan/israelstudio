import { ProductCard } from "@/components/product-card";
import { CategoryFilters } from "@/components/filters";

type Product = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  image?: string;
  blurb?: string;
  category?: string;
};

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const r = await fetch(`${baseUrl}/api/catalog`, { cache: "no-store" });
  if (!r.ok) return { products: [] as Product[] };
  return r.json() as Promise<{ products: Product[] }>;
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const params = await searchParams;
  const cat = params?.c || "paintings";
  const cats = [
    { slug: "paintings", name: "Paintings" },
    { slug: "rugs", name: "Rugs" }
  ];
  const { products } = await getProducts();
  
  // Filter products by category if specified
  const filteredProducts = cat === "all" ? products : products.filter(p => p.category === cat);

  return (
    <section className="container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Shop</h1>
          <p className="mt-2 text-neutral-600">Paintings today · Rugs soon · Commissions open</p>
        </div>
        <div className="hidden sm:block chip">Monochrome UI · Color Pop</div>
      </div>

      <div className="mt-6">
        <CategoryFilters cats={cats} />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-neutral-600">No products found in this category.</p>
            <p className="text-sm text-neutral-500 mt-2">
              {products.length === 0 
                ? "Square catalog is not configured. Please set up your Square credentials in .env.local"
                : "Try selecting a different category."
              }
            </p>
          </div>
        ) : (
          filteredProducts.map((p: Product) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              title={p.title}
              priceCents={p.priceCents}
              currency={p.currency}
              image={p.image}
            />
          ))
        )}
      </div>
    </section>
  );
}