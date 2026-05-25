import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Initial Consultation",
    description:
      "We discuss your needs, preferences, and budget to understand exactly what you're looking for.",
  },
  {
    step: "02",
    title: "Property Search",
    description:
      "Our team curates properties that match your criteria from our extensive database.",
  },
  {
    step: "03",
    title: "Property Viewing",
    description:
      "Schedule visits to shortlisted properties with our expert agents guiding you through.",
  },
  {
    step: "04",
    title: "Negotiation",
    description:
      "We help you negotiate the best price and terms to ensure a fair and beneficial deal.",
  },
  {
    step: "05",
    title: "Documentation",
    description:
      "Our legal team handles all paperwork, contracts, and regulatory compliance.",
  },
  {
    step: "06",
    title: "Closing",
    description:
      "Complete the transaction with our full support, ensuring a smooth handover and settlement.",
  },
];

export function ServiceProcess() {
  return (
    <section className="py-20 px-8 lg:px-12">
      <div className="mx-auto max-w-300">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr] lg:items-start">
          {/* Left — sticky */}
          <div className="lg:sticky lg:top-28">
            <div className="mb-8">
              <h3 className="font-heading  font-black uppercase tracking-wide text-primary">
                How It Works
              </h3>
              <p className="mt-1 text-gray-500">Our 6-Step Process</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5
                         text-[13px] font-semibold text-white no-underline
                         shadow-[0_4px_20px_rgba(122,34,64,0.25)]
                         transition-all duration-200 hover:bg-primary/90 hover:-translate-y-px
                         hover:shadow-[0_8px_28px_rgba(122,34,64,0.35)]"
            >
              Start Now <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Right — steps */}
          <div className="flex flex-col">
            {steps.map(({ step, title, description }, idx) => (
              <div
                key={step}
                className={`flex gap-7 py-7 ${idx < steps.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                {/* Step number */}
                <div className="w-12 shrink-0 pt-1">
                  <span className="font-heading text-[38px] font-bold leading-none text-gray-100">
                    {step}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h4 className="mb-2 text-[16px] font-semibold text-gray-900">
                    {title}
                  </h4>
                  <p className="m-0 text-[13.5px] leading-[1.8] text-gray-500">
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
