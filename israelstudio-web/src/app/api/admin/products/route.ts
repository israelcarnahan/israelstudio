import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { slugify, upsertAudit } from "@/lib/admin";

const CreateSchema = z.object({
  title: z.string().min(2, "Title too short"),
  priceCents: z.number().int().positive("Price must be > 0"),
  currency: z.string().default("USD"),
  description: z.string().optional(),
  category: z.string().default("paintings"),
  images: z.array(z.object({
    url: z.string().url("Bad image URL"),
    alt: z.string().optional(),
    width: z.number().nullable().optional(),
    height: z.number().nullable().optional()
  })).optional(),
});

export async function GET() {
  const list = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json({ products: list });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const json = await req.json();
    const parsed = CreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "validation_error", issues: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

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
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "slug_conflict", detail: "A product with a similar title already exists." }, { status: 409 });
    }
    console.error("Create product error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}