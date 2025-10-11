import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductsListClient } from "./products-list-client";

export default async function ProductsList() {
  // Get all products and sort them to match shop ordering
  const allProducts = await prisma.product.findMany({
    include: { images: { orderBy: { order: "asc" } } },
  });

  // Sort to match shop order: PUBLISHED products first (newest first), then others
  const products = allProducts.sort((a, b) => {
    // If both are PUBLISHED, sort by creation date (newest first)
    if (a.status === "PUBLISHED" && b.status === "PUBLISHED") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // If only one is PUBLISHED, it comes first
    if (a.status === "PUBLISHED" && b.status !== "PUBLISHED") return -1;
    if (a.status !== "PUBLISHED" && b.status === "PUBLISHED") return 1;
    // If neither is PUBLISHED, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <Link className="btn btn-primary" href="/admin/products/new">
          New Product
        </Link>
      </div>

      <ProductsListClient products={products} />
    </div>
  );
}
