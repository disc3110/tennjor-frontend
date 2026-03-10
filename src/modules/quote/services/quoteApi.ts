import { apiPost } from "@/modules/common/lib/fetcher";
import type {
  CreateQuoteRequestPayload,
  CreateQuoteRequestResponse,
} from "@/modules/quote/services/types";

export async function createQuoteRequest(payload: CreateQuoteRequestPayload) {
  return apiPost<CreateQuoteRequestResponse, CreateQuoteRequestPayload>(
    "/quote-requests",
    payload
  );
}
