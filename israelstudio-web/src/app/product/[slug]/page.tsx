import { notFound } from "next/navigation";
import { ProductClient } from "./product-client";

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

async function getAll() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
  const r = await fetch(`${baseUrl}/api/catalog`, { cache: "no-store" });
  if (!r.ok) return { products: [] as Product[] };
  return r.json() as Promise<{ products: Product[] }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products } = await getAll();
  const p = products.find((x: Product) => x.slug === slug);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.title} — Israel's Studio`,
    description: p.blurb ?? "Artwork by Israel's Studio",
    openGraph: {
      title: `${p.title} — Israel's Studio`,
      description: p.blurb ?? "",
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { products } = await getAll();
  const p = products.find((x: Product) => x.slug === slug);
  if (!p) return notFound();
  // render a client wrapper to access cart
  return <ProductClient product={p} />;
}
