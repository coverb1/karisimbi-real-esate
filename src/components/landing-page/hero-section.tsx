"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatedSection } from "../animations/AnimatedSection";
import { ArrowUpRight, Home, Tag, CalendarCheck } from "lucide-react";

const actions = [
  { href: "/properties", icon: Home, label: "Buy Property" },
  { href: "/sell-property", icon: Tag, label: "Sell Property" },
  { href: "/book-visit", icon: CalendarCheck, label: "Property Visit" },
];

export function Hero() {
  return (
    <section className="relative min-h-[80vh] lg:min-h-screen overflow-hidden">
      {/* ── BACKGROUND IMAGE ── */}
      <Image
        src="/real-estate.jpg"
        alt="Luxury Property"
        fill
        priority
        className="object-cover object-center"
        style={{ animation: "slowZoom 18s ease-in-out infinite alternate" }}
      />

      {/* ── GRADIENT LAYERS ── */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/5" />
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-linear-to-t from-primary/25 to-transparent" />

      {/* ── MAIN CONTENT ── */}
      <div className="absolute inset-0 z-10 flex items-center">
        <AnimatedSection className="mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-12 text-left">
          {/* Hero headline — bold mixed color like Century */}
          <h1 className="mb-4 font-heading flex flex-col items-start">
            <span className="block text-[clamp(40px,6.5vw,88px)] font-bold leading-none tracking-[-0.02em] text-white">
              KARISIMBI
            </span>
            <span className="mt-3 flex items-center gap-3">
              <span className="h-0.5 w-8 rounded-full bg-primary shrink-0" />
              <span className="text-[clamp(13px,1.4vw,18px)] font-medium uppercase tracking-[0.3em] text-white/80">
                Real Estate
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-2xl text-[14px] leading-relaxed text-white/90  sm:text-[15px] md:text-[16px]">
            Exploring the possibilities of real estate in Rwanda. Find your
            dream property with Karisimbi — where every home tells a story.
          </p>

          {/* ── BOTTOM ROW ── */}
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,auto)_auto] lg:items-end">
            <Link
              href="/properties"
              className="inline-flex w-full max-w-[16rem] items-center justify-start gap-2.5 bg-white text-primary px-6 py-3 rounded-full text-sm font-medium tracking-wide no-underline transition-all duration-200 hover:bg-primary hover:text-white hover:-translate-y-px hover:shadow-md"
            >
              View Listings <ArrowUpRight size={16} />
            </Link>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
              {/* 3 pill buttons */}
              <div className="grid w-full grid-cols-2 gap-3 lg:auto-cols-max lg:grid-flow-col lg:grid">
                {actions.map(({ href, icon: Icon, label }, i) => (
                  <Link
                    key={href}
                    href={href}
                    className={[
                      "inline-flex w-full items-center justify-center gap-2.5 no-underline",
                      "rounded-full px-4 sm:px-5 h-11",
                      "text-[12px] font-semibold tracking-[0.04em] whitespace-nowrap",
                      "border transition-all duration-250",
                      "hover:-translate-y-0.5",
                      i === 1
                        ? "bg-primary border-primary text-white hover:bg-primary/85 hover:shadow-[0_8px_28px_rgba(122,34,64,0.45)]"
                        : "bg-white/10 border-white/20 text-white backdrop-blur-md hover:bg-white/18 hover:border-white/35 hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)]",
                    ].join(" ")}
                  >
                    <Icon size={14} strokeWidth={2} />
                    {label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-start gap-3 rounded-4xl border border-white/15 bg-white/10 px-4 py-3 text-left text-white backdrop-blur-sm sm:px-5 lg:ml-4">
                <span className="font-heading text-[34px] font-bold leading-none text-white">
                  120<span className="text-primary">+</span>
                </span>
                <span className="text-[10.5px] uppercase tracking-widest leading-snug text-white/75">
                  Properties
                  <br />
                  worldwide
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
