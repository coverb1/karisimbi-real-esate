"use client";

import { useState, useMemo } from "react";
import { MapPin, X, SlidersHorizontal } from "lucide-react";
import { PropertyFilters, type FilterState } from "./Property-filters";
import { PropertyCard } from "./property-card";
import { Pagination } from "./pagination";
import {
  properties,
  sortOptions,
  ITEMS_PER_PAGE,
  type PropertyCategory,
} from "@/src/lib/mock-data";


const defaultFilters: FilterState = {
  categories: { house: false, land: false, plot: false },
  minPrice: "",
  maxPrice: "",
  location: "All Locations",
  minBeds: "Any",
  search: "",
};

export function PropertiesListings() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Category counts
  const counts = useMemo(
    () => ({
      house: properties.filter((p) => p.category === "house").length,
      land: properties.filter((p) => p.category === "land").length,
      plot: properties.filter((p) => p.category === "plot").length,
    }),
    [],
  );

  // Filtered + sorted list
  const filtered = useMemo(() => {
    const anyCat = Object.values(filters.categories).some(Boolean);

    return [...properties]
      .filter((p) => {
        const catOk =
          !anyCat || filters.categories[p.category as PropertyCategory];
        const query = filters.search.toLowerCase();
        const searchOk =
          !query ||
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query);
        const minP = filters.minPrice !== "" ? Number(filters.minPrice) : 0;
        const maxP =
          filters.maxPrice !== "" ? Number(filters.maxPrice) : Infinity;
        const priceOk = p.priceValue >= minP && p.priceValue <= maxP;
        const locOk =
          filters.location === "All Locations" ||
          p.location.includes(filters.location);
        const bedsNum =
          filters.minBeds === "Any" ? 0 : parseInt(filters.minBeds);
        const bedsOk =
          filters.minBeds === "Any" || (p.beds !== null && p.beds >= bedsNum);
        return catOk && searchOk && priceOk && locOk && bedsOk;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.priceValue - b.priceValue;
        if (sort === "price-desc") return b.priceValue - a.priceValue;
        return 0;
      });
  }, [filters, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Reset to page 1 when filters change
  const handleFiltersChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
  };

  const activeCategories = Object.entries(filters.categories)
    .filter(([, v]) => v)
    .map(([k]) => k as PropertyCategory);

  return (
    <div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-0 py-10 lg:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* ── SIDEBAR ── */}
        <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start">
          <PropertyFilters
            filters={filters}
            onChange={handleFiltersChange}
            counts={counts}
          />
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3 sm:gap-2">
              <p className="m-0 text-[14px] text-gray-400">
                <span className="font-heading text-[22px] font-bold text-gray-900 mr-1">
                  {filtered.length}
                </span>
                propert{filtered.length === 1 ? "y" : "ies"}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {activeCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/6 px-3 py-1 text-[11px] font-medium text-primary"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}s
                    <button
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          categories: { ...filters.categories, [cat]: false },
                        })
                      }
                      className="flex items-center p-0 bg-transparent border-0 cursor-pointer text-primary/60 hover:text-primary"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}

                {filters.location !== "All Locations" && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-medium text-gray-500"
                  >
                    <MapPin size={10} />
                    {filters.location}
                    <button
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          location: "All Locations",
                        })
                      }
                      className="flex items-center p-0 bg-transparent border-0 cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            </div>

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
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-600 outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="mb-6 lg:hidden">
              <PropertyFilters
                filters={filters}
                onChange={(f) => {
                  handleFiltersChange(f);
                }}
                counts={counts}
              />
            </div>
          )}

          {/* Grid */}
          {paginated.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>

              {/* Pagination */}
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
              <p className="font-heading text-[52px] font-bold text-gray-100 leading-none">
                0
              </p>
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
