"use client";

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
          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
            {product.images[0] ? (
              // Más adelante optimizamos con <Image />
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
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">
            {product.category?.name ?? "Sin categoría"}
          </p>
          {/* Aquí luego irá un botón tipo "Solicitar cotización" */}
        </article>
      ))}
    </div>
  );
}
