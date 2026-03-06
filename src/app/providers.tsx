"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { QuoteProvider } from "@/modules/quote/context/QuoteContext";

type NavbarVisibilityContextValue = {
  navbarHidden: boolean;
  setNavbarHidden: (hidden: boolean) => void;
};

const NavbarVisibilityContext = createContext<NavbarVisibilityContextValue | null>(null);

export function useNavbarVisibility() {
  const ctx = useContext(NavbarVisibilityContext);
  if (!ctx) {
    throw new Error("useNavbarVisibility must be used within AppProviders");
  }
  return ctx;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Track navbar hidden state per-route so a new route defaults to "shown"
  const [hiddenByPath, setHiddenByPath] = useState<Record<string, boolean>>({});

  const navbarHidden = hiddenByPath[pathname] ?? false;

  const setNavbarHidden = useCallback(
    (hidden: boolean) => {
      setHiddenByPath((prev) => ({
        ...prev,
        [pathname]: hidden,
      }));
    },
    [pathname]
  );

  const value = useMemo(
    () => ({ navbarHidden, setNavbarHidden }),
    [navbarHidden, setNavbarHidden]
  );

  return (
    <NavbarVisibilityContext.Provider value={value}>
      <QuoteProvider>{children}</QuoteProvider>
    </NavbarVisibilityContext.Provider>
  );
}