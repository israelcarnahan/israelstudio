"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Product = {
  id: string;
  title: string;
  status: string;
  currency: string;
  priceCents: number;
  images: {
    id: string;
    url: string;
    alt: string | null;
    order: number;
  }[];
};

export function ProductsListClient({ products }: { products: Product[] }) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Create new order array
    const newOrder = [...products];
    const draggedProduct = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedProduct);

    // Update the order in the database
    try {
      const response = await fetch("/api/admin/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: newOrder.map((p, index) => ({ id: p.id, order: index })),
        }),
      });

      if (response.ok) {
        // Reload the page to show the new order
        window.location.reload();
      } else {
        alert("Failed to reorder products. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="grid gap-3">
      {products.map((p, index) => {
        const mainImage =
          p.images.find((img) => img.order === 0) || p.images[0];

        return (
          <div
            key={p.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`rounded-2xl border p-4 flex items-center gap-4 cursor-move transition-all ${
              draggedIndex === index
                ? "opacity-50 scale-95"
                : dragOverIndex === index
                  ? "border-blue-500 bg-blue-50"
                  : "hover:shadow-md"
            }`}
          >
            {/* Drag Handle */}
            <div className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 cursor-move">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zm-6 4h2v2H8v-2zm6 0h2v2h-2v-2zm-6 4h2v2H8v-2zm6 0h2v2h-2v-2z" />
              </svg>
            </div>

            {/* Product Image Preview */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || p.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                  No Image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-neutral-600">
                {p.status} · {p.currency} {(p.priceCents / 100).toFixed(2)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link className="btn btn-ghost" href={`/admin/products/${p.id}`}>
                Edit
              </Link>

              {p.status === "PUBLISHED" ? (
                <span className="btn btn-ghost opacity-50 cursor-not-allowed">
                  Published ✓
                </span>
              ) : (
                <button
                  className="btn btn-accent"
                  onClick={async () => {
                    if (
                      !confirm(
                        "Publish this product to Square? This will make it available for purchase."
                      )
                    )
                      return;

                    try {
                      const r = await fetch(
                        `/api/admin/products/${p.id}/publish`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                        }
                      );

                      if (r.ok) {
                        alert("Product successfully published to Square!");
                        window.location.reload();
                      } else {
                        const errorData = await r.json();
                        if (errorData.error === "square_not_configured") {
                          alert(
                            "Square API credentials are not configured. Please check your environment variables."
                          );
                        } else if (errorData.error === "already_published") {
                          alert("This product is already published to Square!");
                          window.location.reload();
                        } else if (errorData.error === "square_conflict") {
                          alert(
                            "This product may already exist in Square. Please check your Square dashboard or try updating the product title."
                          );
                        } else {
                          alert(
                            `Failed to publish to Square: ${errorData.message || "Unknown error"}`
                          );
                        }
                      }
                    } catch (error) {
                      alert("Network error. Please try again.");
                    }
                  }}
                >
                  Publish → Square
                </button>
              )}

              {/* Mark as Sold Out (Archive) */}
              {p.status !== "ARCHIVED" && (
                <button
                  className="btn btn-ghost text-orange-600 hover:text-orange-700"
                  onClick={async () => {
                    if (
                      !confirm(
                        "Mark this product as sold out? It will remain visible in the catalog but won't be available for purchase."
                      )
                    )
                      return;

                    try {
                      const r = await fetch(`/api/admin/products/${p.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "ARCHIVED" }),
                      });

                      if (r.ok) {
                        alert("Product marked as sold out!");
                        window.location.reload();
                      } else {
                        alert("Failed to update product status.");
                      }
                    } catch (error) {
                      alert("Network error. Please try again.");
                    }
                  }}
                >
                  Mark as Sold Out
                </button>
              )}

              {/* Remove from Website (Delete) */}
              <button
                className="btn btn-ghost text-red-600 hover:text-red-700"
                onClick={async () => {
                  if (
                    !confirm(
                      "Remove this product from the website? This action cannot be undone."
                    )
                  )
                    return;

                  try {
                    const r = await fetch(`/api/admin/products/${p.id}`, {
                      method: "DELETE",
                    });

                    if (r.ok) {
                      alert("Product removed from website!");
                      window.location.reload();
                    } else {
                      alert("Failed to remove product.");
                    }
                  } catch (error) {
                    alert("Network error. Please try again.");
                  }
                }}
              >
                Remove from Website
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
