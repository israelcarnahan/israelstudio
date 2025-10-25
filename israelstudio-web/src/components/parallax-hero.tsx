// 🏠 ParallaxHero
// Left column: brand (logo + buttons). Right column: TV frame + video.
// All positioning/sizing controlled by CSS vars in global.css.
// EDIT MAP:
//   - Move hero block: --hero-top/left/height/gap (global.css)
//   - Size TV in place: --tv-scale (global.css)
//   - Video screen: --v-left/top/width/height (global.css)
//   - Brand as a unit: transform on .brand-wrap
//   - Tweak logo/buttons separately: --logo-*, --cta-* (global.css)

"use client";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
// Removed FramedBox import - inlining frame logic directly

export function ParallaxHero() {
  const [mounted, setMounted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, reduce ? 0 : -20]); // Reduced movement
  const r = useTransform(scrollY, [0, 400], [0, reduce ? 0 : 2]); // Reduced rotation

  const videos = [
    "wanda.mp4",
    "modelofoiltrim.MP4",
    "skipperpainting.mp4",
    "thefirstvaginas.mp4",
    "vaginasbythepool.mp4",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(interval);
  }, [mounted, videos.length]);

  return (
    <section className="container py-16 parallax-wrap">
      <div className="hero-wrap">
        <div className="grid gap-10 md:grid-cols-[420px,1fr] md:items-center">
          <motion.div
            style={mounted ? { y, rotateX: r } : {}}
            className="will-change-transform md:col-span-1"
          >
            {/* Move BOTH logo & buttons together with one transform on .brand-wrap.
                For micro-adjustments, edit --logo-x/y and --cta-x/y in :root. */}
            <div className="brand-wrap">
              <div className="mb-6">
                <Image
                  src="/logo.png"
                  alt="Israel's Studio"
                  width={600}
                  height={400}
                  className="hero-logo"
                  priority
                />
              </div>
              <p className="mt-5 text-lg text-neutral-600 max-w-prose"></p>
              <div className="hero-cta-row">
                <a className="btn btn-primary flex-1 text-base" href="/shop">
                  Shop Art
                </a>
                <a
                  className="btn btn-ghost flex-1 text-base text-center"
                  href="/#commission"
                >
                  Request a Commission
                </a>
              </div>
            </div>
          </motion.div>
          <motion.div
            style={mounted ? { y } : {}}
            className="relative md:col-span-3"
          >
            {/* TV frame: do not set inline styles here.
                Use global.css: --hero-top/left/height/width for block placement,
                and --tv-scale to change size of the TV inside the hero.
                Video screen fit: --v-* on .hero-tv.frame2 > .frame2-canvas. */}
            <div className="hero-frame-container">
              <div className="frame2 framed-shadow hero-tv">
                <Image
                  src="/tvheroframe.png"
                  alt=""
                  width={1400}
                  height={1000}
                  className="frame2-img"
                  priority
                />
                <div className="frame2-canvas">
                  <div className="frame2-fill">
                    <div className="relative h-full w-full">
                      {/* Video fills the defined screen area (cover). If you want "fit inside",
                          switch to contain and adjust background color/bars. */}
                      <video
                        key={currentVideoIndex}
                        autoPlay={true}
                        muted
                        loop
                        playsInline
                        className="hero-video"
                        style={{
                          // VIDEO STYLING: Just basic video properties
                          // - The content area above (--v-* values) controls positioning and sizing
                          // - This only handles video-specific styling
                          objectFit: "cover",
                        }}
                        onLoadStart={() => {
                          // Ensure smooth transitions
                        }}
                      >
                        <source
                          src={`/videos/${videos[currentVideoIndex]}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video indicator dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVideoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentVideoIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
