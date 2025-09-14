"use client";
import { useState } from "react";

export function Uploader({ onDone }: { onDone: (img: { url: string; width?: number; height?: number }) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="grid gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true); setErr(null);
          const fd = new FormData();
          fd.append("file", f);
          const r = await fetch("/api/upload", { method: "POST", body: fd });
          if (!r.ok) { setErr("Upload failed"); setBusy(false); return; }
          const j = await r.json();
          onDone({ url: j.url, width: j.width, height: j.height });
          setBusy(false);
        }}
      />
      {busy ? <div className="text-sm text-neutral-600">Uploading…</div> : null}
      {err ? <div className="text-sm text-red-600">{err}</div> : null}
    </div>
  );
}
