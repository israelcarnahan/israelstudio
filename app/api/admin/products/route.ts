import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/db";
import { auth } from "../../../../src/lib/auth";
import { z } from "zod";
import { slugify, upsertAudit } from "../../../../src/lib/admin";

export async function GET() {
  const list = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json({ products: list });
}

const CreateSchema = z.object({
  title: z.string().min(2),
  priceCents: z.number().int().positive(),
  currency: z.string().default("USD"),
  description: z.string().optional(),
  category: z.string().default("paintings"),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional(), width: z.number().optional(), height: z.number().optional() })).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const json = await req.json();
  const data = CreateSchema.parse(json);

  const slug = await slugify(data.title);
  const created = await prisma.$transaction(async (tx) => {
    const p = await tx.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        priceCents: data.priceCents,
        currency: data.currency,
        category: data.category,
        status: "DRAFT",
        authorId: (session as any).uid ?? undefined,
      },
    });
    if (data.images?.length) {
      await tx.productImage.createMany({
        data: data.images.map((im, i) => ({
          productId: p.id,
          url: im.url,
          alt: im.alt ?? data.title,
          width: im.width ?? null,
          height: im.height ?? null,
          order: i,
        })),
      });
    }
    return p;
  });

  await upsertAudit((session as any).uid, "CREATE", "Product", created.id, { title: data.title });
  return NextResponse.json({ product: created });
}
