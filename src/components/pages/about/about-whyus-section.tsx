import Link from "next/link";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

const reasons = [
  {
    title: "Trusted Services",
    description:
      "We provide transparent and reliable real estate services for every client.",
  },
  {
    title: "Affordable Properties",
    description:
      "Access quality homes, plots, and investment opportunities at affordable prices.",
  },
  {
    title: "Professional Support",
    description:
      "Our team supports clients throughout every step of the buying and selling process.",
  },
  {
    title: "Secure Transactions",
    description:
      "We ensure smooth and secure property transactions with proper legal guidance.",
  },
  {
    title: "Market Experience",
    description:
      "Experienced in Rwanda’s real estate market with strong local property knowledge.",
  },
  {
    title: "Ownership Assistance",
    description:
      "We assist clients from the first inquiry up to ownership transfer and documentation.",
  },
];

export function AboutWhyUs() {
  return (
    <section className="bg-[#fafafa] py-20 px-8 lg:px-12">
      <div className="mx-auto max-w-300">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-10">
            <div className="mb-8">
              <h3 className="font-heading font-black uppercase tracking-wide text-primary">
                Why Karisimbi
              </h3>

              <p className="mt-1 text-gray-500">
                Why clients choose us
              </p>
            </div>

            <p className="mb-9 max-w-95 text-[15px] leading-[1.85] text-gray-500">
              Karisimbi Real Estate focuses on trusted services, customer
              satisfaction, and helping clients find the right property across
              Rwanda with confidence and security.
            </p>

            <Link
              href="/properties"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5
                         text-[13px] font-semibold text-white no-underline
                         transition-all duration-200 hover:bg-primary/90 hover:-translate-y-px
                         shadow-[0_4px_20px_rgba(122,34,64,0.25)] hover:shadow-[0_8px_28px_rgba(122,34,64,0.35)]"
            >
              View Properties <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Right */}
          <div className="flex flex-col">
            {reasons.map(({ title, description }) => (
              <div
                key={title}
                className="flex gap-4 border-b border-gray-200 py-6 last:border-0"
              >
                <CheckCircle2
                  size={20}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <div>
                  <h4 className="mb-1.5 text-[15px] font-semibold text-gray-900">
                    {title}
                  </h4>

                  <p className="m-0 text-[13.5px] leading-[1.7] text-gray-500">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}