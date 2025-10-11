"use client";

export function DoodlesBG() {
  return (
    <div className="doodles" aria-hidden>
      {/* hand-drawn black lines */}
      <svg className="doodle-lines">
        <path d="M50 80 C 180 10, 260 180, 420 60" />
        <path d="M20 240 C 140 220, 210 340, 340 300" />
        <path d="M80 460 C 150 410, 260 560, 380 520" />
        <path d="M70 150 q40 -30 80 0 q40 30 80 0" />
        <path d="M65 360 q60 -40 120 0 q60 40 120 0" />
      </svg>
      {/* soft color halos from logo palette */}
      <svg className="doodle-pops">
        <defs>
          <radialGradient id="halo" r="1">
            <stop offset="0" stopColor="#e790de" />
            <stop offset=".5" stopColor="#89ead6" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx="18%" cy="24%" r="140" fill="url(#halo)" />
        <circle cx="78%" cy="35%" r="160" fill="url(#halo)" />
        <circle cx="38%" cy="78%" r="120" fill="url(#halo)" />
      </svg>
    </div>
  );
}
