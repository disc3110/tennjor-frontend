"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/modules/catalog/services/types";
import { fetchProducts } from "@/modules/catalog/services/catalogApi";
import { Carousel } from "@/modules/catalog/components/Carousel";
import { ProductMiniCard } from "@/modules/catalog/components/ProductMiniCard";

// Shuffle (Fisher–Yates) para random "bien"
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Props = {
  category: Category;
  limit?: number; // default 5
  onQuickAdd?: (product: Product) => void;
};

export function CategoryProductsRow({ category, limit = 5, onQuickAdd }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const titleHref = useMemo(
    () => `/catalog?category=${encodeURIComponent(category.slug)}`,
    [category.slug]
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const all = await fetchProducts(category.slug);
        const picked = shuffle(all ?? []).slice(0, limit);
        if (mounted) setProducts(picked);
      } catch (e) {
        console.error(e);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [category.slug, limit]);

  return (
    <div className="mt-10">
      <Carousel
        title={category.name}
        titleHref={titleHref}
        rightSlot={
          <Link
            href={titleHref}
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--fg)] transition"
          >
            Ver todo →
          </Link>
        }
      >
        {loading ? (
          Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] rounded-2xl border border-[var(--border)] bg-[var(--card)] animate-pulse"
            />
          ))
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
            Sin productos.
          </div>
        ) : (
          products.map((p) => (
            <ProductMiniCard
              key={p.id}
              product={p}
              href={`/products/${
                ((p as unknown as { slug?: string }).slug || p.id) as string
              }`}
              onQuickAdd={onQuickAdd}
            />
          ))
        )}
      </Carousel>
    </div>
  );
}