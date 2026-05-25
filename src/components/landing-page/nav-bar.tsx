"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/about-us", label: "About" },
  { path: "/properties", label: "Properties" },
  { path: "/services", label: "Services" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  return (
    <nav
      className={[
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 backdrop-blur-2xl border-b border-black/6 shadow-[0_4px_40px_rgba(0,0,0,0.07)]"
          : "bg-white/95 border-b border-black/6",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3">
          {/* ── LOGO ── */}
          <Link
            href="/"
            className="flex items-center gap-3 no-underline group shrink-0 min-w-0"
          >
            <Image
              src="/logo-blak.png"
              alt="Karisimbi Real Estate"
              width={52}
              height={52}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />

            <div className="flex flex-col leading-none">
              <span className="font-heading text-[18px] font-bold tracking-widest text-primary">
                KARISIMBI
              </span>
              <span className="mt-1.25 text-[8.5px] font-medium uppercase tracking-[0.32em] text-primary/50">
                Real Estate
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={[
                    "relative px-4 py-2 rounded-full text-[12px] font-semibold uppercase tracking-widest no-underline",
                    "transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/8"
                      : "text-black/45 hover:text-black/80 hover:bg-black/4",
                  ].join(" ")}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-primary/70" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── DESKTOP CTAs ── */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-10 px-4 sm:px-5 rounded-full
                         border border-black/15 bg-transparent
                         text-[11px] font-semibold uppercase tracking-widest text-black/60
                         transition-all duration-200
                         hover:border-primary/40 hover:text-primary hover:bg-primary/5
                         no-underline"
            >
              Login
            </Link>

            <Link
              href="/sell-property"
              className="inline-flex items-center justify-center h-10 px-4 sm:px-5 rounded-full
                         border border-black/15 bg-transparent
                         text-[11px] font-semibold uppercase tracking-widest text-black/60
                         transition-all duration-200
                         hover:border-primary/40 hover:text-primary hover:bg-primary/5
                         no-underline"
            >
               sell-propery
            </Link>

            <Link
              href="/book-visit"
              className="inline-flex items-center justify-center h-10 px-4 sm:px-5 rounded-full
                         bg-primary text-white
                         text-[11px] font-bold uppercase tracking-widest
                         shadow-[0_2px_16px_rgba(122,34,64,0.25)]
                         transition-all duration-200
                         hover:bg-primary/90 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(122,34,64,0.35)]
                         no-underline"
            >
              property visit 
            </Link>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full
                       border border-black/10 text-black/50
                       transition-all duration-200 hover:border-black/20 hover:text-black/80
                       md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div
          className="border-t border-black/6 bg-white/95 backdrop-blur-2xl
                     px-6 pb-7 pt-4 md:hidden
                     animate-[slideDown_0.22s_ease_forwards]"
        >
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={[
                    "flex items-center gap-2.5 rounded-xl px-4 py-3",
                    "text-[12px] font-semibold uppercase tracking-widest no-underline",
                    "transition-all duration-200",
                    isActive
                      ? "bg-primary/8 text-primary"
                      : "text-black/50 hover:text-black/80 hover:bg-black/4",
                  ].join(" ")}
                >
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-4 flex flex-col gap-2.5 border-t border-black/6 pt-5">
              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-full
                           border border-black/12 text-[11px] font-semibold uppercase
                           tracking-widest text-black/60 no-underline
                           transition-all duration-200 hover:border-primary/40 hover:text-primary"
              >
                Login
              </Link>

              <Link
                href="/sell-property"
                className="flex h-12 items-center justify-center rounded-full
                           border border-black/12 text-[11px] font-semibold uppercase
                           tracking-widest text-black/60 no-underline
                           transition-all duration-200 hover:border-primary/40 hover:text-primary"
              >
                sell-propery
              </Link>

              <Link
                href="/book-visit"
                className="flex h-12 items-center justify-center rounded-full
                           bg-primary text-white text-[11px] font-bold uppercase
                           tracking-widest no-underline
                           shadow-[0_2px_16px_rgba(122,34,64,0.25)]
                           transition-all duration-200 hover:bg-primary/90"
              >
                 property visit 
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}