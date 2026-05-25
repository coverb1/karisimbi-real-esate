import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, ArrowUpRight } from "lucide-react";
import type { Property, PropertyCategory } from "@/src/lib/mock-data";

const categoryStyles: Record<PropertyCategory, { color: string; bg: string }> =
  {
    house: { color: "text-primary", bg: "bg-primary/8 border-primary/15" },
    land: {
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200/60",
    },
    plot: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200/60" },
  };

export function PropertyCard({ property }: { property: Property }) {
  const style = categoryStyles[property.category];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white
                 no-underline shadow-sm transition-all duration-300
                 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]"
    >
      {/* Image */}
      <div className="relative h-50 w-full overflow-hidden bg-gray-100">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Type badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${style.bg} ${style.color}`}
          >
            {property.type}
          </span>
        </div>

        {/* Arrow */}
        <div
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full
                        bg-primary text-white transition-transform duration-200 group-hover:scale-110"
        >
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h5 className="mb-1.5 text-[14.5px] font-semibold leading-snug text-gray-900">
          {property.title}
        </h5>
        <div className="mb-4 flex items-center gap-1.5 text-[12px] text-gray-400">
          <MapPin size={12} strokeWidth={2} className={style.color} />
          {property.location}
        </div>

        {/* Specs */}
        <div className="mb-4 flex items-center gap-4 border-b border-gray-100 pb-4 text-[12px] text-gray-400">
          {property.beds ? (
            <>
              <span className="flex items-center gap-1.5">
                <Bed size={12} strokeWidth={1.8} className="text-gray-300" />
                {property.beds} Bed
              </span>
              <span className="flex items-center gap-1.5">
                <Bath size={12} strokeWidth={1.8} className="text-gray-300" />
                {property.baths} Bath
              </span>
            </>
          ) : null}
          <span className="flex items-center gap-1.5">
            <Square size={12} strokeWidth={1.8} className="text-gray-300" />
            {property.area}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between">
          <p
            className={`font-heading m-0 text-[17px] font-bold ${style.color}`}
          >
            {property.price}
          </p>
          <span className="text-[10.5px] text-gray-300">Incl. fees</span>
        </div>
      </div>
    </Link>
  );
}
