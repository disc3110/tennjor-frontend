import Image from "next/image";
import { fetchProductBySlug } from "@/modules/catalog/services/catalogApi";
import { QuoteForm } from "@/modules/catalog/components/QuoteForm";
import { resolveImageUrl } from "@/modules/common/lib/image";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  if (!slug) {
    throw new Error("Missing product slug in route params");
  }

  const product = await fetchProductBySlug(slug);
  const primaryImage = resolveImageUrl(product.images?.[0]);

  return (
    <div className="page p-6 md:p-10">
      <div className="grid gap-10 md:grid-cols-2">
        <section className="flex flex-col gap-5">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-4">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.images[0].alt ?? product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-3"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[var(--muted)]">
                Sin imagen
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {product.name}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              {product.category?.name ?? "Sin categoría"}
            </p>
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
              {product.description}
            </p>
          )}
        </section>

        <section>
          <div className="card p-6 md:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-semibold tracking-tight">
                Solicitar cotización por mayoreo
              </h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Completa los datos y recibe precio especial según volumen.
              </p>
            </div>

            <QuoteForm product={product} />
          </div>
        </section>
      </div>
    </div>
  );
}
