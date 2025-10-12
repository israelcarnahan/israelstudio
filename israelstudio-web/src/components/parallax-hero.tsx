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
      <div className="grid gap-10 md:grid-cols-4 md:items-center">
        <motion.div
          style={mounted ? { y, rotateX: r } : {}}
          className="will-change-transform md:col-span-1"
        >
          {/* Logo png above buttons */}
          <div className="mb-6" style={{ transform: "translateX(240px)" }}>
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
          <div
            className="mt-8 flex gap-3 max-w-[285px]"
            style={{ transform: "translateX(240px)" }}
          >
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
        </motion.div>
        <motion.div
          style={mounted ? { y } : {}}
          className="relative md:col-span-3"
        >
          {/* 
            HERO FRAME: All positioning controlled in CSS (globals.css)
            - Frame position: .hero-frame-container
            - Video position: .hero-frame-container .frame2-canvas
            - To adjust: Edit the CSS values in globals.css
          */}
          <div className="hero-frame-container">
            <div className="frame2 framed-shadow">
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
                    {/* 
                      VIDEO ELEMENT: The actual video content
                      - This video fills the content area defined above
                      - objectFit: "cover" ensures video fills the area properly
                      - The content area (--v-* values) controls where this video appears
                    */}
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
    </section>
  );
}
