"use client";

import Image from "next/image";
import Link from "next/link";

import { resolveImageUrl } from "@/modules/common/lib/image";
import type { QuoteItem } from "@/modules/quote/context/QuoteContext";

interface ItemsCardProps {
  item: QuoteItem;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export default function ItemsCard({
  item,
  removeItem,
  updateQuantity,
}: ItemsCardProps) {
  const img = item.product.images?.[0];
  const imageUrl = resolveImageUrl(img);

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-white p-2">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={img.alt ?? item.product.name}
              fill
              sizes="80px"
              className="object-contain p-1"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[11px] text-[var(--muted)]">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold tracking-tight">{item.product.name}</p>
              {item.variant && (
                <p className="mt-0.5 text-sm text-[var(--muted)]">
                  Talla {item.variant.size} · {item.variant.color}
                </p>
              )}
              <Link
                href={`/products/${item.product.slug}`}
                className="mt-1 inline-flex text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                Ver producto
              </Link>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.product.id)}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs text-[var(--muted)]">Cantidad</label>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.product.id, Number(e.target.value) || 1)
                }
                className="w-28 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              />
            </div>

            <p className="text-[11px] text-[var(--muted)]">
              Sin precio público · descuento según volumen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
