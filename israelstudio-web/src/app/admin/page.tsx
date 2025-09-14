import { prisma } from "@/lib/db";

export default async function AdminHome() {
  const count = await prisma.product.count();
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-2xl">Welcome back</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-neutral-600">Products</div>
          <div className="text-3xl font-semibold mt-1">{count}</div>
        </div>
      </div>
    </div>
  );
}
