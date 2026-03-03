import { fetchProductBySlug } from "../../../src/modules/catalog/services/catalogApi";
import { QuoteForm } from "../../../src/modules/catalog/components/QuoteForm";
import { DiscountTiers } from "../../../src/modules/catalog/components/DiscountTiers";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params; 
  const product = await fetchProductBySlug(slug);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"; 
  const productUrl = `${baseUrl}/products/${product.slug}`;

  return (
    <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Columna izquierda: imagen + info básica */}
        <section>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.images[0] ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-2">
            {product.category?.name ?? "Sin categoría"}
          </p>
          {product.description && (
            <p className="text-gray-700">{product.description}</p>
          )}
          <DiscountTiers/>
        </section>

        {/* Columna derecha: formulario de cotización */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Solicitar cotización por mayoreo
          </h2>
          <QuoteForm product={product} productUrl={productUrl} />
        </section>
      </div>
    </main>
  );
}