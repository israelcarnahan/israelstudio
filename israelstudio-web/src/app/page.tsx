import { ParallaxHero } from "@/components/parallax-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import FeaturedClient from "@/components/featured-carousel.client";
import FramedCommissionForm from "@/components/FramedCommissionForm";

async function getProducts() {
  try {
    // Try to get products from the API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
    const response = await fetch(`${baseUrl}/api/catalog`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.products && Array.isArray(data.products)) {
        return data.products;
      }
    }
  } catch (error) {
    console.log("API not available, using demo products");
  }

  // Fallback to demo products if API fails
  return [
    {
      id: "pnt-001",
      slug: "sunlit-portrait",
      title: "Sunlit Portrait",
      priceCents: 120000,
      currency: "USD",
      category: "paintings",
      image: "/placeholder-painting.jpg",
    },
    {
      id: "pnt-002",
      slug: "electric-dream",
      title: "Electric Dream",
      priceCents: 180000,
      currency: "USD",
      category: "paintings",
      image: "/placeholder-painting.jpg",
    },
    {
      id: "pnt-003",
      slug: "quiet-radiance",
      title: "Quiet Radiance",
      priceCents: 96000,
      currency: "USD",
      category: "paintings",
      image: "/placeholder-painting.jpg",
    },
    {
      id: "rug-001",
      slug: "cosmic-weave",
      title: "Cosmic Weave",
      priceCents: 250000,
      currency: "USD",
      category: "rugs",
      image: "/placeholder-rug.jpg",
    },
    {
      id: "rug-002",
      slug: "midnight-tuft",
      title: "Midnight Tuft",
      priceCents: 320000,
      currency: "USD",
      category: "rugs",
      image: "/placeholder-rug.jpg",
    },
  ];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <ParallaxHero />

      {/* Product carousel */}
      <FeaturedClient slides={products} />

      {/* Framed commission form on home */}
      <section id="commission" className="container py-12 anchor-section">
        <FramedCommissionForm />
      </section>
    </>
  );
}
