

import { DiscountTiers } from "@/modules/common/components/DiscountTiers";

export function HowItWorks() {
  return (
    <section className="card-soft p-6 md:p-8 ">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Cómo funciona
        </span>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
          Compra por mayoreo y obtén mejores descuentos entre más piezas agregues.
        </h2>

        <p className="mt-4 text-sm leading-7 text-[var(--muted)] md:text-base">
          Esta página está pensada para ventas por mayoreo. Aquí puedes explorar el
          catálogo, agregar a tu cotización los productos que te interesan y enviar
          tu solicitud para que nuestro equipo te comparta una propuesta personalizada.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-sm font-semibold">1. Explora el catálogo</div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Revisa las categorías y selecciona los modelos que más te interesen para
              tu negocio.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-sm font-semibold">2. Agrega productos a tu cotización</div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Elige los productos y cantidades aproximadas que te gustaría cotizar.
              Entre más piezas compres, mejores descuentos podrías obtener.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-sm font-semibold">3. Envíala por correo o WhatsApp</div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Manda tu cotización por el medio que prefieras y alguien de nuestro equipo
              se pondrá en contacto contigo pronto con la información final.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:p-5">
          <p className="text-sm leading-7 text-[var(--muted)] md:text-base">
            Los descuentos por volumen son referenciales y pueden variar según el modelo,
            la disponibilidad y la cantidad final solicitada. Aun así, esta tabla te da
            una buena idea del descuento que podrías recibir dependiendo del número de
            pares que agregues a tu cotización.
          </p>

          <DiscountTiers />
        </div>
      </div>
    </section>
  );
}