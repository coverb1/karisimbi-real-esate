import { Home, TrendingUp, Users, FileText, Scale, Shield } from "lucide-react";

const additionalServices = [
  {
    icon: FileText,
    title: "Property Valuation",
    description:
      "Accurate, market-based valuations for your property from certified professionals.",
  },
  {
    icon: Scale,
    title: "Legal Services",
    description:
      "Complete legal support including documentation, contracts, and compliance verification.",
  },
  {
    icon: Shield,
    title: "Investment Consulting",
    description:
      "Expert guidance on property investment opportunities and portfolio management.",
  },
  {
    icon: Home,
    title: "Property Management",
    description:
      "Comprehensive management services for rental properties and estates.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description:
      "Detailed market research and trend analysis to inform every decision you make.",
  },
  {
    icon: Users,
    title: "Consultation Services",
    description:
      "One-on-one consultations to discuss your real estate needs and long-term goals.",
  },
];

export function AdditionalServices() {
  return (
    <section className="bg-[#fafafa] py-20 px-8 lg:px-12">
      <div className="mx-auto max-w-300">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="mb-8">
              <h3 className="font-heading  font-black uppercase tracking-wide text-primary">
                Additional Services
              </h3>
              <p className="mt-1 text-gray-500">More Ways We Help</p>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {additionalServices.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-100 bg-white p-8
                         transition-all duration-300
                         hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
            >
              <div
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-[13px] bg-primary
                              transition-transform duration-300 group-hover:scale-105"
              >
                <Icon size={19} strokeWidth={1.8} className="text-white" />
              </div>
              <h4 className="mb-3 text-[16px] font-semibold text-gray-900">
                {title}
              </h4>
              <p className="m-0 text-[13.5px] leading-[1.8] text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
