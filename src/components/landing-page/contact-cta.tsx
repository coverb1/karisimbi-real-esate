"use client";

import Link from "next/link";
import { AnimatedSection } from "../animations/AnimatedSection";

export function ContactCta() {
  return (
    <section
      className="relative overflow-hidden py-24 bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800')",
      }}
    >
      {/* Black gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/92 via-black/86 to-black/84" />

      <AnimatedSection className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center text-white">
        <p className="mb-4 text-sm uppercase tracking-widest text-white/70">Get in touch</p>

        <h2 className="mb-6 text-[clamp(30px,4.5vw,56px)] font-serif font-semibold leading-tight">
          Ready to find your dream home?
        </h2>

        <p className="mb-8 max-w-2xl mx-auto text-lg text-white/80">
          Contact us today and let our team guide you to the perfect property in Kigali.
        </p>

        <div className="flex items-center justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition"
          >
            Contact Us
          </Link>
        </div>
      </AnimatedSection>
    </section>
  );
}
