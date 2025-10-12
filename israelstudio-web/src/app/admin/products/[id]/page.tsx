import { prisma } from "@/lib/db";
import Editor from "./ui";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!p) return <div>Not found</div>;
  return <Editor product={p} />;
}
