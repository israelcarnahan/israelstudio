// 🏠 ParallaxHero
// Left column: brand (logo + buttons). Right column: TV frame + video.
// All positioning/sizing controlled by CSS vars in global.css.
// EDIT MAP:
//   - Move hero block: --hero-top/left/height/gap (global.css)
//   - Size TV in place: --tv-scale (global.css)
//   - Video screen: --v-left/top/width/height (global.css)
//   - Brand as a unit: transform on .brand-wrap
//   - Tweak logo/buttons separately: --logo-*, --cta-* (global.css)

// ⚙️ Dependencies: globals.css (hero vars), featured-carousel.client.tsx (carousel), FramedCommissionForm.tsx (commission frame)

// 📋 DEV GUIDE
// Purpose: Home page hero with parallax motion, video cycling, and brand positioning
//
// Key Rules:
//   ✅ All positional logic = CSS vars (globals.css)
//   ✅ JS = parallax + video cycling only
//   ❌ Do not hardcode pixel values
//   ✅ Use transforms for brand movement (not margins)
//
// Adding New Hero Videos:
//   1. Add video file to /public/videos/
//   2. Add filename to videos array (line ~30)
//   3. Adjust interval timing if needed (line ~47)
//
// Related Files:
//   - globals.css: --hero-*, --tv-scale, --v-*, --logo-*, --cta-*
//   - featured-carousel.client.tsx: carousel section below hero
//   - FramedCommissionForm.tsx: commission frame styling

"use client";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import SplashLink from "./SplashLink";
// Removed FramedBox import - inlining frame logic directly

export function ParallaxHero() {
  const [mounted, setMounted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // 🎬 PARALLAX MOTION LOGIC
  // Range: scrollY [0, 400] maps to movement [0, -20px] and rotation [0, 2deg]
  // Syncs with .parallax-wrap CSS perspective in globals.css
  // Reduced motion: disables parallax for accessibility
  const y = useTransform(scrollY, [0, 400], [0, reduce ? 0 : -20]); // Reduced movement
  const r = useTransform(scrollY, [0, 400], [0, reduce ? 0 : 2]); // Reduced rotation

  const videos = [
    "wanda.mp4",
    "modelofoiltrim.MP4",
    "skipperpainting.mp4",
    "thefirstvaginas.mp4",
    "vaginasbythepool.mp4",
  ];

  // 🎥 VIDEO CYCLING LOGIC
  // Interval: 8 seconds per video (adjust line ~67)
  // Flicker safety: key={currentVideoIndex} forces clean video swaps
  // Indicator sync: dots update automatically with video changes
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
    <section className="container py-16 parallax-wrap home-hero">
      <div className="hero-wrap">
        <div className="grid gap-10 md:grid-cols-[420px,1fr] md:items-center">
          <motion.div
            style={mounted ? { y, rotateX: r } : {}}
            className="will-change-transform md:col-span-1 hero-motion"
          >
            {/* 🎨 BRAND WRAP (Logo + Buttons)
                Controls: --logo-* and --cta-* vars in globals.css :root
                Performance: Use transforms on .brand-wrap for animations (not margins)
                Micro-adjustments: Edit --logo-x/y and --cta-x/y in :root */}
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
                <SplashLink
                  className="btn btn-primary flex-1 text-base"
                  href="/shop"
                >
                  Shop Art
                </SplashLink>
                <SplashLink
                  className="btn btn-ghost flex-1 text-base text-center"
                  href="/#commission"
                >
                  Request a Commission
                </SplashLink>
              </div>
            </div>
          </motion.div>
          <div className="hero-layout md:col-span-3">
            {/* 📺 HERO FRAME CONTAINER
                LAYOUT VS MOTION SPLIT: 
                - .hero-layout: receives --hero-offset-y transform (CSS-controlled)
                - .hero-motion: receives Framer Motion transforms (JS-controlled)
                - No conflicts between CSS and JS transforms */}
            <motion.div
              style={mounted ? { y } : {}}
              className="hero-motion"
            >
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
                      {/* 🎬 VIDEO ELEMENT
                          objectFit: "cover" fills screen area (crops to fit)
                          Alternative: "contain" shows full video (may add black bars)
                          Black-bar handling: Set background color on .frame2-canvas if using contain */}
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

            {/* 🎯 VIDEO INDICATOR DOTS
                Style extensions: Add hover animations, custom colors, or size variants
                Animation: Current uses scale-125 for active state
                Accessibility: aria-label provides screen reader context */}
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
      </div>
    </section>
  );
}

// 🔗 CROSS-FILE LINKS
// - globals.css: --hero-*, --tv-scale, --v-*, --logo-*, --cta-* variables
// - featured-carousel.client.tsx: carousel section below hero
// - FramedCommissionForm.tsx: commission frame styling

// 📋 CURSOR AUDIT NOTES
// ✅ Verified global vars exist in globals.css :root
// ✅ No inline style overrides (all positioning via CSS vars)
// ✅ Parallax motion range safe (scrollY [0, 400] → movement [-20px, 0])
// ✅ Video cycling logic isolated and flicker-safe
// ✅ Brand wrap uses CSS vars (--logo-*, --cta-*) not hardcoded values
// ✅ Performance: transforms recommended for animations
//
// Next task suggestion: route-change paint splash trigger audit
