import type { QuoteCustomerInfo } from "@/modules/common/lib/quote";
import type { QuoteItem } from "@/modules/quote/context/QuoteContext";
import type {
  CreateQuoteRequestPayload,
  FrontendQuoteItem,
} from "@/modules/quote/services/types";

export function mapQuoteItemsForSubmission(items: QuoteItem[]): FrontendQuoteItem[] {
  return items.map((item) => {
    const size = item.variant?.size?.trim() ?? "";
    const color = item.variant?.color?.trim() ?? "";

    if (!size || !color) {
      throw new Error(
        `El producto "${item.product.name}" requiere talla y color para enviar la cotización.`
      );
    }

    return {
      productId: item.product.id,
      productName: item.product.name,
      productSlug: item.product.slug,
      size,
      color,
      quantity: Math.max(1, item.quantity || 1),
    };
  });
}

export function buildCreateQuoteRequestPayload(params: {
  customer: QuoteCustomerInfo;
  items: FrontendQuoteItem[];
}): CreateQuoteRequestPayload {
  const { customer, items } = params;

  return {
    customerName: customer.name.trim(),
    customerEmail: customer.email.trim() || undefined,
    customerPhone: customer.phone.trim(),
    customerCity: customer.city?.trim() || undefined,
    notes: customer.message?.trim() || undefined,
    items: items.map((item) => ({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    })),
  };
}
