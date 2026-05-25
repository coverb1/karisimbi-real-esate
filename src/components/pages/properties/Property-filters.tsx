"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import {
  locationOptions,
  bedsOptions,
  priceRanges,
  type PropertyCategory,
} from "@/src/lib/mock-data";

export interface FilterState {
  categories: Record<PropertyCategory, boolean>;
  minPrice: string;
  maxPrice: string;
  location: string;
  minBeds: string;
  search: string;
}

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  counts: Record<PropertyCategory, number>;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-transparent border-0 p-0 cursor-pointer mb-0"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
          {title}
        </span>
        <ChevronDown
          size={13}
          className={`text-gray-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3.5">{children}</div>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-1.5 select-none group">
      <div className="flex items-center gap-2.5">
        <div
          onClick={onChange}
          className={[
            "h-4 w-4 rounded-sm shrink-0 border flex items-center justify-center transition-all duration-150",
            checked
              ? "bg-primary border-primary"
              : "bg-white border-gray-300 group-hover:border-primary/50",
          ].join(" ")}
        >
          {checked && (
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path
                d="M1 3L3 5L7 1"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="text-[13px] text-gray-600">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-gray-300">{count}</span>
      )}
    </label>
  );
}

function Radio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-1.5 select-none">
      <div
        onClick={onChange}
        className={[
          "h-4 w-4 rounded-full shrink-0 border flex items-center justify-center transition-all duration-150",
          checked ? "bg-primary border-primary" : "bg-white border-gray-300",
        ].join(" ")}
      >
        {checked && <div className="h-1.25 w-1.25 rounded-full bg-white" />}
      </div>
      <span
        className={`text-[13px] ${checked ? "text-gray-900 font-medium" : "text-gray-500"}`}
      >
        {label}
      </span>
    </label>
  );
}

export function PropertyFilters({ filters, onChange, counts }: Props) {
  const hasFilters =
    Object.values(filters.categories).some(Boolean) ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.location !== "All Locations" ||
    filters.minBeds !== "Any" ||
    filters.search !== "";

  const set = (partial: Partial<FilterState>) =>
    onChange({ ...filters, ...partial });

  const clearAll = () =>
    onChange({
      categories: { house: false, land: false, plot: false },
      minPrice: "",
      maxPrice: "",
      location: "All Locations",
      minBeds: "Any",
      search: "",
    });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-600" />
          <span className="text-[13px] font-semibold text-gray-800">
            Filters
          </span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[12px] font-medium text-primary bg-transparent border-0 cursor-pointer p-0
                       hover:text-primary/70 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search properties..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-8 pr-8
                     text-[13px] text-gray-700 outline-none placeholder:text-gray-300
                     focus:border-primary focus:bg-white transition-all duration-200"
        />
        {filters.search && (
          <button
            onClick={() => set({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0 bg-transparent border-0 cursor-pointer"
          >
            <X size={12} className="text-gray-300 hover:text-gray-500" />
          </button>
        )}
      </div>

      {/* Property Type */}
      <Section title="Property Type">
        {(
          [
            { key: "house" as PropertyCategory, label: "Houses" },
            { key: "land" as PropertyCategory, label: "Land" },
            { key: "plot" as PropertyCategory, label: "Plots" },
          ] as const
        ).map(({ key, label }) => (
          <Checkbox
            key={key}
            label={label}
            checked={filters.categories[key]}
            count={counts[key]}
            onChange={() =>
              set({
                categories: {
                  ...filters.categories,
                  [key]: !filters.categories[key],
                },
              })
            }
          />
        ))}
      </Section>

      {/* Price */}
      <Section title="Price (Million RWF)">
        <div className="mb-3 flex flex-col">
          {priceRanges.map((r) => {
            const active =
              filters.minPrice === r.min && filters.maxPrice === r.max;
            return (
              <Radio
                key={r.label}
                label={r.label}
                checked={active}
                onChange={() =>
                  active
                    ? set({ minPrice: "", maxPrice: "" })
                    : set({ minPrice: r.min, maxPrice: r.max })
                }
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
            placeholder="Min"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] text-gray-700
                       outline-none focus:border-primary transition-colors"
          />
          <span className="text-gray-300 text-[13px] shrink-0">–</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
            placeholder="Max"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] text-gray-700
                       outline-none focus:border-primary transition-colors"
          />
        </div>
      </Section>

      {/* Location */}
      <Section title="Location">
        <div
          className="flex max-h-45 flex-col overflow-y-auto pr-1
                        [&::-webkit-scrollbar]:w-0.75
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-200"
        >
          {locationOptions.map((loc) => (
            <Radio
              key={loc}
              label={loc}
              checked={filters.location === loc}
              onChange={() => set({ location: loc })}
            />
          ))}
        </div>
      </Section>

      {/* Bedrooms */}
      <Section title="Bedrooms (min)">
        <div className="flex flex-wrap gap-1.5">
          {bedsOptions.map((opt) => {
            const active = filters.minBeds === opt;
            return (
              <button
                key={opt}
                onClick={() => set({ minBeds: opt })}
                className={[
                  "rounded-lg border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-150 cursor-pointer",
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-primary/40 hover:text-primary",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
