export interface FrontendQuoteItem {
  productId: string;
  productName: string;
  productSlug: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CreateQuoteRequestPayload {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerCity?: string;
  notes?: string;
  items: Array<{
    productId: string;
    size: string;
    color: string;
    quantity?: number;
  }>;
}

export interface QuoteRequestItemResponse {
  id: string;
  quoteRequestId: string;
  productId: string;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  size: string;
  color: string;
  quantity: number;
  createdAt: string;
}

export interface QuoteRequestResponseData {
  id: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  customerCity?: string | null;
  notes?: string | null;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  items: QuoteRequestItemResponse[];
}

export interface CreateQuoteRequestResponse {
  message: string;
  data: QuoteRequestResponseData;
}

export type QuoteSubmitState = "idle" | "submitting" | "success" | "error";
