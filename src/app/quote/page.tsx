"use client";

import { useQuote } from "@/modules/quote/context/QuoteContext";

export default function QuotePage() {
  const { items, removeItem, updateQuantity, clear } = useQuote();

  console.log("Quote items:", items);

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>No hay productos en tu cotización.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Tu solicitud de cotización
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <h2 className="font-semibold">{item.product.name}</h2>
              {item.variant && (
                <p className="text-sm text-gray-500">
                  Talla {item.variant.size} – {item.variant.color}
                </p>
              )}
            </div>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.product.id, Number(e.target.value))
              }
              className="w-24 border rounded px-2 py-1"
            />

            <button
              onClick={() => removeItem(item.product.id)}
              className="text-red-600 text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={clear}
          className="border px-4 py-2 rounded"
        >
          Vaciar
        </button>
      </div>
    </main>
  );
}