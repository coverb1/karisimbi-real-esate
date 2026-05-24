// 📁 app/admin/dashboard/listings/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Database } from "@/src/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type Listing = Database["public"]["Tables"]["properties"]["Row"];

type EditForm = {
  title: string;
  location: string;
  type: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  status: string;
  image_url: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Featured: "bg-amber-50 text-amber-700 border border-amber-200",
  Active:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending:  "bg-red-50 text-red-600 border border-red-200",
};

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Office", "Land", "Commercial"];
const STATUSES       = ["Active", "Featured", "Pending"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return `RWF ${price.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
  deleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <IconTrash />
        </div>
        <h3 className="text-center text-sm font-bold text-gray-900">Delete Listing?</h3>
        <p className="mt-1.5 text-center text-sm text-gray-500">
          This action cannot be undone. The listing will be permanently removed.
        </p>
        <div className="mt-5 flex justify-center gap-2.5">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting && (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Uploader ───────────────────────────────────────────────────────────

function ImageUploader({
  currentUrl,
  onUploaded,
}: {
  currentUrl: string;
  onUploaded: (url: string) => void;
}) {
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const [uploading, setUploading]       = useState(false);
  const [preview, setPreview]           = useState(currentUrl);
  const [uploadError, setUploadError]   = useState<string | null>(null);

async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  setPreview(URL.createObjectURL(file));
  setUploadError(null);
  setUploading(true);

  try {
    // Convert to base64 — same way the add property page does it
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Call the same Cloudinary route the add property page uses
    const res = await fetch("/api/uploadToCloudinary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: [base64] }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Upload failed");
    }

    const data = await res.json();
    const url = data.mainImageUrl; // matches what /api/uploadToCloudinary returns
    onUploaded(url);
    setPreview(url);
  } catch (err: unknown) {
    setUploadError(err instanceof Error ? err.message : "Upload failed");
    setPreview(currentUrl);
  } finally {
    setUploading(false);
  }
}

  return (
    <div className="sm:col-span-2">
      <label className="mb-1.5 block text-xs font-semibold text-gray-700">
        Property Image
      </label>

      {/* Preview box */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        {preview ? (
          <img
            src={preview}
            alt="Property preview"
            className="h-48 w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          // Empty state when no image exists
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-300">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs font-medium">No image uploaded yet</span>
          </div>
        )}

        {/* Upload / Change button overlaid bottom-right */}
        <div className="absolute bottom-3 right-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/90 px-3 py-2 text-xs font-semibold text-gray-700 shadow-md backdrop-blur-sm hover:bg-white disabled:opacity-60"
          >
            {uploading ? (
              <>
                <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Uploading…
              </>
            ) : (
              <>
                <IconUpload />
                {preview ? "Change Image" : "Upload Image"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden file input — triggered by the button above */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && (
        <p className="mt-1.5 text-xs font-medium text-red-500">⚠ {uploadError}</p>
      )}
      <p className="mt-1.5 text-[11px] text-gray-400">
        Click the button to select an image. Accepted: JPG, PNG, WebP · Max 5 MB.
      </p>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  listing,
  onSave,
  onCancel,
  saving,
}: {
  listing: Listing;
  onSave: (form: EditForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<EditForm>({
    title:     listing.title,
    location:  listing.location,
    type:      listing.type,
    price:     String(listing.price),
    bedrooms:  String(listing.bedrooms),
    bathrooms: String(listing.bathrooms),
    area:      String(listing.area),
    status:    listing.status,
    image_url: listing.image_url ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-100 bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Edit Property</h3>
            <p className="text-xs text-gray-400 mt-0.5">Update the details below and save.</p>
          </div>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <IconX />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Image uploader — no URL input, just click to pick file */}
            <ImageUploader
              currentUrl={form.image_url}
              onUploaded={(url) =>
                setForm((prev) => ({ ...prev, image_url: url }))
              }
            />

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Modern Villa in Kiyovu"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Kiyovu, Kigali"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
              >
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Price (RWF)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="450000000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Area */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Area (m²)</label>
              <input
                name="area"
                type="number"
                value={form.area}
                onChange={handleChange}
                placeholder="420"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Bedrooms</label>
              <input
                name="bedrooms"
                type="number"
                value={form.bedrooms}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Bathrooms</label>
              <input
                name="bathrooms"
                type="number"
                value={form.bathrooms}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving && (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllListingsPage() {
  const [listings, setListings]             = useState<Listing[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [search, setSearch]                 = useState("");
  const [typeFilter, setTypeFilter]         = useState("All");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [deleteId, setDeleteId]             = useState<string | null>(null);
  const [deleting, setDeleting]             = useState(false);
  const [editListing, setEditListing]       = useState<Listing | null>(null);
  const [saving, setSaving]                 = useState(false);

  // ── Fetch ──
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/Getproperties");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load listings");
        }
        const data = await res.json();
        setListings(data.properties);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  // ── Delete ──
  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
      setListings((prev) => prev.filter((l) => l.id !== deleteId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  // ── Save ──
  async function handleSave(form: EditForm) {
    if (!editListing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/properties/${editListing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }
      const { property } = await res.json();
      setListings((prev) =>
        prev.map((l) => (l.id === property.id ? property : l))
      );
      setEditListing(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  // ── Filter ──
  const uniqueTypes = ["All", ...Array.from(new Set(listings.map((l) => l.type)))];
  const statuses    = ["All", "Featured", "Active", "Pending"];

  const filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)) &&
      (typeFilter === "All" || l.type === typeFilter) &&
      (statusFilter === "All" || l.status === statusFilter)
    );
  });

  // ── Loading ──
  if (loading) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p className="text-sm text-gray-400">Loading listings…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <p className="text-sm font-semibold text-red-600">⚠️ {error}</p>
          <button
            onClick={() => { setError(null); window.location.reload(); }}
            className="mt-3 text-sm text-primary underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="admin-shell min-h-screen bg-surface p-6">

      {/* Modals */}
      {deleteId !== null && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          deleting={deleting}
        />
      )}
      {editListing !== null && (
        <EditModal
          listing={editListing}
          onSave={handleSave}
          onCancel={() => setEditListing(null)}
          saving={saving}
        />
      )}

      {/* Header */}
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
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          <IconPlus /> Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-gray-700 focus:border-ring focus:outline-none"
        >
          {uniqueTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-gray-700 focus:border-ring focus:outline-none"
        >
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {["Property", "Type", "Price", "Status", "Beds", "Baths", "Area", "Added", "Actions"].map((col) => (
                  <th key={col} className="landing-eyebrow whitespace-nowrap px-4 py-3 text-left text-gray-400">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-400">
                    No listings found.{" "}
                    <Link href="/admin/dashboard/Addproperty" className="text-primary underline">
                      Add one?
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-gray-50/50">

                    {/* Property */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {l.image_url ? (
                            <Image src={l.image_url} alt={l.title} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="landing-card-title truncate text-gray-800">{l.title}</p>
                          <p className="truncate text-xs font-medium text-gray-400">{l.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-600">{l.type}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-primary">{formatPrice(l.price)}</td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[l.status] ?? "bg-gray-50 text-gray-500"}`}>
                        {l.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center text-gray-600">{l.bedrooms}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{l.bathrooms}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{l.area} m²</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-400">{formatDate(l.created_at)}</td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditListing(l)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          title="Edit"
                        >
                          <IconEdit />
                        </button>
                        <button
                          onClick={() => setDeleteId(l.id)}
                          disabled={deleting}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-4 py-3">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {listings.length} listings
          </p>
        </div>
      </div>
    </div>
  );
}