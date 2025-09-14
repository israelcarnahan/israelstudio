import { NextResponse } from "next/server";
import { prisma } from "../../../../../../src/lib/db";
import { auth } from "../../../../../../src/lib/auth";
import { upsertSquareItemSimple } from "../../../../../../israelstudio-web/src/lib/square";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const p = await prisma.product.findUnique({ where: { id: params.id } });
  if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { itemId, variationId } = await upsertSquareItemSimple({
    name: p.title,
    priceCents: p.priceCents,
    currency: p.currency,
    squareObjectId: p.squareObjectId,
  });

  const saved = await prisma.product.update({
    where: { id: p.id },
    data: { status: "PUBLISHED", squareObjectId: itemId, squareVariationId: variationId },
  });

  return NextResponse.json({ product: saved, itemId, variationId });
}
