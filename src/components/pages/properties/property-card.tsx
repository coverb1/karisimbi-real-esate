// 📁 File: src/components/properties/property-card.tsx

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, ArrowUpRight } from "lucide-react";
import { getPrimaryPropertyImage } from "@/src/lib/property-images";
import { formatArea } from "@/src/lib/property-area";
import type { DBProperty } from "./properties-listings";

// ─── TYPE COLOR MAP ───────────────────────────────────────────────────────────
// Maps property type strings (as stored in DB) to visual styles.
// Add more entries here as your types grow.

const TYPE_STYLES: Record<string, { color: string; bg: string }> = {
  House:        { color: "text-primary",     bg: "bg-primary/8 border-primary/15"       },
  "Family House": { color: "text-primary",   bg: "bg-primary/8 border-primary/15"       },
  Villa:        { color: "text-primary",     bg: "bg-primary/8 border-primary/15"       },
  Penthouse:    { color: "text-primary",     bg: "bg-primary/8 border-primary/15"       },
  Land:         { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200/60"  },
  Plot:         { color: "text-blue-700",    bg: "bg-blue-50 border-blue-200/60"        },
};

const DEFAULT_STYLE = { color: "text-primary", bg: "bg-primary/8 border-primary/15" };

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function PropertyCard({ property }: { property: DBProperty }) {
  const style = TYPE_STYLES[property.type] ?? DEFAULT_STYLE;
  const coverImage = getPrimaryPropertyImage(property.image_url);

  // Format price: DB stores full RWF e.g. 50000000 → "RWF 50,000,000"
  const formattedPrice = `RWF ${property.price.toLocaleString()}`;

  // Format area: DB stores numeric sqm
  const formattedArea = property.area != null
    ? `${formatArea(property.area, property.area_has_plus)} m²`
    : null;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white
                 no-underline shadow-sm transition-all duration-300
                 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)]"
    >
      {/* Image */}
      <div className="relative h-50 w-full overflow-hidden bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          // Placeholder when no image
          <div className="h-full w-full flex items-center justify-center bg-gray-50">
            <Square size={32} className="text-gray-200" />
          </div>
        )}

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
        <h5 className="mb-1.5 text-[14.5px] font-semibold leading-snug text-gray-900 truncate">
          {property.title}
        </h5>
        <div className="mb-4 flex items-center gap-1.5 text-[12px] text-gray-400">
          <MapPin size={12} strokeWidth={2} className={style.color} />
          {property.location}
        </div>

        {/* Specs */}
        <div className="mb-4 flex items-center gap-4 border-b border-gray-100 pb-4 text-[12px] text-gray-400">
          {property.bedrooms ? (
            <>
              <span className="flex items-center gap-1.5">
                <Bed size={12} strokeWidth={1.8} className="text-gray-300" />
                {property.bedrooms} Bed
              </span>
              <span className="flex items-center gap-1.5">
                <Bath size={12} strokeWidth={1.8} className="text-gray-300" />
                {property.bathrooms} Bath
              </span>
            </>
          ) : null}
          {formattedArea && (
            <span className="flex items-center gap-1.5">
              <Square size={12} strokeWidth={1.8} className="text-gray-300" />
              {formattedArea}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between">
          <p className={`font-heading m-0 text-[17px] font-bold ${style.color}`}>
            {formattedPrice}
          </p>
          <span className="text-[10.5px] text-gray-300">Incl. fees</span>
        </div>
      </div>
    </Link>
  );
}
