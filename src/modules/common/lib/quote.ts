import type { Product, ProductVariant } from "../../catalog/services/types";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
const QUOTE_EMAIL = process.env.NEXT_PUBLIC_QUOTE_EMAIL;

export interface QuoteCustomerInfo {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface QuoteRequestParams {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  customer: QuoteCustomerInfo;
  productUrl: string;
}

export function buildQuoteMessage(params: QuoteRequestParams) {
  const { product, variant, quantity, customer, productUrl } = params;

  const lines = [
    "Hola, me gustaría solicitar una cotización por mayoreo 👟",
    "",
    "Datos del cliente:",
    `Nombre: ${customer.name}`,
    `Email: ${customer.email}`,
    `Teléfono: ${customer.phone}`,
    "",
    "Producto:",
    `Nombre: ${product.name}`,
    variant
      ? `Variante: Talla ${variant.size} - Color ${variant.color}`
      : "Variante: (no especificada)",
    `Cantidad: ${quantity}`,
    `Link: ${productUrl}`,
  ];

  if (customer.message && customer.message.trim().length > 0) {
    lines.push("", "Mensaje adicional:", customer.message.trim());
  }

  lines.push("", "¿Me puedes compartir precio y tiempos de entrega?");

  return lines.join("\n");
}

export function buildWhatsAppQuoteUrl(params: QuoteRequestParams) {
  if (!WHATSAPP_PHONE) {
    throw new Error("NEXT_PUBLIC_WHATSAPP_PHONE is not configured");
  }
  const message = buildQuoteMessage(params);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}

export function buildMailtoQuoteUrl(params: QuoteRequestParams) {
  if (!QUOTE_EMAIL) {
    throw new Error("NEXT_PUBLIC_QUOTE_EMAIL is not configured");
  }

  const subject = `Cotización mayoreo - ${params.product.name}`;
  const body = buildQuoteMessage(params);

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `mailto:${QUOTE_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
}
