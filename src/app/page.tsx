"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchCategories } from "@/modules/catalog/services/catalogApi";
import type { Category } from "@/modules/catalog/services/types";
import {
  CategoryHeroCarousel,
  type CategoryHeroSlide,
} from "@/modules/catalog/components/CategoryHeroCarousel";
import { useNavbarVisibility } from "@/app/providers";
import { CategoryProductsRow } from "@/modules/catalog/components/CategoryProductsRow";
import { HowItWorks } from "@/modules/company/components/how-it-works";

export default function HomePage() {
  const { setNavbarHidden } = useNavbarVisibility();
  const heroRef = useRef<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchCategories();
        if (!mounted) return;
        setCategories(data ?? []);
      } catch (e) {
        console.error(e);
        if (mounted) setError("No se pudieron cargar las categorías.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Hide navbar while hero is prominently visible
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNavbarHidden(entry.isIntersecting);
      },
      { threshold: 0.55 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [setNavbarHidden]);

  const slides: CategoryHeroSlide[] = useMemo(() => {
    return categories.map((c) => ({
      eyebrow: "Concord México",
      title: "CATÁLOGO",
      highlight: c.name.toUpperCase(),
      imageWebUrl: c.imageWebUrl ?? "",
      imageMobileUrl: c.imageMobileUrl ?? undefined,
      href: `/catalog?category=${encodeURIComponent(c.slug)}`,
      ctaLabel: "Ver colección",
    }));
  }, [categories]);

  return (
    <div>
      {/* Full-bleed hero (break out of container from layout) */}
      <div
        id="hero"
        ref={heroRef}
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
      >
        {loading ? (
          <div className="h-[70vh] md:h-[calc(100vh-96px)] flex items-center justify-center bg-[var(--card)] border-y border-[var(--border)]">
            <p className="text-sm text-[var(--muted)]">Cargando categorías…</p>
          </div>
        ) : error ? (
          <div className="h-[70vh] md:h-[calc(100vh-96px)] flex items-center justify-center bg-[var(--card)] border-y border-[var(--border)]">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <CategoryHeroCarousel
            slides={slides}
            intervalMs={4000}
            className="rounded-none border-0"
          />
        )}
      </div>

      <HowItWorks />

      <section className="mt-10">

        {/* Carruseles por categoría (ya filtradas en backend) */}
        <div className="mt-8 space-y-2">
          {categories.map((cat) => (
            <CategoryProductsRow
              key={cat.id}
              category={cat}
              limit={5}
              // onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
