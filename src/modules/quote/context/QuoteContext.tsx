"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product, ProductVariant } from "../../catalog/services/types";

export interface QuoteItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

interface QuoteContextValue {
  items: QuoteItem[];
  addItem: (item: QuoteItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const QuoteContext = createContext<QuoteContextValue | undefined>(undefined);
const STORAGE_KEY = "tennjor_quote_cart_v1";

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
    } catch (err) {
      console.warn("Failed to load quote cart from storage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Failed to save quote cart to storage", err);
    }
  }, [items]);

  const addItem = (item: QuoteItem) => {
    
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === item.product.id);

      if (existing) {
        return prev.map((i) =>
          i.product.id === item.product.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  };

  const clear = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <QuoteContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return context;
}