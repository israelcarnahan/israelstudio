import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionSafe } from "@/lib/sessionSafe";
import { upsertSquareItemSimple } from "@/lib/square";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionSafe();
    if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });

    // Check if Square credentials are configured
    if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID || !process.env.NEXT_PUBLIC_SQUARE_APP_ID) {
      return NextResponse.json({ 
        error: "square_not_configured", 
        message: "Square API credentials are not configured. Please set SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, and NEXT_PUBLIC_SQUARE_APP_ID in your environment variables."
      }, { status: 400 });
    }

    // Check if already published
    if (p.status === "PUBLISHED" && p.squareObjectId) {
      return NextResponse.json({ 
        error: "already_published", 
        message: "This product is already published to Square.",
        product: p
      }, { status: 400 });
    }

    console.log("Publishing product to Square:", { title: p.title, priceCents: p.priceCents, currency: p.currency });

    const { itemId, variationId } = await upsertSquareItemSimple({
      name: p.title,
      priceCents: p.priceCents,
      currency: p.currency,
      squareObjectId: p.squareObjectId,
    });

    console.log("Square API response:", { itemId, variationId });

    const saved = await prisma.product.update({
      where: { id },
      data: { status: "PUBLISHED", squareObjectId: itemId, squareVariationId: variationId },
    });

    return NextResponse.json({ product: saved, itemId, variationId });
  } catch (error: any) {
    console.error("Publish to Square error:", error);
    
    // Handle specific Square errors
    if (error?.message?.includes("Square 400")) {
      return NextResponse.json({ 
        error: "square_conflict", 
        message: "This product may already exist in Square. Please check your Square dashboard or try updating the product title.",
        details: error?.toString()
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: "publish_failed", 
      message: error?.message || "Failed to publish to Square",
      details: error?.toString()
    }, { status: 500 });
  }
}
