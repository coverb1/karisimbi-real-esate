"use client";

// 📁 File: src/components/properties/properties-listings.tsx

import { useState, useMemo, useEffect } from "react";
import { MapPin, X, SlidersHorizontal } from "lucide-react";
import { PropertyFilters, type FilterState } from "./Property-filters";
import { PropertyCard } from "./property-card";
import { Pagination } from "./pagination";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 9;

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

// ─── TYPE ─────────────────────────────────────────────────────────────────────
// Shared DB property type — also exported so property-card.tsx and Property-filters.tsx can import it

export type DBProperty = {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;        // stored as full RWF in DB e.g. 50000000
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  image_url: string | null;
};

// ─── DEFAULT FILTERS ──────────────────────────────────────────────────────────

export const defaultFilters: FilterState = {
  types: {},
  minPrice: "",
  maxPrice: "",
  location: "",
  minBeds: "Any",
  search: "",
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-50 w-full animate-pulse bg-gray-100" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-2 h-5 w-1/3 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function PropertiesListings() {
  const [allProperties, setAllProperties] = useState<DBProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Fetch all properties once ──
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await fetch("/api/user/properties/get");
        const data = await res.json();
        setAllProperties(data.properties ?? []);
      } catch {
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ── Filter + sort ──
  const filtered = useMemo(() => {
    const anyType = Object.values(filters.types).some(Boolean);

    return [...allProperties]
      .filter((p) => {
        // Type
        const typeOk = !anyType || !!filters.types[p.type];

        // Search
        const q = filters.search.toLowerCase();
        const searchOk =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q);

        // Price — filter inputs are in millions, DB stores full RWF
        const minP = filters.minPrice !== "" ? Number(filters.minPrice) * 1_000_000 : 0;
        const maxP = filters.maxPrice !== "" ? Number(filters.maxPrice) * 1_000_000 : Infinity;
        const priceOk = p.price >= minP && p.price <= maxP;

        // Location
        const locOk = filters.location === "" || p.location === filters.location;

        // Bedrooms
        const bedsNum = filters.minBeds === "Any" ? 0 : parseInt(filters.minBeds);
        const bedsOk =
          filters.minBeds === "Any" ||
          (p.bedrooms !== null && p.bedrooms >= bedsNum);

        return typeOk && searchOk && priceOk && locOk && bedsOk;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [allProperties, filters, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleFiltersChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
  };

  // Active chip lists
  const activeTypes = Object.entries(filters.types)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-0 py-10 lg:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

        {/* ── SIDEBAR ── */}
        <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start">
          <PropertyFilters
            filters={filters}
            onChange={handleFiltersChange}
            properties={allProperties}
          />
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3 sm:gap-2">

              {/* Count */}
              <p className="m-0 text-[14px] text-gray-400">
                <span className="font-heading text-[22px] font-bold text-gray-900 mr-1">
                  {loading ? "…" : filtered.length}
                </span>
                {!loading && `propert${filtered.length === 1 ? "y" : "ies"}`}
              </p>

              {/* Active filter chips */}
              <div className="flex flex-wrap items-center gap-2">
                {activeTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/6 px-3 py-1 text-[11px] font-medium text-primary"
                  >
                    {type}
                    <button
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          types: { ...filters.types, [type]: false },
                        })
                      }
                      className="flex items-center p-0 bg-transparent border-0 cursor-pointer text-primary/60 hover:text-primary"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}

                {filters.location !== "" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-medium text-gray-500">
                    <MapPin size={10} />
                    {filters.location}
                    <button
                      onClick={() =>
                        handleFiltersChange({ ...filters, location: "" })
                      }
                      className="flex items-center p-0 bg-transparent border-0 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-primary hover:text-primary lg:hidden"
              >
                <SlidersHorizontal size={16} />
                {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-400">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-600 outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile filters panel */}
          {mobileFiltersOpen && (
            <div className="mb-6 lg:hidden">
              <PropertyFilters
                filters={filters}
                onChange={handleFiltersChange}
                properties={allProperties}
              />
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
              <p className="font-heading text-[52px] font-bold text-gray-100 leading-none">0</p>
              <p className="mt-3 text-[15px] font-medium text-gray-400">
                No properties match your filters
              </p>
              <p className="mt-1 text-[13px] text-gray-300">
                Try adjusting or clearing your search
              </p>
              <button
                onClick={() => handleFiltersChange(defaultFilters)}
                className="mt-6 rounded-full bg-primary px-6 py-2.5 text-[13px] font-medium
                           text-white border-0 cursor-pointer transition-all duration-200 hover:bg-primary/90"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}