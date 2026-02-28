"use client";

import Link from "next/link";
import type { Product } from "../services/types";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (!products.length) {
    return <p className="text-center text-gray-500">No hay productos disponibles.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="border rounded-lg p-4 flex flex-col gap-2"
        >
          <Link href={`/products/${product.slug}`}>
            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
              {product.images[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt ?? product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1">
            <h3 className="font-semibold">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className="text-sm text-gray-500">
              {product.category?.name ?? "Sin categoría"}
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="mt-2 inline-flex justify-center rounded bg-gray-900 text-white text-sm py-1.5 hover:bg-black"
          >
            Ver detalles
          </Link>
        </article>
      ))}
    </div>
  );
}
