"use client";
import { useState } from "react";
import { Uploader } from "@/components/uploader";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("paintings");
  const [images, setImages] = useState<{ url: string; alt?: string; order?: number }[]>([]);
  const [busy, setBusy] = useState(false);

  const setMainImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      // Move the selected image to the front (order 0)
      const [selectedImage] = newImages.splice(index, 1);
      selectedImage.order = 0;
      newImages.unshift(selectedImage);
      // Update order for all other images
      return newImages.map((img, i) => ({ ...img, order: i }));
    });
  };

  return (
    <div className="grid gap-6 max-w-2xl">
      <h1 className="font-display text-2xl">New Product</h1>

      <label className="grid gap-1">
        <span className="text-sm">Title</span>
        <input className="rounded-xl border px-4 py-3" value={title} onChange={e=>setTitle(e.target.value)} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Price (USD)</span>
        <input type="number" className="rounded-xl border px-4 py-3" value={price} onChange={e=>setPrice(Number(e.target.value))} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Category</span>
        <select className="rounded-xl border px-4 py-3" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="paintings">Paintings</option>
          <option value="rugs">Rugs</option>
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Description</span>
        <textarea className="rounded-2xl border px-4 py-3 min-h-[120px]" value={desc} onChange={e=>setDesc(e.target.value)} />
      </label>

      <div className="grid gap-2">
        <span className="text-sm">Images</span>
        <Uploader onDone={(im) => setImages(prev => [...prev, { url: im.url, order: prev.length }])} />
        <div className="text-xs text-neutral-600 mb-2">
          Click an image to set it as the main image (shown first on shop page)
        </div>
        <div className="grid grid-cols-3 gap-2">
          {images.map((im, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden border relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={im.url} 
                alt="" 
                className="h-full w-full object-cover cursor-pointer" 
                onClick={() => setMainImage(i)}
              />
              {im.order === 0 && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Main
                </div>
              )}
              <button 
                className="btn btn-ghost absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={(e) => {
                  e.stopPropagation();
                  setImages(prev => prev.filter((_, idx) => idx !== i));
                }}
              >
                ×
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {im.order === 0 ? "Main Image" : `Image ${im.order + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="btn btn-primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const r = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title,
                  priceCents: Math.round(price * 100),
                  currency: "USD",
                  description: desc,
                  category,
                  images: images.map((img, index) => ({
                    url: img.url,
                    alt: img.alt,
                    order: img.order ?? index
                  })),
                }),
              });
              
              if (r.ok) {
                window.location.href = "/admin/products";
              } else {
                console.log("Response status:", r.status);
                console.log("Response headers:", r.headers);
                const errorData = await r.json();
                console.log("Error data:", errorData);
                if (r.status === 409) {
                  alert("A product with a similar title already exists. Please choose a different title.");
                } else if (errorData.error === "validation_error") {
                  alert(`Validation error: ${JSON.stringify(errorData.issues)}`);
                } else {
                  alert(`Failed to create product: ${errorData.error || "Unknown error"}`);
                }
              }
            } catch (error) {
              alert("Network error. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Save Draft
        </button>
        <a className="btn btn-ghost" href="/admin/products">Cancel</a>
      </div>
    </div>
  );
}
