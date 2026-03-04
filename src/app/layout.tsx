import "./globals.css";
import type { ReactNode } from "react";
import { AppProviders } from "./providers";
import { Navbar } from "@/modules/common/components/navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[var(--background)] text-[var(--foreground)]">
        <AppProviders>
          <Navbar />
          <main className="page">
            <div className="container-page py-8 md:py-10">{children}</div>
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
