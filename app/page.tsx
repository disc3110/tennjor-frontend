import { fetchProducts } from "../src/modules/catalog/services/catalogApi";
import { ProductList } from "../src/modules/catalog/components/ProductList";
import { Product } from "@/src/modules/catalog/services/types";

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Tennjor – Zapatería Mayorista</h1>
        <p className="text-gray-600 mt-2">
          Catálogo de productos para venta por mayoreo. Solicita tu cotización
          personalizada por WhatsApp o correo.
        </p>
      </header>

      <section>
        <ProductList products={products} />
      </section>
    </main>
  );
}
