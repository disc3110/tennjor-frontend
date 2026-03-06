import { Suspense } from "react";

import CatalogPageClient from "./catalogPageClient";

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen px-4 py-10 max-w-6xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Cargando catálogo...</p>
          </header>
        </main>
      }
    >
      <CatalogPageClient />
    </Suspense>
  );
}