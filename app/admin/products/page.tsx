import Link from "next/link";
import { prisma } from "../../../src/lib/db";

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

      <div className="grid gap-3">
        {products.map(p => (
          <div key={p.id} className="rounded-2xl border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-neutral-600">{p.status} · {p.currency} {(p.priceCents/100).toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <Link className="btn btn-ghost" href={`/admin/products/${p.id}`}>Edit</Link>
              <form action={`/api/admin/products/${p.id}/publish`} method="post">
                <button className="btn btn-accent" type="submit">Publish → Square</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
