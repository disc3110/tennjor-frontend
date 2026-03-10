import type { QuoteCustomerInfo } from "@/modules/common/lib/quote";
import type { FrontendQuoteItem } from "@/modules/quote/services/types";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

function normalizeWhatsAppPhone(rawPhone?: string) {
  if (!rawPhone) return "";
  return rawPhone.replace(/[^\d]/g, "");
}

export function buildWhatsAppQuoteMessage(params: {
  customer: QuoteCustomerInfo;
  items: FrontendQuoteItem[];
  quoteRequestId?: string;
}) {
  const { customer, items, quoteRequestId } = params;

  const lines: string[] = [
    "Hola, me gustaría solicitar una cotización por mayoreo 👟",
    "",
    "Datos del cliente:",
    `Nombre: ${customer.name.trim()}`,
    `Email: ${customer.email.trim()}`,
    `Teléfono: ${customer.phone.trim()}`,
  ];

  if (customer.city?.trim()) {
    lines.push(`Ciudad: ${customer.city.trim()}`);
  }

  lines.push("", "Productos solicitados:");

  items.forEach((item, idx) => {
    lines.push(
      "",
      `${idx + 1}) ${item.productName}`,
      `   Variante: Talla ${item.size} - Color ${item.color}`,
      `   Cantidad: ${item.quantity} pares`,
      `   Link: /products/${item.productSlug}`
    );
  });

  if (customer.message?.trim()) {
    lines.push("", "Mensaje adicional:", customer.message.trim());
  }

  if (quoteRequestId) {
    lines.push("", `Folio de solicitud: ${quoteRequestId}`);
  }

  lines.push("", "¿Me puedes compartir precio y tiempos de entrega?");

  return lines.join("\n");
}

export function buildWhatsAppQuoteUrl(message: string) {
  const normalizedPhone = normalizeWhatsAppPhone(WHATSAPP_PHONE);

  if (!normalizedPhone) {
    throw new Error(
      "Número de WhatsApp no configurado. Revisa NEXT_PUBLIC_WHATSAPP_PHONE."
    );
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
