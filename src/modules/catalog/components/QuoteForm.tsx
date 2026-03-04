"use client";

import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "../services/types";
import {
  buildMailtoQuoteUrl,
  buildWhatsAppQuoteUrl,
  type QuoteCustomerInfo,
} from "../../..//modules/common/lib/quote";
import { useQuote } from "@/modules/quote/context/QuoteContext";

interface QuoteFormProps {
  product: Product;
  productUrl: string;
}

export function QuoteForm({ product, productUrl }: QuoteFormProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState<number>(10); // valor por defecto tipo “mayoreo”
  const [customer, setCustomer] = useState<QuoteCustomerInfo>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { addItem , items} = useQuote();

  const selectedVariant: ProductVariant | null = useMemo(() => {
    return product.variants.find((v) => v.id === selectedVariantId) ?? null;
  }, [product.variants, selectedVariantId]);

  const isValid =
    customer.name.trim().length > 0 &&
    customer.email.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    quantity > 0;

  const handleWhatsApp = () => {
    if (!isValid) return;

    try {
      const url = buildWhatsAppQuoteUrl({
        product,
        variant: selectedVariant,
        quantity,
        customer,
        productUrl,
      });
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al construir el enlace de WhatsApp.");
    }
  };

  const handleEmail = () => {
    if (!isValid) return;

    try {
      const url = buildMailtoQuoteUrl({
        product,
        variant: selectedVariant,
        quantity,
        customer,
        productUrl,
      });
      window.location.href = url;
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al construir el correo de cotización.");
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleWhatsApp();
      }}
    >
      {/* Variantes */}
      {product.variants.length > 0 && (
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Selecciona talla y color
          </label>
          <select
            className="w-full rounded border px-3 py-2 text-sm"
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
        <label className="block text-sm font-medium">
          Cantidad aproximada (pares)
        </label>
        <input
          type="number"
          min={1}
          className="w-full rounded border px-3 py-2 text-sm"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 0)}
        />
      </div>

      {/* Datos del cliente */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Nombre</label>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          value={customer.name}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Tu nombre completo"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full rounded border px-3 py-2 text-sm"
          value={customer.email}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="para enviarte la cotización"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Teléfono (WhatsApp)</label>
        <input
          className="w-full rounded border px-3 py-2 text-sm"
          value={customer.phone}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="ej. 55 1234 5678"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          Mensaje adicional (opcional)
        </label>
        <textarea
          className="w-full rounded border px-3 py-2 text-sm"
          rows={3}
          value={customer.message}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, message: e.target.value }))
          }
          placeholder="Ej. también estoy interesado en otros modelos, tiempos de entrega, etc."
        />
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          disabled={!isValid}
          type="button"
          onClick={() => {
            if (!selectedVariant || quantity <= 0) return;

            addItem({
              product,
              variant: selectedVariant,
              quantity,
            });

            console.log("Producto agregado a la cotización:", {
              product,
              variant: selectedVariant,
              quantity,
            });

            console.log("Items en cotización:", items);

          }}
          className="w-full rounded bg-black text-white py-2 text-sm font-semibold hover:bg-gray-800"
        >
          Agregar a cotización
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="flex-1 rounded bg-green-600 text-white py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          Enviar por WhatsApp
        </button>
        <button
          type="button"
          disabled={!isValid}
          onClick={handleEmail}
          className="flex-1 rounded border border-gray-300 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          Enviar por correo
        </button>
      </div>

      {!isValid && (
        <p className="text-xs text-gray-500">
          Completa tu nombre, email, teléfono y cantidad para enviar la
          cotización.
        </p>
      )}
    </form>
  );
}