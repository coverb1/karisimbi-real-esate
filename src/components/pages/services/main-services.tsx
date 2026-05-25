import Image from "next/image";
import Link from "next/link";
import { Home, TrendingUp, Users, Check, ArrowUpRight } from "lucide-react";

const mainServices = [
  {
    icon: Home,
    title: "Property Buying",
    description:
      "Find your perfect home from our curated selection of premium properties across Rwanda.",
    features: [
      "Personalized property search",
      "Market analysis & insights",
      "Negotiation support",
      "Property viewing coordination",
      "Purchase assistance",
    ],
    image:
      "https://images.unsplash.com/photo-1564703048291-bcf7f001d83d?w=900&q=80",
    cta: "Browse Properties",
    href: "/properties",
  },
  {
    icon: TrendingUp,
    title: "Property Selling",
    description:
      "Maximize your property value with our expert marketing and sales strategies.",
    features: [
      "Professional property valuation",
      "Premium listing placement",
      "Professional photography",
      "Marketing strategy",
      "Qualified buyer matching",
    ],
    image:
      "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=900&q=80",
    cta: "Sell Your Property",
    href: "/sell-property",
  },
  {
    icon: Users,
    title: "Property Visits",
    description:
      "Schedule convenient property viewings with our professional agents guiding every step.",
    features: [
      "Flexible scheduling",
      "Expert guided tours",
      "Detailed property insights",
      "Transportation assistance",
      "Multiple property visits",
    ],
    image:
      "https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?w=900&q=80",
    cta: "Book a Visit",
    href: "/book-visit",
  },
];

export function MainServices() {
  return (
    <section className="py-20 px-8 lg:px-12">
      <div className="mx-auto max-w-300 flex flex-col gap-24">
        {mainServices.map(
          (
            { icon: Icon, title, description, features, image, cta, href },
            idx,
          ) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={title}
                className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                {/* Text */}
                <div className={isEven ? "lg:order-1" : "lg:order-2"}>
                  {/* Service label */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-primary">
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                        className="text-white"
                      />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Service {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-heading mb-4 text-[clamp(30px,4vw,48px)] font-bold leading-[1.05] text-primary">
                    {title}
                  </h3>
                  <p className="mb-7 text-[15px] leading-[1.85] text-gray-500">
                    {description}
                  </p>

                  {/* Features */}
                  <ul className="mb-9 flex flex-col gap-3 list-none p-0 m-0">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check
                            size={11}
                            strokeWidth={2.5}
                            className="text-primary"
                          />
                        </div>
                        <span className="text-[14px] text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={href}
                    className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5
                             text-[13px] font-semibold text-white no-underline
                             transition-all duration-200 hover:bg-primary/90 hover:-translate-y-px
                             shadow-[0_4px_20px_rgba(122,34,64,0.25)] hover:shadow-[0_8px_28px_rgba(122,34,64,0.35)]"
                  >
                    {cta} <ArrowUpRight size={15} />
                  </Link>
                </div>

                {/* Image */}
                <div
                  className={`relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.10)]">
                    <Image
                      src={image}
                      alt={title}
                      width={900}
                      height={480}
                      className="h-105 w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>

                  {/* Floating number accent */}
                  <div
                    className={`absolute -bottom-4 bg-primary rounded-2xl px-5 py-4
                              shadow-[0_12px_36px_rgba(122,34,64,0.30)]
                              ${isEven ? "-right-4" : "-left-4"}`}
                  >
                    <p className="font-heading m-0 text-[32px] font-bold leading-none text-white">
                      0{idx + 1}
                    </p>
                    <p className="m-0 mt-0.5 text-[10px] uppercase tracking-[0.12em] text-white/60">
                      Service
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}
