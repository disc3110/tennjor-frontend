"use client";

import { QuoteProvider } from "@/modules/quote/context/QuoteContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <QuoteProvider>{children}</QuoteProvider>;
}