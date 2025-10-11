import { NextResponse } from "next/server";
import { searchCatalogPaintings, normalizeSquareItem } from "@/lib/square";
import { prisma } from "@/lib/db";

// Demo data as fallback when Square is not configured
const demoProducts = [
  {
    id: "pnt-001",
    slug: "sunlit-portrait",
    title: "Sunlit Portrait",
    priceCents: 120000,
    currency: "USD",
    category: "paintings",
    image: undefined,
  },
  {
    id: "pnt-002",
    slug: "electric-dream",
    title: "Electric Dream",
    priceCents: 180000,
    currency: "USD",
    category: "paintings",
    image: undefined,
  },
  {
    id: "pnt-003",
    slug: "quiet-radiance",
    title: "Quiet Radiance",
    priceCents: 96000,
    currency: "USD",
    category: "paintings",
    image: undefined,
  },
  {
    id: "rug-001",
    slug: "cosmic-weave",
    title: "Cosmic Weave",
    priceCents: 250000,
    currency: "USD",
    category: "rugs",
    image: undefined,
  },
  {
    id: "rug-002",
    slug: "midnight-tuft",
    title: "Midnight Tuft",
    priceCents: 320000,
    currency: "USD",
    category: "rugs",
    image: undefined,
  },
];

export async function GET() {
  try {
    // First, try to get products from the database
    const dbProducts = await prisma.product.findMany({
      where: {
        status: { in: ["PUBLISHED", "ARCHIVED"] }, // Show both published and sold out products
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts.length > 0) {
      const products = dbProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        priceCents: p.priceCents,
        currency: p.currency,
        category: p.category,
        status: p.status, // Include status
        isAvailable: p.status === "PUBLISHED", // Available for purchase only if published
        image: p.images[0]?.url || undefined, // Use the first image as the main image
        images: p.images.map((img) => img.url), // Include all images
      }));
      return NextResponse.json({ products });
    }

    // If no database products, try Square
    const items = await searchCatalogPaintings();
    const products = items.map(normalizeSquareItem).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      priceCents: p.priceCents,
      currency: p.currency,
      category: p.category,
      image: undefined, // Square images need special handling
    }));
    return NextResponse.json({ products });
  } catch {
    // Return demo data when neither database nor Square is configured
    return NextResponse.json({ products: demoProducts });
  }
}
