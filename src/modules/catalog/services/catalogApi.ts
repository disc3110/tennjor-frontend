import { apiGet } from "../../common/lib/fetcher";
import type { Category, Product } from "./types";

export async function fetchCategories(): Promise<Category[]> {
  return apiGet<Category[]>("/catalog/categories");
}

export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
  return apiGet<Product[]>(`/catalog/products${query}`);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  return apiGet<Product>(`/catalog/products/${slug}`);
}