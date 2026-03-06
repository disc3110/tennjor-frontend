"use client";

import { useMemo, useState } from "react";
import { useQuote } from "@/modules/quote/context/QuoteContext";
import type { Product, ProductVariant } from "../services/types";

interface QuoteFormProps {
  product: Product;
  productUrl: string;
}

export function QuoteForm({ product, productUrl }: QuoteFormProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState<number>(10);

  const [addedFlash, setAddedFlash] = useState(false);

  const { addItem } = useQuote();

  const selectedVariant: ProductVariant | null = useMemo(() => {
    return product.variants.find((v) => v.id === selectedVariantId) ?? null;
  }, [product.variants, selectedVariantId]);

  const canAdd = !!selectedVariant && quantity > 0;

  const handleAddToQuote = () => {
    if (!canAdd) return;

    addItem({
      product,
      variant: selectedVariant,
      quantity,
    });

    setAddedFlash(true);
    window.setTimeout(() => setAddedFlash(false), 1500);
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddToQuote();
      }}
    >
      {/* Variantes */}
      {product.variants.length > 0 && (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[var(--foreground)]">
            Selecciona talla
          </label>
          <select
            className={inputClass}
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                Talla {variant.size} - {variant.color}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cantidad */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-[var(--foreground)]">
          Cantidad aproximada (pares)
        </label>
        <input
          type="number"
          min={1}
          className={inputClass}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 0)}
        />
        <p className="text-[11px] text-[var(--muted)]">
          El descuento final se confirma según volumen en tu cotización.
        </p>
      </div>

      <div className="h-px w-full bg-[var(--border)]" />


      {/* Actions */}
      <div className="pt-2 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleAddToQuote}
            disabled={!canAdd}
            className="w-full rounded-full border border-[var(--foreground)]/20 bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--foreground)]/35 hover:bg-[var(--card-2)] transition-colors disabled:opacity-50"
          >
            Agregar a cotización
          </button>
        </div>

        <div className="min-h-[18px]">
          {addedFlash && (
            <p className="text-xs text-emerald-700">
              Agregado a tu cotización ✅
            </p>
          )}
        </div>

        {!canAdd && (
          <p className="text-[11px] text-[var(--muted)]">
            Para agregar a la cotización: variante y cantidad.
          </p>
        )}
      </div>
    </form>
  );
}