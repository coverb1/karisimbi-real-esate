"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Bed, Bath, Square, ArrowLeft } from "lucide-react";
import { parsePropertyImages } from "@/src/lib/property-images";

type Property = {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  Featured: "bg-amber-50 text-amber-700 border border-amber-200",
  Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-red-50 text-red-600 border border-red-200",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 animate-pulse">
      <div className="h-4 w-24 rounded-lg bg-gray-100 mb-8" />
      <div className="h-80 w-full rounded-2xl bg-gray-100 mb-8" />
      <div className="h-8 w-2/3 rounded-lg bg-gray-100 mb-4" />
      <div className="h-4 w-1/3 rounded-lg bg-gray-100 mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/user/properties/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProperty(data.property);
        setSelectedImageIndex(0);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProperty();
  }, [id]);

  if (loading) return <Skeleton />;

  if (error || !property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-5">
        <p className="landing-card-title text-gray-700">
          Property not found
        </p>
        <Link
          href="/properties"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  const propertyImages = parsePropertyImages(property.image_url);
  const selectedImage = propertyImages[selectedImageIndex] ?? propertyImages[0] ?? null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-5 py-10">

        {/* Back link */}
        <Link
          href="/properties"
          className="mb-8 inline-flex items-center gap-1.5 landing-body text-gray-500 hover:text-gray-900 transition-colors no-underline"
        >
          <ArrowLeft size={16} />
          Back to Properties
        </Link>

        {/* Image */}
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-96">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          )}

          {/* Status */}
          <div className="absolute left-4 top-4">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                STATUS_STYLES[property.status] ?? STATUS_STYLES.Active
              }`}
            >
              {property.status}
            </span>
          </div>

          {/* Type */}
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-800 backdrop-blur-sm">
              {property.type}
            </span>
          </div>
        </div>

        {propertyImages.length > 1 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {propertyImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-video overflow-hidden rounded-xl border bg-gray-100 transition ${
                  index === selectedImageIndex ? "border-primary ring-2 ring-primary/20" : "border-gray-100 hover:border-primary/40"
                }`}
                aria-label={`Show property image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${property.title} photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Title + location */}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="landing-title-compact text-gray-900">
              {property.title}
            </h1>

            <div className="mt-2 flex items-center gap-1.5 landing-body text-gray-400">
              <MapPin size={14} strokeWidth={2} className="text-primary" />
              {property.location}
            </div>
          </div>

          {/* Price */}
          <div className="mt-2 sm:mt-0 sm:text-right shrink-0">
            <p className="landing-card-title text-primary">
              RWF {property.price.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              Incl. taxes & fees
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {property.bedrooms > 0 && (
            <>
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <Bed size={22} strokeWidth={1.5} className="text-primary" />
                <p className="landing-card-title text-gray-900">
                  {property.bedrooms}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Bedrooms
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <Bath size={22} strokeWidth={1.5} className="text-primary" />
                <p className="landing-card-title text-gray-900">
                  {property.bathrooms}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Bathrooms
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <Square size={22} strokeWidth={1.5} className="text-primary" />
            <p className="landing-card-title text-gray-900">
              {property.area.toLocaleString()}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              m² Area
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            Contact Agent
          </button>
          <button className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Schedule a Visit
          </button>
        </div>

      </div>
    </div>
  );
}
