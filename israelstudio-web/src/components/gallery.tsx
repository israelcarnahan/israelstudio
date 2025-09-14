"use client";
import { useState } from "react";

export function Gallery({ images }: { images: { src?: string; alt: string }[] }) {
  const [idx, setIdx] = useState(0);
  const current = images[idx];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
        {current?.src ? (
          <img src={current.src} alt={current.alt} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_70%_30%,#f3f3f3,transparent_60%)]" />
        )}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((im, i) => (
          <button
            key={i}
            aria-label={`Show image ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`aspect-square overflow-hidden rounded-xl border ${i === idx ? "border-neutral-900" : "border-neutral-200"} bg-neutral-100`}
          >
            {im.src ? (
              <img src={im.src} alt={im.alt} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_30%_70%,#eee,transparent_60%)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
