"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { money } from "@/lib/format";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart";

const FRAME_SRC = "/carouselframe.png"; // Fixed: was pointing to non-existent colortransrame.png

// This is the index of the slide/product that will be highlighted
const HIGHLIGHT: "left" | "center" | "right" | number = "center";
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

  useEffect(() => {
    if (!embla) return;

    const computeActive = () => {
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
        offset = HIGHLIGHT; // explicit "leftmost + N"
      } else if (HIGHLIGHT === "left") {
        offset = 0;
      } else if (HIGHLIGHT === "right") {
        offset = Math.max(0, perView - 1);
      } else {
        // "center" (bias right on even counts)
        offset = Math.floor(perView / 2);
      }

      const next = (leftmost + offset + count) % count;
      setActive(next);
    };

    computeActive();
    embla.on("select", computeActive);
    embla.on("scroll", computeActive); // keeps frame tracking while dragging
    embla.on("reInit", computeActive);

    const onResize = () => computeActive();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      embla.off("select", computeActive);
      embla.off("scroll", computeActive);
      embla.off("reInit", computeActive);
    };
  }, [embla, viewportRef]);

  return (
    <div id="home-carousel" className="mt-6 carousel-container">
      {!isVisible ? (
        <div className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center">
          <div className="text-neutral-500">Loading carousel...</div>
        </div>
      ) : (
        <>
          <div className="carousel-wire-gap" />
          <div className="embla-viewport-visible" ref={viewportRef}>
            <div className="flex gap-6 embla-track-open">
              {slides.map((p, i) => {
                const isActive = i === active;
                return (
                  <article
                    key={p.id}
                    className="min-w-[76%] sm:min-w-[44%] lg:min-w-[30%] rounded-2xl border border-neutral-200 bg-white shadow-soft carousel-card-open"
                  >
                    <Link href={`/product/${p.slug}`} className="block">
                      {/* IMAGE AREA ONLY — frame overlays this box */}
                      <div className="slide-img-wrap aspect-square bg-neutral-100 rounded-2xl overflow-visible">
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
                            className="frame-pad"
                            style={
                              {
                                // TUNE these 4 to match the inner transparent area of the frame, fitting the highlight product
                                "--pad-left": "12%",
                                "--pad-top": "4%",
                                "--pad-right": "12%",
                                "--pad-bottom": "9%",
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
