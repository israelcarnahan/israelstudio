import type { Category, Product } from "./types";

export const categories: Category[] = [
  { slug: "paintings", name: "Paintings" },
];

export const demoProducts: Product[] = [
  {
    id: "pnt-001",
    slug: "sunlit-portrait",
    title: "Sunlit Portrait",
    priceCents: 120000,
    currency: "USD",
    category: "paintings",
    blurb: "Vibrant portrait with subtle sparkle accents.",
    specs: { Medium: "Acrylic on canvas", Size: "24in × 30in" },
    images: [{ alt: "Sunlit Portrait", src: undefined }],
  },
  {
    id: "pnt-002",
    slug: "electric-dream",
    title: "Electric Dream",
    priceCents: 180000,
    currency: "USD",
    category: "paintings",
    blurb: "High-contrast color pop, gallery-ready.",
    specs: { Medium: "Oil on canvas", Size: "30in × 36in" },
    images: [{ alt: "Electric Dream", src: undefined }],
  },
  {
    id: "pnt-003",
    slug: "quiet-radiance",
    title: "Quiet Radiance",
    priceCents: 96000,
    currency: "USD",
    category: "paintings",
    blurb: "Soft palette with luminous brushwork.",
    specs: { Medium: "Acrylic on canvas", Size: "18in × 24in" },
    images: [{ alt: "Quiet Radiance", src: undefined }],
  },
];

export function getAllCategories() {
  return categories;
}

export function getAllProducts() {
  return demoProducts;
}

export function getProductsByCategory(slug: string) {
  return demoProducts.filter(p => p.category === slug);
}

export function getProductBySlug(slug: string) {
  return demoProducts.find(p => p.slug === slug);
}
