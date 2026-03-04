import type { QuoteItem } from "@/modules/quote/context/QuoteContext";
import type { QuoteCustomerInfo } from "@/modules/common/lib/quote";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
const QUOTE_EMAIL = process.env.NEXT_PUBLIC_QUOTE_EMAIL;

export function buildMultiQuoteMessage(params: {
  customer: QuoteCustomerInfo;
  items: QuoteItem[];
  note?: string;
}) {
  const { customer, items } = params;

  const lines: string[] = [
    "Hola, me gustaría solicitar una cotización por mayoreo 👟",
    "",
    "Datos del cliente:",
    `Nombre: ${customer.name}`,
    `Email: ${customer.email}`,
    `Teléfono: ${customer.phone}`,
    "",
    "Productos solicitados:",
  ];

  items.forEach((item, idx) => {
    lines.push(
      "",
      `${idx + 1}) ${item.product.name}`,
      item.variant
        ? `   Variante: Talla ${item.variant.size} - Color ${item.variant.color}`
        : "   Variante: (no especificada)",
      `   Cantidad: ${item.quantity} pares`,
      `   Link: /products/${item.product.slug}`
    );
  });

  if (customer.message && customer.message.trim()) {
    lines.push("", "Mensaje adicional:", customer.message.trim());
  }

  lines.push("", "¿Me puedes compartir precio y tiempos de entrega?");

  return lines.join("\n");
}

export function buildWhatsAppMultiQuoteUrl(message: string) {
  if (!WHATSAPP_PHONE) throw new Error("NEXT_PUBLIC_WHATSAPP_PHONE not set");
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoMultiQuoteUrl(message: string) {
  if (!QUOTE_EMAIL) throw new Error("NEXT_PUBLIC_QUOTE_EMAIL not set");
  const subject = "Solicitud de cotización por mayoreo (multi-producto)";
  return `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(message)}`;
}