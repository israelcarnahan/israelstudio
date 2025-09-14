import { prisma } from "../../../../src/lib/db";
import Editor from "./ui";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { order: "asc" } } } });
  if (!p) return <div>Not found</div>;
  return <Editor product={p} />;
}
