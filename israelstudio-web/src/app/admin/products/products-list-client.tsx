"use client";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  status: string;
  currency: string;
  priceCents: number;
};

export function ProductsListClient({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-3">
      {products.map(p => (
        <div key={p.id} className="rounded-2xl border p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-neutral-600">{p.status} · {p.currency} {(p.priceCents/100).toFixed(2)}</div>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-ghost" href={`/admin/products/${p.id}`}>Edit</Link>
            {p.status === "PUBLISHED" ? (
              <span className="btn btn-ghost opacity-50 cursor-not-allowed">Published ✓</span>
            ) : (
              <button 
                className="btn btn-accent"
                onClick={async () => {
                  if (!confirm("Publish this product to Square? This will make it available for purchase.")) return;
                  
                  try {
                    const r = await fetch(`/api/admin/products/${p.id}/publish`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                    });
                    
                    if (r.ok) {
                      alert("Product successfully published to Square!");
                      window.location.reload();
                    } else {
                      const errorData = await r.json();
                      if (errorData.error === "square_not_configured") {
                        alert("Square API credentials are not configured. Please check your environment variables.");
                      } else if (errorData.error === "already_published") {
                        alert("This product is already published to Square!");
                        window.location.reload();
                      } else if (errorData.error === "square_conflict") {
                        alert("This product may already exist in Square. Please check your Square dashboard or try updating the product title.");
                      } else {
                        alert(`Failed to publish to Square: ${errorData.message || "Unknown error"}`);
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
          </div>
        </div>
      ))}
    </div>
  );
}
