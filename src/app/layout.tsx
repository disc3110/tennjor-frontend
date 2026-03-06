import type { Metadata } from "next";
import React from "react";
import { AppProviders } from "@/app/providers";
import { Navbar } from "@/modules/common/components/navbar";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Tennjor",
  description: "Tennjor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
