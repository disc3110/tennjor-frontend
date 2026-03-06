"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/modules/catalog/services/types";

type Props = {
  product: Product;
  href?: string;
  onQuickAdd?: (product: Product) => void;
};

export function ProductMiniCard({ product, href, onQuickAdd }: Props) {
  const resolvedHref =
    href ??
    `/products/${
      ((product as unknown as { slug?: string }).slug || product.id) as string
    }`;

  const img = product.images?.[0]?.url;
  const alt = product.images?.[0]?.alt || product.name;

  return (
    <Link href={resolvedHref} className="block">
      <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:shadow-md">
        <div className="relative aspect-[3/2] w-full bg-white">
          {img ? (
            <Image
              src={img}
              alt={alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 240px"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--muted)]">
              Sin imagen
            </div>
          )}

          {onQuickAdd && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd(product);
              }}
              className="absolute bottom-3 left-3 right-3 hidden items-center justify-center rounded-xl bg-black/75 px-3 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100 md:flex"
            >
              Agregar a cotización
            </button>
          )}
        </div>

        <div className="p-2">
          <p className="line-clamp-2 text-sm font-semibold leading-snug">
            {product.name}
          </p>
          {product.category?.name && (
            <p className="mt-1 text-xs text-[var(--muted)]">
              {product.category.name}
            </p>
          )}

          {onQuickAdd && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd(product);
              }}
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold transition hover:bg-zinc-50 md:hidden"
            >
              Agregar a cotización
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}