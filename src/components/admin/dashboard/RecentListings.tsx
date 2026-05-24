import Image from "next/image";
import Link from "next/link";
import { getSupabaseServiceRoleClient } from "@/src/lib/supabase-server";
import { getPrimaryPropertyImage } from "@/src/lib/property-images";

const statusColor: Record<string, string> = {
  Featured: "bg-emerald-50 text-emerald-700",
  Active: "bg-blue-50 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
};

// This runs on the server — it fetches the 4 most recently added properties
async function getRecentListings() {
  const supabase = getSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("properties")
    .select("id, title, type, location, price, status, image_url, created_at")
    .order("created_at", { ascending: false }) // newest first
    .limit(4); // only show the last 4

  if (error) {
    console.error("Failed to fetch recent listings:", error.message);
    return [];
  }

  return data ?? [];
}

// Helper — turns 450000000 into "RWF 450,000,000"
function formatPrice(price: number) {
  return `RWF ${price.toLocaleString()}`;
}

export async function RecentListings() {
  const listings = await getRecentListings();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5">
        <h4 className="landing-card-title text-gray-900">Recent Listings</h4>
        <Link
          href="/admin/dashboard/listing"
          className="landing-eyebrow text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {/* Table header */}
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 sm:grid">
          {["Property", "Type", "Price", "Status"].map((h) => (
            <p key={h} className="landing-eyebrow text-gray-400">{h}</p>
          ))}
        </div>

        {/* No properties yet */}
        {listings.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">No properties added yet.</p>
            <Link
              href="/admin/dashboard/add-property"
              className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Add your first property →
            </Link>
          </div>
        )}

        {listings.map((l) => {
          const coverImage = getPrimaryPropertyImage(l.image_url);

          return (
          <div
            key={l.id}
            className="grid grid-cols-1 gap-3 px-4 py-3 transition-colors hover:bg-gray-50/50 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:items-center sm:gap-4 sm:px-5"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Show the real image from Cloudinary, or a grey placeholder if none */}
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={l.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="landing-card-title truncate text-gray-800">{l.title}</p>
                <p className="truncate text-[13px] font-medium text-gray-400">{l.location}</p>
              </div>
            </div>

            <p className="text-[13px] font-medium text-gray-600">{l.type}</p>
            <p className="font-heading text-sm font-semibold text-primary">{formatPrice(l.price)}</p>

            <span
              className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusColor[l.status] ?? "bg-gray-50 text-gray-500"}`}
            >
              {l.status}
            </span>
          </div>
          );
        })}
      </div>
    </div>
  );
}
