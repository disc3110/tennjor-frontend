"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuote } from "@/modules/quote/context/QuoteContext";
import { useNavbarVisibility } from "@/app/providers";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, label, onClick }: NavLinkProps) {
  const pathname = usePathname();

  

  const isActive = useMemo(() => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }, [href, pathname]);


  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        "relative text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition-colors"
      }
    >
      <span>{label}</span>
      <span
        className={
          "pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[var(--foreground)] transition-transform duration-200 " +
          (isActive ? "scale-x-100" : "scale-x-0")
        }
        style={{ transformOrigin: "left" }}
      />
    </Link>
  );
}

function QuotePill({ count }: { count: number }) {
  return (
    <Link
      href="/quote"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--foreground)]/20 bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:border-[var(--foreground)]/35 hover:bg-[var(--card-2)] transition-colors"
    >
      <span>Ver cotización</span>
      {count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const { navbarHidden } = useNavbarVisibility();
  const pathname = usePathname();
  const { items } = useQuote();
  // Track the pathname where the menu was opened so it auto-closes on navigation
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);

  if (navbarHidden) return null;
  const open = openOnPath === pathname;

  const quoteCount = items.length;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081225]/80 backdrop-blur supports-[backdrop-filter]:bg-[#081225]/70">
      <div className="container-page">
        <nav className="flex items-center justify-between py-3 md:py-4">
          {/* Brand */}
          <Link href="/" className="group inline-flex items-center gap-3">
            <Image
              src="/concord-logo.png"
              alt="Concord"
              width={120}
              height={40}
              className="h-9 w-auto object-contain transition-transform group-hover:scale-[1.03]"
              priority
            />

            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]">
                Concord RM
              </span>
              <span className="text-[11px] text-[var(--muted)]">
                México · Calzado por mayoreo
              </span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-7 md:flex">
            <NavLink href="/" label="Inicio" />
            <NavLink href="/catalog" label="Catálogo" />
            <NavLink href="/quote" label="Cotización" />
            <QuotePill count={quoteCount} />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <QuotePill count={quoteCount} />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--card-2)] transition-colors"
              onClick={() => setOpenOnPath((prev) => (prev === pathname ? null : pathname))}
              aria-label={open ? "Close navigation" : "Open navigation"}
            >
              <span className="sr-only">Toggle navigation</span>
              {open ? (
                <span className="text-lg leading-none">×</span>
              ) : (
                <div className="flex flex-col gap-[4px]">
                  <span className="h-[2px] w-4 bg-[var(--foreground)]/80" />
                  <span className="h-[2px] w-4 bg-[var(--foreground)]/80" />
                </div>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] md:hidden">
          <div className="container-page py-3">
            <div className="flex flex-col gap-4">
              <NavLink href="/" label="Inicio" onClick={() => setOpenOnPath(null)} />
              <NavLink href="/catalog" label="Catálogo" onClick={() => setOpenOnPath(null)} />
              <NavLink href="/quote" label="Cotización" onClick={() => setOpenOnPath(null)} />

              <div className="h-px w-full bg-[var(--border)]" />

              <p className="text-xs text-[var(--muted)]">
                Cotiza por WhatsApp o correo. Sin precios públicos.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}