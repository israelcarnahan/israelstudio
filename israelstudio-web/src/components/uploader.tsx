"use client";
import { useState } from "react";

export function Uploader({ onDone }: { onDone: (img: { url: string; width?: number; height?: number }) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  return (
    <div className="grid gap-2">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={async (e) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;
          
          setBusy(true); 
          setErr(null);
          setUploadProgress(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`);

          try {
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
              
              const fd = new FormData();
              fd.append("file", file);
              const r = await fetch("/api/upload", { method: "POST", body: fd });
              
              if (!r.ok) { 
                setErr(`Upload failed for ${file.name}`); 
                setBusy(false); 
                setUploadProgress("");
                return; 
              }
              
              const j = await r.json();
              onDone({ url: j.url, width: j.width, height: j.height });
            }
            
            setUploadProgress("Upload complete!");
            setTimeout(() => {
              setUploadProgress("");
            }, 1000);
          } catch (error) {
            setErr("Upload failed");
            setUploadProgress("");
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy ? <div className="text-sm text-neutral-600">{uploadProgress}</div> : null}
      {err ? <div className="text-sm text-red-600">{err}</div> : null}
    </div>
  );
}
