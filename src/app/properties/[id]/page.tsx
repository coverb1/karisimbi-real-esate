"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Bed, Bath, Square, ArrowLeft, Phone, Calendar, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
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

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Featured: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  Pending: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="mx-auto max-w-5xl px-5 py-10 animate-pulse">
        <div className="h-4 w-32 rounded-full bg-gray-200 mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 h-[420px] rounded-3xl bg-gray-200" />
          <div className="lg:col-span-2 flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-[200px] rounded-3xl bg-gray-200" />
            ))}
          </div>
        </div>
        <div className="mt-8 h-9 w-2/3 rounded-full bg-gray-200 mb-3" />
        <div className="h-4 w-1/4 rounded-full bg-gray-200" />
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
  const [saved, setSaved] = useState(false);

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#FAFAF9] px-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-gray-800">Property not found</p>
        <p className="text-sm text-gray-400 max-w-xs">This listing may have been removed or is no longer available.</p>
        <Link href="/properties" className="mt-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          Browse Properties
        </Link>
      </div>
    );
  }

  const propertyImages = parsePropertyImages(property.image_url);
  const selectedImage = propertyImages[selectedImageIndex] ?? propertyImages[0] ?? null;
  const statusStyle = STATUS_STYLES[property.status] ?? STATUS_STYLES.Active;

  const prevImage = () => setSelectedImageIndex((i) => (i - 1 + propertyImages.length) % propertyImages.length);
  const nextImage = () => setSelectedImageIndex((i) => (i + 1) % propertyImages.length);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">

      {/* ── Top Nav Bar ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors no-underline group"
          >
            <span className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
              <ArrowLeft size={14} />
            </span>
            Properties
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                saved ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
              }`}
            >
              <Heart size={15} fill={saved ? "currentColor" : "none"} />
            </button>
            <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all">
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8">

        {/* ── Image Gallery Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 rounded-3xl overflow-hidden">

          {/* Main image */}
          <div className="lg:col-span-3 relative h-[300px] sm:h-[400px] lg:h-[460px] bg-gray-100 group">
            {selectedImage ? (
              <Image src={selectedImage} alt={property.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest ${statusStyle.bg} ${statusStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {property.status}
              </span>
            </div>

            {/* Type badge */}
            <div className="absolute top-4 right-4">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-700">
                {property.type}
              </span>
            </div>

            {/* Arrow nav (only if multiple images) */}
            {propertyImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {propertyImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`rounded-full transition-all ${i === selectedImageIndex ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail column */}
          {propertyImages.length > 1 && (
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
              {propertyImages.slice(1, 3).map((image, index) => {
                const actualIndex = index + 1;
                const isLast = actualIndex === 2 && propertyImages.length > 3;
                return (
                  <button
                    key={image}
                    onClick={() => setSelectedImageIndex(actualIndex)}
                    className={`relative flex-1 overflow-hidden transition-all ${
                      actualIndex === selectedImageIndex ? "ring-2 ring-primary ring-offset-2" : "hover:brightness-90"
                    }`}
                  >
                    <Image src={image} alt={`View ${actualIndex + 1}`} fill className="object-cover" />
                    {isLast && propertyImages.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+{propertyImages.length - 3} more</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Content Grid ── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Main info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title + location */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="landing-title-compact text-gray-900 leading-tight">
                  {property.title}
                </h1>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={11} className="text-primary" />
                </div>
                {property.location}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Specs */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Property Details</p>
              <div className="grid grid-cols-3 gap-3">
                {property.bedrooms > 0 && (
                  <>
                    <div className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 hover:border-primary/20 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                        <Bed size={19} strokeWidth={1.6} className="text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="landing-card-title text-gray-900">{property.bedrooms}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">Bedrooms</p>
                      </div>
                    </div>

                    <div className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 hover:border-primary/20 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                        <Bath size={19} strokeWidth={1.6} className="text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="landing-card-title text-gray-900">{property.bathrooms}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">Bathrooms</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 hover:border-primary/20 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                    <Square size={19} strokeWidth={1.6} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="landing-card-title text-gray-900">{property.area.toLocaleString()}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">m² Area</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Listed date */}
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar size={13} />
              </div>
              Listed on {new Date(property.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Right: Price card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

              {/* Price */}
              <div className="pb-5 border-b border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Asking Price</p>
                <p className="landing-card-title text-primary text-2xl">
                  RWF {property.price.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">Inclusive of all taxes & fees</p>
              </div>

              {/* Agent card */}
              <div className="py-5 border-b border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Listed by</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">AG</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Real Estate Agent</p>
                    <p className="text-xs text-gray-400">Certified Property Advisor</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-5 flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all">
                  <Phone size={15} />
                  Contact Agent
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all">
                  <Calendar size={15} />
                  Schedule a Visit
                </button>
              </div>

              {/* Trust note */}
             
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}