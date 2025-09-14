export type Category = { slug: string; name: string };

export type ProductImage = {
  src?: string; // will be Cloudinary/Square later
  alt: string;
  width?: number;
  height?: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: "USD" | "GBP" | "EUR";
  category: string; // category slug
  blurb?: string;
  specs?: Record<string, string>;
  images: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
};
