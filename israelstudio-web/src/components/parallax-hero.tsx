"use client";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import FramedBox from "@/components/FramedBox";

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
          <h1 className="font-display text-4xl sm:text-5xl leading-tight">
            See it in{" "}
            <span className="underline decoration-brand-pink underline-offset-4">
              action
            </span>{" "}
            ✨
          </h1>
          <p className="mt-5 text-lg text-neutral-600 max-w-prose"></p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-primary" href="/shop">
              Shop Art
            </a>
            <a className="btn btn-ghost" href="/#commission">
              Request a Commission
            </a>
          </div>
        </motion.div>
        <motion.div
          style={mounted ? { y } : {}}
          className="relative md:col-span-3"
        >
          <FramedBox
            frameSrc="/tvheroframe.png"
            priority
            // FRAME POSITIONING: Controls the PNG frame image size and position within the container
            // - left/top: Where the frame appears
            // - width/height: How big the frame is relative to container
            // Adjust these to resize the actual frame image itself
            offsets={{ left: "14%", top: "36%", width: "58%", height: "31%" }}
          >
            <div className="relative h-full w-full">
              {/* Base video (cover) - hidden when we show the padded version */}
              {/* Single video with consistent sizing */}
              <video
                key={currentVideoIndex}
                autoPlay={true}
                muted
                loop
                playsInline
                className="hero-video"
                style={{
                  // VIDEO POSITIONING: Controls the video content inside the frame's transparent area
                  // - These values position the video within the PNG frame's transparent "screen" area
                  // - Adjust these to fit videos properly inside the frame's transparent region
                  // - Does NOT affect the frame size, only the video positioning within it
                  position: "absolute",
                  left: "0%",      // How far from left edge of frame
                  top: "-1%",      // How far from top edge of frame  
                  right: "15%",    // How far from right edge of frame
                  bottom: "28%",   // How far from bottom edge of frame
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
          </FramedBox>

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
