const principles = [
  {
    icon: "/mission.png",
    title: "Our Mission",
    description:
      "To provide exceptional real estate services that transform dreams into reality, connecting people with perfect properties through trust, expertise, and dedication.",
  },
  {
    icon: "/vision.png",
    title: "Our Vision",
    description:
      "To be the most trusted and innovative real estate company in Rwanda, setting new standards for excellence in property transactions and client satisfaction.",
  },
  {
    icon: "/values.png",
    title: "Our Values",
    description:
      "Integrity, transparency, professionalism, and a client-first approach guide everything we do. We believe in building lasting relationships beyond transactions.",
  },
];

export function AboutPrinciples() {
  return (
    <section className="bg-[#fafafa] py-20 px-8 lg:px-12">
      <div className="mx-auto max-w-300">
        {/* Header */}
        <div className="mb-8">
            <h3 className="font-heading  font-black uppercase tracking-wide text-primary">
              What Drives Us
            </h3>
            <p className="mt-1 text-gray-500">Our Core Principles</p>
          </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {principles.map(({ icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-100 bg-white p-9
                         transition-all duration-300
                         hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
            >
              {/* Icon badge */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[14px]">
                <img src={icon} alt={title} className="h-10 w-10 object-contain" />
              </div>

              <h3 className="font-heading mb-4 text-[24px] font-bold text-gray-900">
                {title}
              </h3>
              <p className="text-[14px] leading-[1.8] text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
