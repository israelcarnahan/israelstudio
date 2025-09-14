import { NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/db";
import { auth } from "../../../../../src/lib/auth";
import { z } from "zod";
import { slugify, upsertAudit } from "../../../../../src/lib/admin";

const UpdateSchema = z.object({
  title: z.string().min(2).optional(),
  priceCents: z.number().int().positive().optional(),
  currency: z.string().optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional(), width: z.number().optional(), height: z.number().optional(), order: z.number().optional() })).optional(),
});

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await _.json();
  const data = UpdateSchema.parse(body);

  const updates: any = { ...data };
  if (data.title) updates.slug = await slugify(data.title);
  delete updates.images;

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.product.update({ where: { id: params.id }, data: updates });
    if (data.images) {
      await tx.productImage.deleteMany({ where: { productId: p.id } });
      await tx.productImage.createMany({
        data: data.images.map((im, i) => ({
          productId: p.id, url: im.url, alt: im.alt ?? p.title, width: im.width ?? null, height: im.height ?? null, order: im.order ?? i,
        })),
      });
    }
    return p;
  });

  await upsertAudit((session as any).uid, "UPDATE", "Product", params.id, data);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.product.delete({ where: { id: params.id } });
  await upsertAudit((session as any).uid, "DELETE", "Product", params.id);
  return NextResponse.json({ ok: true });
}
