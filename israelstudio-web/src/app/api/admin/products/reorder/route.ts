import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const ReorderSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { products } = ReorderSchema.parse(body);

    // Update the createdAt timestamp to reflect the new order
    // Newer timestamps = higher in list (admin sorts by createdAt desc)
    const now = Date.now();
    await prisma.$transaction(
      products.map(({ id, order }, index) =>
        prisma.product.update({
          where: { id },
          data: {
            createdAt: new Date(now - index * 1000), // Higher index = older timestamp = lower in list
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder products" },
      { status: 500 }
    );
  }
}
