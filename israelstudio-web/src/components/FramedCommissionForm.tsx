// 🖼️ FramedCommissionForm
// Transparent PNG is the frame; .frame-canvas defines the opening.
// EDIT MAP:
//   --canvas-left/top/width/height (percent of frame-img bounds)
//   Keep within 0–100%. Mobile overrides in global.css @media block.

// ⚙️ Dependencies: globals.css (frame vars), /api/quote (form submission), PageSplashTransition.tsx (route changes)

// 📋 DEV GUIDE
// Purpose: Commission request form with transparent PNG frame overlay
//
// Key Logic Areas:
//   🎯 Frame alignment: --canvas-* vars (lines ~102-107)
//   📤 Upload handling: filesToBase64() with 5MB size cap (lines ~44-63)
//   📝 Form submission: payload structure for /api/quote (lines ~65-98)
//   🎨 Dropzone: drag/drop with hover feedback (lines ~266-295)
//
// Key Rules:
//   ✅ Frame vars: keep within 0-100% range
//   ✅ File size: 5MB max per file, 5 files total
//   ✅ Form validation: required fields + honeypot spam protection
//   ❌ Do not hardcode frame positioning (use CSS vars)
//
// Related Files:
//   - globals.css: .frame-canvas, .frame-scroll, .form-card styling
//   - /api/quote: form submission endpoint
//   - PageSplashTransition.tsx: route change animations

"use client";
import Image from "next/image";
import { useState } from "react";

type Preview = {
  url: string;
  name: string;
  size: number;
  type: string;
  file: File;
};

export default function FramedCommissionForm() {
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);

  // 📁 FILE PICKER LOGIC
  // Filters: image/* types only, max 5 files total
  // Preview: creates object URLs for immediate display
  function onPick(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 5 - previews.length); // keep to max 5
    const more: Preview[] = arr.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setPreviews((prev) => [...prev, ...more].slice(0, 5));
  }

  function removePreview(i: number) {
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  }

  // 🔄 BASE64 CONVERSION
  // Size cap: 5MB per file (skips oversized files)
  // Output: { fileName, contentType, data } for API payload
  async function filesToBase64(list: Preview[]) {
    const maxPerFile = 5 * 1024 * 1024; // 5MB per file
    const res: { fileName: string; contentType: string; data: string }[] = [];
    for (const p of list) {
      if (p.size > maxPerFile) continue;
      const data = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => {
          const s = String(fr.result || "");
          // s looks like: data:image/png;base64,XXXXX
          const base64 = s.split(",")[1] || "";
          resolve(base64);
        };
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(p.file);
      });
      res.push({ fileName: p.name, contentType: p.type, data });
    }
    return res;
  }

  // 📝 FORM SUBMISSION LOGIC
  // Payload: form data + base64 attachments for /api/quote
  // Honeypot: 'website' field (hidden) for spam protection
  // State: busy/ok/err for UI feedback
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: String(fd.get("service") || "Rug") as
        | "Painting"
        | "Rug"
        | "Other",
      size: String(fd.get("size") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""), // honeypot
      attachments: await filesToBase64(previews),
    };
    setBusy(true);
    setErr(null);
    const r = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (r.ok) {
      setOk(true);
      (e.currentTarget as any).reset();
      setPreviews([]);
    } else {
      setOk(false);
      const j = await r.json().catch(() => ({}));
      setErr(j.error || "Failed");
    }
  }

  // 🎯 FRAME ALIGNMENT VARS
  // Safe range: 0-100% (percent of frame-img bounds)
  // Mobile: overrides in globals.css @media (max-width: 640px)
  // Tweak: if opening doesn't match PNG hole, adjust these values
  const vars = {
    ["--canvas-left" as any]: "20%",
    ["--canvas-top" as any]: "20%",
    ["--canvas-width" as any]: "62%",
    ["--canvas-height" as any]: "56%",
  };

  return (
    <div className="frame-wrap">
      {/* Transparent PNG frame */}
      <Image
        src="/commissionframe.png"
        alt=""
        width={1200}
        height={1200}
        className="frame-img"
        priority
      />

      {/* Scrollable form inside the opening */}
      <div className="frame-canvas" style={vars}>
        <div className="frame-scroll p-3 sm:p-4">
          <form onSubmit={onSubmit} className="form-card p-4 sm:p-6 space-y-4">
            {/* honeypot - accessible trap */}
            <label className="sr-only" htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="sr-only"
            />

            <div className="text-center">
              <h2 className="font-display text-2xl">Get a Custom Quote</h2>
              <p className="help mt-1">
                Answer a few questions — I'll reply via email with timing &
                pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label htmlFor="fullName" className="grid gap-1">
                <span className="label">Full name*</span>
                <input
                  id="fullName"
                  required
                  name="name"
                  autoComplete="name"
                  className="input"
                  placeholder="Your name"
                />
              </label>
              <label htmlFor="email" className="grid gap-1">
                <span className="label">Email*</span>
                <input
                  id="email"
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="input"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label htmlFor="service" className="grid gap-1">
                <span className="label">Service*</span>
                <select
                  id="service"
                  name="service"
                  className="select"
                  defaultValue="Rug"
                  required
                >
                  <option>Rug</option>
                  <option>Painting</option>
                  <option>Other</option>
                </select>
              </label>
              <label htmlFor="size" className="grid gap-1">
                <span className="label">Estimated size</span>
                <select
                  id="size"
                  name="size"
                  className="select"
                  defaultValue=""
                >
                  <option value="">Select…</option>
                  <option>Small (≤18×24″)</option>
                  <option>Medium (24×36″)</option>
                  <option>Large (36×48″+)</option>
                  <option>Custom</option>
                </select>
              </label>
            </div>

            {/* 🎨 DRAG & DROP UPLOADS */}
            <div className="grid gap-2">
              <span className="label">Reference images (up to 5)</span>
              <Dropzone onPick={onPick} />
              {previews.length ? (
                <div className="grid grid-cols-5 gap-2">
                  {previews.map((p, i) => (
                    <div
                      key={i}
                      className="relative border rounded-lg overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.url}
                        alt={p.name}
                        className="h-24 w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 rounded px-1 text-xs"
                        onClick={() => removePreview(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="help">PNG/JPG, up to 5MB each, 5 files max.</p>
            </div>

            <label htmlFor="message" className="grid gap-1">
              <span className="label">Tell me about the piece</span>
              <textarea
                id="message"
                name="message"
                autoComplete="off"
                className="textarea"
                rows={3}
                placeholder="Colors, vibe, deadline, refs…"
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Submit Request"}
              </button>
              {ok === true ? (
                <span className="text-green-700 text-sm">
                  Sent! I'll reply soon.
                </span>
              ) : null}
              {ok === false ? (
                <span className="text-red-600 text-sm">
                  {err || "Error — try again"}
                </span>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* --- 🎨 DROPZONE COMPONENT --- */
// Drag/drop with hover feedback and file input fallback
// Visual: dashed border with hover state (border-neutral-800 bg-neutral-50)
function Dropzone({ onPick }: { onPick: (files: FileList | null) => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`rounded-xl border-2 border-dashed px-4 py-6 text-center ${hover ? "border-neutral-800 bg-neutral-50" : "border-neutral-300"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        onPick(e.dataTransfer.files);
      }}
    >
      <p className="text-sm">Drag & drop images here, or</p>
      <label className="mt-1 inline-block">
        <span className="btn btn-ghost">Choose files</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />
      </label>
    </div>
  );
}

// 🔗 CROSS-FILE LINKS
// - globals.css: .frame-canvas, .frame-scroll, .form-card styling
// - /api/quote: form submission endpoint
// - PageSplashTransition.tsx: route change animations

// 📋 CURSOR AUDIT NOTES
// ✅ Verified frame vars exist in globals.css
// ✅ File size cap: 5MB per file, 5 files max
// ✅ Form validation: required fields + honeypot protection
// ✅ Base64 conversion: proper data URL parsing
// ✅ Dropzone: drag/drop with hover feedback
//
// Future improvements: email validation, API retry logic, file type validation
