import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductsListClient } from "./products-list-client";

export default async function ProductsList() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products</h1>
        <Link className="btn btn-primary" href="/admin/products/new">New Product</Link>
      </div>

      <ProductsListClient products={products} />
    </div>
  );
}
