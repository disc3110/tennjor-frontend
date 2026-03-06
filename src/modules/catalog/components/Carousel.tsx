"use client";

import Link from "next/link";
import React, { useRef } from "react";

interface CarouselProps {
  title?: string;
  titleHref?: string; 
  rightSlot?: React.ReactNode; 
  children: React.ReactNode;
}

export function Carousel({ title, titleHref, rightSlot, children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full">
      {(title || rightSlot) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {title ? (
              titleHref ? (
                <Link
                  href={titleHref}
                  className="text-lg font-semibold tracking-tight hover:underline underline-offset-4"
                >
                  {title}
                </Link>
              ) : (
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              )
            ) : null}
            {rightSlot}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--card-2)] transition"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--card-2)] transition"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory no-scrollbar"
      >
        {React.Children.toArray(children).map((child, i) => (
          <div
            key={i}
            className="snap-start shrink-0 basis-[80%] sm:basis-[48%] md:basis-[32%] lg:basis-[24%]"
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}