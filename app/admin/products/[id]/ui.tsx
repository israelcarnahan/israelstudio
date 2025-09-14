"use client";
import { useState } from "react";
import { Uploader } from "../../../../../components/uploader";

export default function Editor({ product }: { product: any }) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.priceCents/100);
  const [desc, setDesc] = useState(product.description ?? "");
  const [images, setImages] = useState<Array<{ url: string; alt?: string }>>(product.images ?? []);
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid gap-6 max-w-2xl">
      <h1 className="font-display text-2xl">Edit Product</h1>

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
            <div key={i} className="aspect-square rounded-xl overflow-hidden border relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url} alt="" className="h-full w-full object-cover" />
              <button className="btn btn-ghost absolute top-2 right-2" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          className="btn btn-primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const r = await fetch(`/api/admin/products/${product.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title,
                priceCents: Math.round(price * 100),
                description: desc,
                images,
              }),
            });
            setBusy(false);
            if (!r.ok) { alert("Update failed"); return; }
            window.location.href = "/admin/products";
          }}
        >
          Save
        </button>
        <form action={`/api/admin/products/${product.id}/publish`} method="post">
          <button className="btn btn-accent" type="submit">Publish → Square</button>
        </form>
        <form action={`/api/admin/products/${product.id}`} method="post" onSubmit={async(e)=>{ e.preventDefault(); if(!confirm("Delete product?")) return; await fetch(e.currentTarget.action, { method: "DELETE" }); window.location.href="/admin/products"; }}>
          <button className="btn btn-ghost" type="submit">Delete</button>
        </form>
      </div>
    </div>
  );
}
