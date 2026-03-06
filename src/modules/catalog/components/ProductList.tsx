"use client";

import Link from "next/link";
import { BULK_DISCOUNT_TIERS } from "@/config/bulkDiscounts";
import type { Product } from "../services/types";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (!products.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[var(--muted)]">
          No hay productos disponibles.
        </p>
      </div>
    );
  }

  const maxDiscount = BULK_DISCOUNT_TIERS.length
    ? Math.max(...BULK_DISCOUNT_TIERS.map((t) => t.discountPercent))
    : null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="group card overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          {/* Image */}
          <Link href={`/products/${product.slug}`} className="block">
            <div className="aspect-square bg-[var(--card-2)] overflow-hidden">
              {product.images[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt ?? product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-[var(--muted)]">
                  Sin imagen
                </div>
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold tracking-tight">
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:underline"
                >
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

            <Link
              href={`/products/${product.slug}`}
              className="mt-3 inline-flex justify-center rounded-full border border-[var(--foreground)]/20 bg-[var(--card)] px-4 py-2 text-xs font-medium text-[var(--foreground)] hover:border-[var(--foreground)]/35 hover:bg-[var(--card-2)] transition-colors"
            >
              Ver detalles
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
