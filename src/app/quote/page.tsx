"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
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

  const totals = useMemo(() => {
    const totalPairs = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    return {
      totalItems: items.length,
      totalPairs,
    };
  }, [items]);

  const canSend =
    items.length > 0 &&
    customer.name.trim().length > 0 &&
    customer.email.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    items.every((i) => i.quantity > 0);

  const message = useMemo(() => {
    return buildMultiQuoteMessage({ customer, items });
  }, [customer, items]);

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

  if (items.length === 0) {
    return (
      <div className="py-12 md:py-16">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Tu cotización está vacía
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Agrega productos desde el catálogo para solicitar una cotización por mayoreo.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page p-6 md:p-10">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Tu solicitud de cotización
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Revisa cantidades y envía tu solicitud por WhatsApp o correo.
          </p>
        </div>

        <div className="card-soft px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-[11px] text-[var(--muted)]">Productos</span>
              <span className="font-semibold">{totals.totalItems}</span>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div className="flex flex-col">
              <span className="text-[11px] text-[var(--muted)]">Total pares</span>
              <span className="font-semibold">{totals.totalPairs}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <section className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const img = item.product.images?.[0];
              return (
                <div
                  key={item.product.id}
                  className="card p-4 sm:p-5 flex flex-col gap-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-2)]">
                      {img?.url ? (
                        <Image
                          src={img.url}
                          alt={img.alt ?? item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
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
                          <p className="font-semibold tracking-tight">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="mt-0.5 text-sm text-[var(--muted)]">
                              Talla {item.variant.size} · {item.variant.color}
                            </p>
                          )}
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="mt-1 inline-flex text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                          >
                            Ver producto
                          </Link>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <label className="text-xs text-[var(--muted)]">
                            Cantidad
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.product.id,
                                Number(e.target.value) || 1
                              )
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
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--card-2)] transition-colors"
            >
              Seguir viendo catálogo
            </Link>

            <button
              onClick={clear}
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--card-2)] transition-colors"
            >
              Vaciar cotización
            </button>
          </div>
        </section>

        {/* Customer form */}
        <aside className="lg:col-span-1">
          <div className="card p-5 sm:p-6 sticky top-[84px]">
            <h2 className="text-lg font-semibold tracking-tight">Tus datos</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Te contactaremos para confirmar disponibilidad y precio.
            </p>

            <div className="mt-5 grid gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium">Nombre</label>
                <input
                  className={inputClass}
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium">Teléfono (WhatsApp)</label>
                <input
                  className={inputClass}
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="ej. 55 1234 5678"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium">Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="para enviarte la cotización"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium">
                  Mensaje adicional (opcional)
                </label>
                <textarea
                  className={inputClass}
                  rows={4}
                  value={customer.message}
                  onChange={(e) =>
                    setCustomer((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Ej. ciudad, urgencia, si quieres mezclar modelos, etc."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                disabled={!canSend}
                onClick={() =>
                  window.open(buildWhatsAppMultiQuoteUrl(message), "_blank")
                }
                className="w-full rounded-full bg-emerald-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Enviar por WhatsApp
              </button>

              <button
                disabled={!canSend}
                onClick={() => {
                  window.location.href = buildMailtoMultiQuoteUrl(message);
                }}
                className="w-full rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--card-2)] transition-colors disabled:opacity-50"
              >
                Enviar por correo
              </button>

              {!canSend && (
                <p className="text-[11px] text-[var(--muted)]">
                  Completa nombre, teléfono y email para enviar tu cotización.
                </p>
              )}

              <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--card-2)] px-4 py-3">
                <p className="text-[11px] text-[var(--muted)]">
                  Nota: No mostramos precios públicos. El descuento depende del volumen total y disponibilidad.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}