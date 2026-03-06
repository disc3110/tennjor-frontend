"use client";

import type { QuoteCustomerInfo } from "@/modules/common/lib/quote";
import {
  buildMailtoMultiQuoteUrl,
  buildMultiQuoteMessage,
  buildWhatsAppMultiQuoteUrl,
} from "@/modules/common/lib/multiQuote";
import type { QuoteItem } from "@/modules/quote/context/QuoteContext";

interface QuoteFormProps {
  customer: QuoteCustomerInfo;
  setCustomer: React.Dispatch<React.SetStateAction<QuoteCustomerInfo>>;
  items: QuoteItem[];
}

export default function QuoteForm({ customer, setCustomer, items }: QuoteFormProps) {
  const canSend =
    items.length > 0 &&
    customer.name.trim().length > 0 &&
    customer.email.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    items.every((i) => i.quantity > 0);

  const message = buildMultiQuoteMessage({ customer, items });

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

  return (
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
          onClick={() => window.open(buildWhatsAppMultiQuoteUrl(message), "_blank")}
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
  );
}
