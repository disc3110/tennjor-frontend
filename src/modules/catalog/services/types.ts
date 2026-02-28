export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku?: string | null;
  isActive: boolean;
  stock?: number | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}
