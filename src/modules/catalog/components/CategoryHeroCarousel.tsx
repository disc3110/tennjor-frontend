"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGZpbHRlciBpZD0nYic+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMicgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIGZpbGw9JyMxMTExMTEnIGZpbHRlcj0ndXJsKCNiKScgLz48L3N2Zz4=";

export type CategoryHeroSlide = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  imageWebUrl: string;
  imageMobileUrl?: string;
  href: string;
  ctaLabel?: string;
};

interface CategoryHeroCarouselProps {
  slides: CategoryHeroSlide[];
  intervalMs?: number;
  className?: string;
}

export function CategoryHeroCarousel({
  slides,
  intervalMs = 4000,
  className = "",
}: CategoryHeroCarouselProps) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchLastX = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const count = safeSlides.length;
  const clampedIndex = count ? Math.min(index, count - 1) : 0;

  const goTo = (i: number) => {
    if (!count) return;
    setIndex((i + count) % count);
  };

  const next = () => goTo(clampedIndex + 1);
  const prev = () => goTo(clampedIndex - 1);
  const isFirst = clampedIndex === 0;

  const SWIPE_THRESHOLD_PX = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!count) return;
    isSwiping.current = true;
    setPaused(true);
    const x = e.touches[0]?.clientX ?? null;
    touchStartX.current = x;
    touchLastX.current = x;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchLastX.current = e.touches[0]?.clientX ?? touchLastX.current;
  };

  const onTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    const start = touchStartX.current;
    const end = touchLastX.current;
    touchStartX.current = null;
    touchLastX.current = null;

    if (start == null || end == null) {
      setPaused(false);
      return;
    }

    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) {
      setPaused(false);
      return;
    }

    if (delta < 0) {
      next();
    } else {
      prev();
    }

    // Resume autoplay after a short moment so the user sees the change
    window.setTimeout(() => setPaused(false), 600);
  };

  // Autoplay
  useEffect(() => {
    if (!count || paused) return;

    timerRef.current = window.setInterval(() => {
      setIndex((cur) => (cur + 1) % count);
    }, intervalMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [count, paused, intervalMs]);

  if (!count) return null;

  const slide = safeSlides[clampedIndex];
  if (!slide) return null;

  return (
    <section
      className={
        "relative w-full overflow-hidden bg-[var(--card)] " +
        "h-[100svh] md:h-[calc(100vh-96px)] " +
        className
      }
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-zinc-900">
        {/* Mobile */}
        <Image
          key={`mobile-${slide.imageMobileUrl ?? slide.imageWebUrl}`}
          src={slide.imageMobileUrl ?? slide.imageWebUrl}
          alt={`${slide.title} ${slide.highlight ?? ""}`.trim()}
          fill
          priority={isFirst}
          loading={isFirst ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover md:hidden"
          sizes="100vw"
        />

        {/* Desktop */}
        <Image
          key={`desktop-${slide.imageWebUrl}`}
          src={slide.imageWebUrl}
          alt={`${slide.title} ${slide.highlight ?? ""}`.trim()}
          fill
          priority={isFirst}
          loading={isFirst ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover hidden md:block"
          sizes="100vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="w-full px-6 sm:px-10">
          <div className="max-w-3xl">
            {slide.eyebrow && (
              <p className="text-xs sm:text-sm font-medium tracking-[0.18em] text-white/80">
                {slide.eyebrow.toUpperCase()}
              </p>
            )}

            <h1 className="mt-2 text-white font-semibold tracking-tight leading-[0.95] text-4xl sm:text-6xl md:text-7xl">
              <span className="block">{slide.title}</span>
              {slide.highlight && (
                <span className="block">
                  <span className="relative inline-block">
                    {slide.highlight}
                    <span className="absolute -bottom-2 left-0 h-[10px] w-full rounded-full bg-fuchsia-400/35 blur-[0.5px]" />
                  </span>
                </span>
              )}
            </h1>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href={slide.href}
                className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
              >
                {slide.ctaLabel ?? "Ver catálogo"}
              </Link>

              <Link
                href="/quote"
                className="inline-flex w-fit items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Ver mi cotización
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/75 max-w-xl">
              Cotiza por mayoreo. El descuento depende del volumen total y
              disponibilidad.
            </p>
          </div>
        </div>
      </div>

      {/* Arrows (mobile + desktop) */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-3 md:px-4 pointer-events-none">
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior"
          className="pointer-events-auto hidden md:flex h-10 w-10 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/15 transition items-center justify-center"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Siguiente"
          className="pointer-events-auto hidden md:flex h-10 w-10 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/15 transition items-center justify-center"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 md:bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur border border-white/10">
          {safeSlides.map((_, i) => {
            const active = i === clampedIndex;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Ir a slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={
                  "h-3 rounded-full transition-all " +
                  (active
                    ? "w-8 bg-white"
                    : "w-3 bg-white/45 hover:bg-white/65")
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}