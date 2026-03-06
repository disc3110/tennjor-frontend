export interface BulkDiscountTier {
  minQty: number;
  maxQty: number | null; // null = 100+ style
  discountPercent: number;
}

export const BULK_DISCOUNT_TIERS: BulkDiscountTier[] = [
  { minQty: 6, maxQty: 15, discountPercent: 20 },
  { minQty: 16, maxQty: 30, discountPercent: 30 },
  { minQty: 31, maxQty: 100, discountPercent: 40 },
  { minQty: 101, maxQty: null, discountPercent: 60 },
];