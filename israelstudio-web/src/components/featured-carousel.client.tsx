"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { money } from "@/lib/format";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart";

const FRAME_SRC = "/carouselframe.png"; // Fixed: was pointing to non-existent colortransrame.png

// This is the index of the slide/product that will be highlighted
const HIGHLIGHT: "left" | "center" | "right" | number = -1; // Move two positions left from center
// examples:
// const HIGHLIGHT = 0       // leftmost
// const HIGHLIGHT = 1       // leftmost + 1
// const HIGHLIGHT = "right" // rightmost of the visible set

export default function FeaturedClient({ slides }: { slides: any[] }) {
  const cart = useCart();
  // Lazy load carousel to improve initial page load
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const container = document.querySelector(".carousel-container");
    if (container) observer.observe(container);

    return () => observer.disconnect();
  }, []);
  const [viewportRef, embla] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: false,
      skipSnaps: false,
      containScroll: "trimSnaps", // Optimize scroll performance
      watchDrag: true, // Only watch drag when needed
    },
    [
      Autoplay({
        delay: 6000, // Slower to reduce CPU usage
        stopOnInteraction: true, // Stop on user interaction
        stopOnMouseEnter: true,
        stopOnFocusIn: true, // Stop when focused
        rootNode: (emblaRoot) => emblaRoot.parentElement, // Optimize root
      }),
    ]
  );
  const [active, setActive] = useState(0);
  // console.log("Active state initialized:", active);
  // console.log("Component render - dependencies:", {
  //   embla: !!embla,
  //   viewportRef: !!viewportRef,
  //   HIGHLIGHT,
  // });

  // Debug when active state changes
  // useEffect(() => {
  //   console.log("Active state changed to:", active);
  // }, [active]);

  // Force reset active state to 0 when component mounts
  useEffect(() => {
    setActive(0);
  }, []);

  // Run highlight calculation directly when dependencies change
  useEffect(() => {
    // console.log("Direct highlight calculation running");
    if (!embla) return;

    const viewportEl = embla.containerNode();
    if (!viewportEl) return;

    const slideEls = embla.slideNodes();
    const leftmost = embla.selectedScrollSnap();
    const count = slideEls.length;

    const vpW = viewportEl.getBoundingClientRect().width;
    const slideW = (slideEls[leftmost] as HTMLElement).getBoundingClientRect()
      .width;
    const perView = Math.max(1, Math.round(vpW / slideW));

    let offset: number;
    if (typeof HIGHLIGHT === "number") {
      offset = Math.floor(perView / 2) + HIGHLIGHT;
    } else if (HIGHLIGHT === "left") {
      offset = 0;
    } else if (HIGHLIGHT === "right") {
      offset = Math.max(0, perView - 1);
    } else {
      offset = Math.floor(perView / 2);
    }

    const next = (leftmost + offset + count) % count;
    // console.log("Direct calculation result:", {
    //   leftmost,
    //   offset,
    //   next,
    //   HIGHLIGHT,
    //   perView,
    // });
    setActive(next);
  }, [embla, HIGHLIGHT]);

  useEffect(() => {
    // console.log("useEffect running, embla:", !!embla, "isVisible:", isVisible);
    // console.log("useEffect dependencies:", {
    //   embla: !!embla,
    //   viewportRef: !!viewportRef,
    // });
    // console.log("useEffect is running!");
    if (!embla) return;

    const computeActive = () => {
      // console.log("computeActive called");
      const viewportEl = embla.containerNode();
      if (!viewportEl) return;

      const slideEls = embla.slideNodes(); // real slides (no clones)
      const leftmost = embla.selectedScrollSnap(); // with align:"start", this is leftmost visible
      const count = slideEls.length;

      // How many cards fit right now?
      const vpW = viewportEl.getBoundingClientRect().width;
      const slideW = (slideEls[leftmost] as HTMLElement).getBoundingClientRect()
        .width;
      const perView = Math.max(1, Math.round(vpW / slideW)); // 1 / 2 / 3 typically

      // Decide offset based on HIGHLIGHT
      let offset: number;
      if (typeof HIGHLIGHT === "number") {
        // For numbers, use as offset from center (negative = left, positive = right)
        offset = Math.floor(perView / 2) + HIGHLIGHT;
      } else if (HIGHLIGHT === "left") {
        offset = 0;
      } else if (HIGHLIGHT === "right") {
        offset = Math.max(0, perView - 1);
      } else {
        // "center" (bias right on even counts)
        offset = Math.floor(perView / 2);
      }

      const next = (leftmost + offset + count) % count;
      // console.log("Highlight calculation:", {
      //   leftmost,
      //   offset,
      //   next,
      //   HIGHLIGHT,
      //   perView,
      // });
      // console.log("Setting active to:", next);
      setActive(next);
      // console.log("Active state set by highlight calculation");
    };

    computeActive();
    embla.on("select", computeActive);
    embla.on("scroll", computeActive); // keeps frame tracking while dragging
    embla.on("reInit", computeActive);

    // Force recompute when HIGHLIGHT changes
    const forceRecompute = () => {
      // console.log("Force recompute triggered");
      computeActive();
    };

    // Set up a timer to force recompute
    const timer = setTimeout(forceRecompute, 100);

    const onResize = () => computeActive();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      embla.off("select", computeActive);
      embla.off("scroll", computeActive);
      embla.off("reInit", computeActive);
    };
  }, [embla, viewportRef, HIGHLIGHT]);

  return (
    <div id="home-carousel" className="carousel-container container">
      {!isVisible ? (
        <div className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center">
          <div className="text-neutral-500">Loading carousel...</div>
        </div>
      ) : (
        <>
          <div className="carousel-wire-gap" />
          <div className="embla-viewport-visible" ref={viewportRef}>
            <div className="flex gap-3 embla-track-open">
              {slides.map((p, i) => {
                const isActive = i === active;
                // if (i === 0)
                //   console.log("Active state:", { active, isActive, i });
                return (
                  <article
                    key={p.id}
                    className="rounded-2xl border border-neutral-200 bg-white shadow-soft carousel-card-open"
                    style={{
                      width: "400px",
                      minWidth: "400px",
                      maxWidth: "400px",
                    }}
                  >
                    <Link href={`/product/${p.slug}`} className="block">
                      {/* IMAGE AREA ONLY — frame overlays this box */}
                      <div className="slide-img-wrap aspect-square bg-neutral-100 rounded-2xl overflow-visible max-h-[400px] min-h-[300px]">
                        {/* Base image (cover). Hidden when active so we can show padded version instead */}
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.title}
                            className={`slide-img ${isActive ? "base-hidden" : ""}`}
                          />
                        ) : null}

                        {/* Active image inside a padded box so it sits fully inside the frame */}
                        {isActive && p.image && (
                          <div
                            className="frame-pad max-h-[400px]"
                            style={
                              {
                                // TUNE these 4 to match the inner transparent area of the frame, fitting the highlight product
                                "--pad-left": "8%",
                                "--pad-top": "2%",
                                "--pad-right": "8%",
                                "--pad-bottom": "6%",
                              } as React.CSSProperties
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.title}
                              className="slide-img"
                            />
                          </div>
                        )}

                        {/* FRAME overlays ONLY the image area and can float upward */}
                        {isActive && (
                          <div
                            className="frame-overlay"
                            style={
                              {
                                "--frame-w": "125%",
                                "--frame-lift": "-8%",
                              } as React.CSSProperties
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={FRAME_SRC} alt="" />
                          </div>
                        )}
                      </div>

                      {/* TITLE / PRICE (outside frame; flows normally) */}
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-sm text-neutral-600">
                            {money(p.priceCents, p.currency)}
                          </div>
                        </div>
                        {p.isAvailable !== false ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              cart.add({
                                slug: p.slug,
                                name: p.title,
                                amountCents: p.priceCents,
                                quantity: 1,
                                image: p.image,
                                category: p.category,
                              });
                            }}
                            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-medium transition-all duration-200 hover:scale-110 hover:shadow-lg"
                            aria-label={`Add ${p.title} to cart`}
                          >
                            +
                          </button>
                        ) : (
                          <div className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium opacity-50">
                            SOLD
                          </div>
                        )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
