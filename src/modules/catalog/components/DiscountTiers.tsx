import { BULK_DISCOUNT_TIERS } from "../../../config/bulkDiscounts";

function formatRange(min: number, max: number | null) {
  if (max == null) return `${min}+ pares`;
  return `${min}–${max} pares`;
}

export function DiscountTiers() {
  if (!BULK_DISCOUNT_TIERS.length) return null;

  return (
    <div className="mt-4 border rounded-lg p-3 bg-gray-50">
      <h3 className="text-sm font-semibold mb-2">
        Descuentos por volumen (referenciales)
      </h3>
      <p className="text-xs text-gray-500 mb-2">
        El descuento final se confirma en tu cotización.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {BULK_DISCOUNT_TIERS.map((tier, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-md bg-white border px-3 py-2"
          >
            <span className="font-medium">
              {formatRange(tier.minQty, tier.maxQty)}
            </span>
            <span className="text-green-700 font-semibold">
              hasta {tier.discountPercent}% off
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}