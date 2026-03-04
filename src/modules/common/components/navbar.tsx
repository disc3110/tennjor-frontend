

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuote } from "@/modules/quote/context/QuoteContext";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, label, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        isActive
          ? "text-black border-b border-black"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { items } = useQuote();
  const [open, setOpen] = useState(false);

  const quoteCount = items.length;

  const handleClose = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2" onClick={handleClose}>
          <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold tracking-tight">
            C
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              Concord
            </span>
            <span className="text-[11px] text-gray-500">
              México · Calzado por mayoreo
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink href="/" label="Inicio" />
          <NavLink href="/catalog" label="Catálogo" />
          <NavLink href="/quote" label="Cotización" />

          <Link
            href="/quote"
            className="relative inline-flex items-center gap-2 rounded-full border border-gray-900 px-3 py-1.5 text-xs font-medium hover:bg-gray-900 hover:text-white transition-colors"
          >
            <span>Ver cotización</span>
            {quoteCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-semibold text-white">
                {quoteCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex flex-col gap-[3px]">
            <span className="h-[2px] w-4 bg-gray-800" />
            <span className="h-[2px] w-4 bg-gray-800" />
          </div>
        </button>
      </nav>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
            <NavLink href="/" label="Inicio" onClick={handleClose} />
            <NavLink href="/catalog" label="Catálogo" onClick={handleClose} />
            <NavLink href="/quote" label="Cotización" onClick={handleClose} />

            <Link
              href="/quote"
              onClick={handleClose}
              className="mt-2 inline-flex w-full items-center justify-between rounded-full border border-gray-900 px-3 py-2 text-xs font-medium hover:bg-gray-900 hover:text-white transition-colors"
            >
              <span>Ver cotización</span>
              {quoteCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-semibold text-white">
                  {quoteCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}