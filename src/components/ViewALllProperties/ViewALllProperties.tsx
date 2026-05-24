"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { AnimatedSection } from "../animations/AnimatedSection";
import { getPrimaryPropertyImage } from "@/src/lib/property-images";

type Property = {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  status: string;
  image_url: string | null;
};

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-55 w-full animate-pulse bg-gray-100" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-2 h-5 w-1/3 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export default function AllPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);

      try {
        const res = await fetch(`/api/user/properties/get`);

        const data = await res.json();
        setProperties(data.properties ?? []);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <section className="bg-white py-16 px-8 lg:px-12">
      <AnimatedSection className="mx-auto max-w-300">
        <div className="mb-8">
          <h3 className="text-primary font-semibold uppercase tracking-wide text-sm">
            All Properties
          </h3>
          <p className="mt-1 text-gray-500 text-sm">
            Browse all available properties
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {!loading && properties.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-sm font-semibold text-gray-700">
                No properties yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Check back soon - new listings are added regularly.
              </p>
            </div>
          )}

          {!loading &&
            properties.map((property) => {
              const coverImage = getPrimaryPropertyImage(property.image_url);

              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="relative h-55 w-full bg-gray-50">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}

                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold">
                        {property.type}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {property.title}
                    </h4>

                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {property.location}
                    </p>

                    <p className="mt-4 text-primary font-semibold text-sm">
                      RWF {property.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </AnimatedSection>
    </section>
  );
}
