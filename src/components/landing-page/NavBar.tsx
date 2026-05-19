"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import logoImg from "@/imports/IMG_8335.jpeg";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
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
        "sticky top-0 z-50 bg-background",
        "transition-all duration-300",
        scrolled
          ? "border-b border-border shadow-[0_2px_24px_rgba(0,0,0,0.06)]"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-300 px-8">
        <div className="flex h-18 items-center justify-between">
          {/* ── LOGO ── */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 no-underline"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[10px] border border-[#f0dde4] shadow-[0_2px_8px_rgba(122,34,64,0.10)]">
              <Image
                src={logoImg}
                alt="Karisimbi Real Estate"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="leading-none">
              <span className="font-heading block text-[22px] font-bold tracking-[0.04em] text-primary">
                KARISIMBI
              </span>
              <span className="block mt-0.5 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Real Estate
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="hidden items-center gap-9 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={[
                    "nav-link relative text-[13px] uppercase tracking-[0.06em] no-underline",
                    "transition-colors duration-200",
                    "after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full",
                    "after:origin-left after:scale-x-0 after:rounded-sm after:bg-primary",
                    "after:transition-transform after:duration-250 hover:after:scale-x-100",
                    isActive
                      ? "font-medium text-primary after:scale-x-100"
                      : "font-normal text-foreground/70 hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ── DESKTOP CTA BUTTONS ── */}
          <div className="hidden items-center gap-2.5 md:flex">
            <Button
              variant="outline"
              asChild
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground
                         text-[12px] uppercase tracking-[0.1em] font-medium px-5 py-[9px] h-auto
                         transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(122,34,64,0.22)]"
            >
              <Link href="/book-visit">Property Visits</Link>
            </Button>

            <Button
              asChild
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/85
                         text-[12px] uppercase tracking-[0.1em] font-medium px-5 py-[10px] h-auto
                         shadow-[0_2px_10px_rgba(122,34,64,0.18)]
                         transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(122,34,64,0.30)]"
            >
              <Link href="/sell-property">Sell Property</Link>
            </Button>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex items-center justify-center rounded-lg p-1.5 text-foreground/70
                       transition-colors hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div className="animate-[slideDown_0.22s_ease_forwards] border-t border-border bg-background px-8 pb-7 pt-5 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={[
                    "rounded-lg px-3 py-[11px] text-[13px] uppercase tracking-[0.08em] no-underline",
                    "transition-all duration-[180ms] hover:pl-5",
                    isActive
                      ? "bg-[#fdf5f7] font-medium text-primary"
                      : "font-normal text-foreground/70 hover:text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile CTA buttons */}
            <div className="mt-3.5 flex flex-col gap-2.5">
              <Button
                variant="outline"
                asChild
                className="h-auto rounded-full border-primary py-3 text-[12px] uppercase
                           tracking-[0.1em] font-medium text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/book-visit">Property Visits</Link>
              </Button>

              <Button
                asChild
                className="h-auto rounded-full bg-primary py-3 text-[12px] uppercase
                           tracking-[0.1em] font-medium text-primary-foreground hover:bg-primary/85
                           shadow-[0_2px_10px_rgba(122,34,64,0.18)]"
              >
                <Link href="/sell-property">Sell Property</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
