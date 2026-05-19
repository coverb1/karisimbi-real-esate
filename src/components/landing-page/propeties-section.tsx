"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "../animations/AnimatedSection";

const categories = [
  "All",
  "Houses",
  "Plots",
  "Villa",
  "Family House",
  "Penthouse",
];

const properties = [
  {
    id: 1,
    category: "Villa",
    title: "Modern Luxury Villa",
    location: "Kigali Heights",
    beds: 4,
    baths: 3,
    sqft: 3500,
    price: "RWF 450,000,000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  },
  {
    id: 2,
    category: "Family House",
    title: "Contemporary Family Home",
    location: "Nyarutarama",
    beds: 5,
    baths: 4,
    sqft: 4200,
    price: "RWF 320,000,000",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800",
  },
  {
    id: 3,
    category: "Penthouse",
    title: "Executive Penthouse",
    location: "Gacuriro",
    beds: 3,
    baths: 2,
    sqft: 2800,
    price: "RWF 280,000,000",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  },
  {
    id: 4,
    category: "Houses",
    title: "Garden View Residence",
    location: "Kimihurura",
    beds: 4,
    baths: 3,
    sqft: 3100,
    price: "RWF 210,000,000",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
  },
  {
    id: 5,
    category: "Villa",
    title: "Hillside Luxury Villa",
    location: "Rebero",
    beds: 6,
    baths: 5,
    sqft: 5200,
    price: "RWF 580,000,000",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
  },
  {
    id: 6,
    category: "Plots",
    title: "Prime Land Plot",
    location: "Kanombe",
    beds: 0,
    baths: 0,
    sqft: 8000,
    price: "RWF 95,000,000",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
  },
  {
    id: 7,
    category: "Houses",
    title: "Modern Family House",
    location: "Kacyiru",
    beds: 3,
    baths: 2,
    sqft: 2400,
    price: "RWF 175,000,000",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    id: 8,
    category: "Penthouse",
    title: "Sky Loft Penthouse",
    location: "Nyarugenge",
    beds: 4,
    baths: 3,
    sqft: 3600,
    price: "RWF 395,000,000",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
  },
  {
    id: 9,
    category: "Family House",
    title: "Serene Valley Home",
    location: "Bugesera",
    beds: 5,
    baths: 3,
    sqft: 3900,
    price: "RWF 240,000,000",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
  },
];

export function PropertiesSection() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? properties
      : properties.filter((p) => p.category === active);

  return (
    <section className="bg-white py-16 px-8 lg:px-12">
      <AnimatedSection className="mx-auto max-w-300">
        {/* ── HEADER ROW ── */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}
          <div className="mb-8">
            <h4 className="font-heading  font-black uppercase tracking-wide text-primary">
              Our Properties
            </h4>
            <p className="mt-1 text-gray-500">Discover Your Ideal Property</p>
          </div>

          {/* Right */}
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 self-start lg:self-end
                       text-[13px] font-semibold text-primary no-underline
                       border-b border-primary/40 pb-0.5
                       transition-all duration-200 hover:border-primary whitespace-nowrap"
          >
            See All Properties <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={[
                "rounded-full px-5 h-9 text-[13px] font-medium border transition-all duration-200",
                active === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/40 hover:text-primary",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── PROPERTY GRID ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white
                         no-underline shadow-sm transition-all duration-300
                         hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]"
            >
              {/* Image */}
              <div className="relative h-55 w-full overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Category badge */}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-800 backdrop-blur-sm">
                    {property.category}
                  </span>
                </div>
                {/* Arrow button */}
                <div className="absolute right-3 top-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white
                                  transition-transform duration-200 group-hover:scale-110"
                  >
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col flex-1 p-5">
                <h4 className="mb-1.5 font-bold text-gray-900 truncate">
                  {property.title}
                </h4>

                <div className="mb-4 flex items-center gap-1.5 text-[13px] text-gray-400">
                  <MapPin size={13} strokeWidth={2} className="text-primary" />
                  {property.location}
                </div>

                {/* Specs */}
                {property.beds > 0 && (
                  <div className="mb-5 flex items-center gap-4 text-[12.5px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Bed size={13} strokeWidth={1.8} /> {property.beds} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath size={13} strokeWidth={1.8} /> {property.baths}{" "}
                      Baths
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Square size={13} strokeWidth={1.8} />{" "}
                      {property.sqft.toLocaleString()} sqft
                    </span>
                  </div>
                )}

                {/* Price row */}
                <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
                  <p className="m-0 font-heading text-[17px] font-bold text-primary">
                    {property.price}
                  </p>
                  <p className="m-0 text-[11px] text-gray-400">
                    Incl. taxes & fees
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
