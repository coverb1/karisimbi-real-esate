import Image from "next/image";
import Link from "next/link";

const listings = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    type: "Villa",
    location: "Kigali Heights",
    price: "RWF 450,000,000",
    status: "Featured",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120",
  },
  {
    id: 2,
    title: "Contemporary Family Home",
    type: "Family House",
    location: "Nyarutarama",
    price: "RWF 320,000,000",
    status: "Active",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=120",
  },
  {
    id: 3,
    title: "Executive Penthouse",
    type: "Penthouse",
    location: "Gacuriro",
    price: "RWF 280,000,000",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120",
  },
  {
    id: 4,
    title: "Garden View Residence",
    type: "House",
    location: "Kimihurura",
    price: "RWF 210,000,000",
    status: "Featured",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120",
  },
];

const statusColor: Record<string, string> = {
  Featured: "bg-emerald-50 text-emerald-700",
  Active: "bg-blue-50 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
};

export function RecentListings() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5">
        <h4 className="landing-card-title text-gray-900">Recent Listings</h4>
        <Link
          href="/admin/listings"
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

        {listings.map((l) => (
          <div
            key={l.id}
            className="grid grid-cols-1 gap-3 px-4 py-3 transition-colors hover:bg-gray-50/50 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:items-center sm:gap-4 sm:px-5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <Image src={l.image} alt={l.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="landing-card-title truncate text-gray-800">{l.title}</p>
                <p className="truncate text-[13px] font-medium text-gray-400">{l.location}</p>
              </div>
            </div>
            <p className="text-[13px] font-medium text-gray-600">{l.type}</p>
            <p className="font-heading text-sm font-semibold text-primary">{l.price}</p>
            <span
              className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusColor[l.status]}`}
            >
              {l.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
