"use client";
import { useState } from "react";
import { Uploader } from "../../../../components/uploader";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);
  const [busy, setBusy] = useState(false);

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
        <span className="text-sm">Description</span>
        <textarea className="rounded-2xl border px-4 py-3 min-h-[120px]" value={desc} onChange={e=>setDesc(e.target.value)} />
      </label>

      <div className="grid gap-2">
        <span className="text-sm">Images</span>
        <Uploader onDone={(im) => setImages(prev => [...prev, { url: im.url }])} />
        <div className="grid grid-cols-3 gap-2">
          {images.map((im, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" className="h-full w-full object-cover" />
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
            const r = await fetch("/api/admin/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title,
                priceCents: Math.round(price * 100),
                currency: "USD",
                description: desc,
                category: "paintings",
                images,
              }),
            });
            setBusy(false);
            if (r.ok) {
              window.location.href = "/admin/products";
            } else {
              alert("Failed to create product");
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
