"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "Featured" | "Active" | "Pending";

interface Listing {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  status: Status;
  bedrooms: number;
  bathrooms: number;
  area: string;
  added: string;
  image: string;
}

// ─── Dummy data ───────────────────────────────────────────────────────────────

const LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Kigali Heights",
    type: "Villa",
    price: "RWF 450,000,000",
    status: "Featured",
    bedrooms: 5,
    bathrooms: 4,
    area: "420 m²",
    added: "9 May 2026",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120",
  },
  {
    id: 2,
    title: "Contemporary Family Home",
    location: "Nyarutarama",
    type: "Family House",
    price: "RWF 320,000,000",
    status: "Active",
    bedrooms: 4,
    bathrooms: 3,
    area: "310 m²",
    added: "9 May 2026",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=120",
  },
  {
    id: 3,
    title: "Executive Penthouse",
    location: "Gacuriro",
    type: "Penthouse",
    price: "RWF 280,000,000",
    status: "Pending",
    bedrooms: 3,
    bathrooms: 3,
    area: "260 m²",
    added: "8 May 2026",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120",
  },
  {
    id: 4,
    title: "Garden View Residence",
    location: "Kimihurura",
    type: "House",
    price: "RWF 210,000,000",
    status: "Featured",
    bedrooms: 4,
    bathrooms: 2,
    area: "280 m²",
    added: "7 May 2026",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120",
  },
  {
    id: 5,
    title: "Hilltop Panorama Estate",
    location: "Rebero",
    type: "Villa",
    price: "RWF 580,000,000",
    status: "Active",
    bedrooms: 6,
    bathrooms: 5,
    area: "550 m²",
    added: "5 May 2026",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=120",
  },
  {
    id: 6,
    title: "City Centre Apartment",
    location: "Kigali CBD",
    type: "Apartment",
    price: "RWF 95,000,000",
    status: "Active",
    bedrooms: 2,
    bathrooms: 1,
    area: "95 m²",
    added: "4 May 2026",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=120",
  },
  {
    id: 7,
    title: "Lakeside Retreat",
    location: "Nyamata",
    type: "House",
    price: "RWF 175,000,000",
    status: "Pending",
    bedrooms: 3,
    bathrooms: 2,
    area: "230 m²",
    added: "2 May 2026",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=120",
  },
  {
    id: 8,
    title: "Diplomatic Quarter Mansion",
    location: "Kacyiru",
    type: "Mansion",
    price: "RWF 890,000,000",
    status: "Featured",
    bedrooms: 7,
    bathrooms: 6,
    area: "780 m²",
    added: "1 May 2026",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=120",
  },
];

// ─── Status badge styles ───────────────────────────────────────────────────────

const STATUS_STYLES: Record<Status, string> = {
  Featured: "bg-amber-50 text-amber-700 border border-amber-200",
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-red-50 text-red-600 border border-red-200",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconEdit() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-xl">
        <h3 className="text-sm font-bold text-gray-900">Delete Listing?</h3>
        <p className="landing-body mt-1.5 text-gray-500">
          This action cannot be undone. The listing will be permanently removed.
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllListingsPage() {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const types = ["All", ...Array.from(new Set(LISTINGS.map((l) => l.type)))];
  const statuses: ("All" | Status)[] = ["All", "Featured", "Active", "Pending"];

  const filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
    const matchType = typeFilter === "All" || l.type === typeFilter;
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  function confirmDelete() {
    if (deleteId === null) return;
    setListings((prev) => prev.filter((l) => l.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div className="admin-shell min-h-screen bg-surface p-6">
      {/* Delete modal */}
      {deleteId !== null && (
        <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
      )}

      {/* ── Page header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="landing-eyebrow text-primary">Properties</p>
          <h1 className="landing-title-compact mt-1 text-gray-900">All Listings</h1>
          <p className="landing-body mt-0.5 text-gray-500">
            {filtered.length} propert{filtered.length !== 1 ? "ies" : "y"} listed
          </p>
        </div>

        <Link
          href="/admin/dashboard/Addproperty"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <IconPlus />
          Add Property
        </Link>
      </div>

      {/* ── Filter bar ── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: 200, maxWidth: 320 }}>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IconSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full rounded-lg border border-input bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Type */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-gray-700 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "All" | Status)}
          className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-gray-700 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ── Table card ── */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {/* Head */}
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {[
                  "Property",
                  "Type",
                  "Price",
                  "Status",
                  "Beds",
                  "Baths",
                  "Area",
                  "Added",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="landing-eyebrow whitespace-nowrap px-4 py-3 text-left text-gray-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="landing-body px-4 py-12 text-center text-gray-400"
                  >
                    No listings match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr
                    key={l.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    {/* Property */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={l.image}
                            alt={l.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="landing-card-title truncate text-gray-800">
                            {l.title}
                          </p>
                          <p className="truncate text-xs font-medium text-gray-400">
                            {l.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-600">
                      {l.type}
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-primary">
                      {l.price}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[l.status]}`}
                      >
                        {l.status}
                      </span>
                    </td>

                    {/* Beds */}
                    <td className="px-4 py-3 text-center text-gray-600">
                      {l.bedrooms}
                    </td>

                    {/* Baths */}
                    <td className="px-4 py-3 text-center text-gray-600">
                      {l.bathrooms}
                    </td>

                    {/* Area */}
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {l.area}
                    </td>

                    {/* Added */}
                    <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                      {l.added}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {/* Edit */}
                        <Link
                          href={`/admin/listings/${l.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          title="Edit"
                        >
                          <IconEdit />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(l.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table footer / pagination ── */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-4 py-3">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {listings.length} listings
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                  p === 1
                    ? "bg-primary text-white"
                    : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}