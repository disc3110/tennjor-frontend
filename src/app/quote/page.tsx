"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuote } from "@/modules/quote/context/QuoteContext";
import type { QuoteCustomerInfo } from "@/modules/common/lib/quote";
import {
  buildMailtoMultiQuoteUrl,
  buildMultiQuoteMessage,
  buildWhatsAppMultiQuoteUrl,
} from "@/modules/common/lib/multiQuote";

export default function QuotePage() {
  const { items, removeItem, updateQuantity, clear } = useQuote();

  const [customer, setCustomer] = useState<QuoteCustomerInfo>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const isValid =
    items.length > 0 &&
    customer.name.trim() &&
    customer.email.trim() &&
    customer.phone.trim() &&
    items.every((i) => i.quantity > 0);

  const message = useMemo(() => {
    return buildMultiQuoteMessage({ customer, items });
  }, [customer, items]);

  if (items.length === 0) {
    return (
      <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Tu cotización está vacía</h1>
        <p className="text-gray-600 mb-6">
          Agrega productos desde el catálogo para solicitar una cotización.
        </p>
        <Link
          href="/catalog"
          className="inline-flex rounded bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800"
        >
          Ir al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Tu solicitud de cotización</h1>
        <p className="text-sm text-gray-600 mt-1">
          Revisa cantidades y envía tu solicitud por WhatsApp o correo.
        </p>
      </header>

      {/* Items */}
      <section className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <p className="font-semibold">{item.product.name}</p>
              {item.variant && (
                <p className="text-sm text-gray-500">
                  Talla {item.variant.size} – {item.variant.color}
                </p>
              )}
              <Link
                href={`/products/${item.product.slug}`}
                className="text-xs text-gray-600 underline"
              >
                Ver producto
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.product.id, Number(e.target.value) || 1)
                }
                className="w-24 border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Customer form */}
      <section className="mt-10 border rounded-lg p-5 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Tus datos</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              value={customer.name}
              onChange={(e) =>
                setCustomer((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Tu nombre completo"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Teléfono (WhatsApp)</label>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              value={customer.phone}
              onChange={(e) =>
                setCustomer((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="ej. 55 1234 5678"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded border px-3 py-2 text-sm"
              value={customer.email}
              onChange={(e) =>
                setCustomer((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="para enviarte la cotización"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-medium">
              Mensaje adicional (opcional)
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              rows={3}
              value={customer.message}
              onChange={(e) =>
                setCustomer((p) => ({ ...p, message: e.target.value }))
              }
              placeholder="Ej. ciudad, urgencia, si quieres mezclar modelos, etc."
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            disabled={!isValid}
            onClick={() => window.open(buildWhatsAppMultiQuoteUrl(message), "_blank")}
            className="flex-1 rounded bg-green-600 text-white py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            Enviar por WhatsApp
          </button>

          <button
            disabled={!isValid}
            onClick={() => {
              window.location.href = buildMailtoMultiQuoteUrl(message);
            }}
            className="flex-1 rounded border border-gray-300 py-2 text-sm font-semibold hover:bg-white disabled:opacity-50"
          >
            Enviar por correo
          </button>

          <button
            onClick={clear}
            className="sm:w-auto rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-white"
          >
            Vaciar
          </button>
        </div>

        {!isValid && (
          <p className="mt-3 text-xs text-gray-500">
            Completa nombre, teléfono, email y cantidades para enviar la cotización.
          </p>
        )}
      </section>
    </main>
  );
}