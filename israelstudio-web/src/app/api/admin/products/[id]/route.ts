import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { slugify, upsertAudit } from "@/lib/admin";

const UpdateSchema = z.object({
  title: z.string().min(2).optional(),
  priceCents: z.number().int().positive().optional(),
  currency: z.string().optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional(), width: z.number().nullable().optional(), height: z.number().nullable().optional(), order: z.number().optional() })).optional(),
});

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await _.json();
  const data = UpdateSchema.parse(body);

  const updates: any = { ...data };
  if (data.title) updates.slug = await slugify(data.title);
  delete updates.images;

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.product.update({ where: { id }, data: updates });
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

  await upsertAudit((session as any).uid, "UPDATE", "Product", id, data);
  return NextResponse.json({ product: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.product.delete({ where: { id } });
  await upsertAudit((session as any).uid, "DELETE", "Product", id);
  return NextResponse.json({ ok: true });
}
