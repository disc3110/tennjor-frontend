import { BULK_DISCOUNT_TIERS } from "../../../config/bulkDiscounts";
import Link from "next/link";

function formatRange(min: number, max: number | null) {
  if (max == null) return `${min}+ pares`;
  return `${min}–${max} pares`;
}

export function DiscountTiers() {
  if (!BULK_DISCOUNT_TIERS.length) return null;

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white md:text-lg">
            Descuentos por volumen
          </h3>
          <p className="mt-1 text-sm leading-6 text-white/70">
            Entre más pares agregues a tu cotización, mayor puede ser tu descuento.
          </p>
        </div>

        <span className="inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Referenciales
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {BULK_DISCOUNT_TIERS.map((tier, idx) => (
          <Link key={idx} href="/catalog">
            <div className="group cursor-pointer rounded-xl border border-white/10 bg-[#0f172a]/70 px-4 py-3 shadow-sm transition hover:border-emerald-400/30 hover:bg-[#111c34]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                    Cantidad
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {formatRange(tier.minQty, tier.maxQty)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                    Descuento
                  </p>
                  <p className="mt-1 text-lg font-bold text-emerald-300 md:text-xl">
                    hasta {tier.discountPercent}%
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-xs leading-6 text-white/55">
        El descuento final se confirma en tu cotización y puede variar según modelo,
        disponibilidad y volumen total solicitado.
      </p>
    </div>
  );
}