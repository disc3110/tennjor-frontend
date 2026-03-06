"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuote } from "@/modules/quote/context/QuoteContext";
import QuoteForm from "@/modules/quote/components/quoteForm";
import ItemsList from "@/modules/quote/components/itemsList";
import type { QuoteCustomerInfo } from "@/modules/common/lib/quote";

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
        <ItemsList
          items={items}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
          clear={clear}
        />

        {/* Customer form */}
        <aside className="lg:col-span-1">
          <QuoteForm
            customer={customer}
            setCustomer={setCustomer}
            items={items}
          />
        </aside>
      </div>
    </div>
  );
}