"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { BULK_DISCOUNT_TIERS } from "@/config/bulkDiscounts";
import { fetchCategories, fetchProducts } from "@/modules/catalog/services/catalogApi";
import type { Category, Product } from "@/modules/catalog/services/types";
import { useQuote } from "@/modules/quote/context/QuoteContext";

export default function CatalogPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = useMemo(() => {
    if (!category) return null;
    return categories.find((c) => c.slug === category) ?? null;
  }, [categories, category]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [cats, prods] = await Promise.all([
          categories.length ? Promise.resolve(categories) : fetchCategories(),
          fetchProducts(category || undefined),
        ]);

        if (cancelled) return;
        if (!categories.length) setCategories(cats);
        setProducts(prods);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Error cargando catálogo");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <main className="min-h-screen px-4 py-10 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {activeCategory ? `Categoría: ${activeCategory.name}` : "Todas las categorías"}
        </p>
      </header>

      {categories.length > 0 && (
        <nav className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/catalog"
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              !category
                ? "bg-[var(--foreground)] text-white border-transparent"
                : "border-[var(--foreground)]/20 bg-[var(--card)] hover:bg-[var(--card-2)]"
            }`}
          >
            All
          </Link>

          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalog?category=${encodeURIComponent(c.slug)}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                c.slug === category
                  ? "bg-[var(--foreground)] text-white border-transparent"
                  : "border-[var(--foreground)]/20 bg-[var(--card)] hover:bg-[var(--card-2)]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-[var(--muted)]">Cargando…</div>
      ) : (
        <ProductList products={products} />
      )}
    </main>
  );
}

interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  const { addItem } = useQuote();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedSizeByProduct, setSelectedSizeByProduct] = useState<Record<string, string>>({});

  if (!products.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[var(--muted)]">No hay productos disponibles.</p>
      </div>
    );
  }

  const maxDiscount = BULK_DISCOUNT_TIERS.length
    ? Math.max(...BULK_DISCOUNT_TIERS.map((t) => t.discountPercent))
    : null;

  const handleQuickAdd = (product: Product) => {
    const selectedSize = selectedSizeByProduct[product.id];
    const variant =
      product.variants?.find((item) => item.size === selectedSize) ?? product.variants?.[0] ?? null;

    addItem({
      product,
      variant,
      quantity: 10,
    });

    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => {
        const img = product.images?.[0];
        const sizeOptions = Array.from(new Set(product.variants?.map((variant) => variant.size) ?? []));
        const selectedSize = selectedSizeByProduct[product.id] ?? sizeOptions[0] ?? "";

        return (
          <article
            key={product.id}
            className="group card overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <div className="relative">
              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square bg-[var(--card-2)] overflow-hidden">
                  {img ? (
                    <Image
                      src={img.url}
                      alt={img.alt ?? product.name}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[var(--muted)]">
                      Sin imagen
                    </div>
                  )}
                </div>
              </Link>

              <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block">
                <div className="pointer-events-auto grid grid-cols-[120px_1fr] gap-2">
                  <select
                    value={selectedSize}
                    onChange={(e) =>
                      setSelectedSizeByProduct((prev) => ({
                        ...prev,
                        [product.id]: e.target.value,
                      }))
                    }
                    className="rounded-full border border-white/30 bg-black/70 px-3 py-2 text-xs font-medium text-white outline-none backdrop-blur-sm"
                  >
                    {sizeOptions.map((size) => (
                      <option key={size} value={size} className="text-black">
                        Talla {size}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="w-full rounded-full bg-black/75 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black"
                  >
                    Agregar a cotización
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold tracking-tight">
                  <Link href={`/products/${product.slug}`} className="hover:underline">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  {product.category?.name ?? "Sin categoría"}
                </p>
              </div>

              {maxDiscount !== null && (
                <div className="mt-1 inline-flex w-fit items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  Hasta {maxDiscount}% descuento por mayoreo
                </div>
              )}

              <div className="min-h-[18px]">
                {addedId === product.id && (
                  <p className="text-[11px] text-emerald-700">Agregado ✅</p>
                )}
              </div>

              <div className="mt-1 grid grid-cols-2 gap-2">
                <select
                  value={selectedSize}
                  onChange={(e) =>
                    setSelectedSizeByProduct((prev) => ({
                      ...prev,
                      [product.id]: e.target.value,
                    }))
                  }
                  className="rounded-full border border-[var(--foreground)]/20 bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--foreground)] outline-none md:hidden"
                >
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      Talla {size}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleQuickAdd(product)}
                  className="inline-flex items-center justify-center rounded-full bg-black/80 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-black md:hidden"
                >
                  + Cotizar
                </button>

                <Link
                  href={`/products/${product.slug}`}
                  className="col-span-2 inline-flex justify-center rounded-full border border-[var(--foreground)]/20 bg-[var(--card)] px-4 py-2 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]/35 hover:bg-[var(--card-2)] md:col-span-2"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
