"use client";

import Link from "next/link";

import type { QuoteItem } from "@/modules/quote/context/QuoteContext";

import ItemsCard from "./itemsCard";

interface ItemsListProps {
  items: QuoteItem[];
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export default function ItemsList({
  items,
  removeItem,
  updateQuantity,
  clear,
}: ItemsListProps) {
  return (
    <section className="lg:col-span-2">
      <div className="space-y-4">
        {items.map((item) => (
          <ItemsCard
            key={item.product.id}
            item={item}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--card-2)]"
        >
          Seguir viendo catálogo
        </Link>

        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--card-2)]"
        >
          Vaciar cotización
        </button>
      </div>
    </section>
  );
}
