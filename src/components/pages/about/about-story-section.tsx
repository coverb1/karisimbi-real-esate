import Image from "next/image";

export function AboutStory() {
  return (
    <section className="py-20 px-8 lg:px-12">
      <div className="mx-auto max-w-300">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: text */}
          <div>
            <div className="mb-8">
              <h3 className="font-heading font-black uppercase tracking-wide text-primary">
                About the Company
              </h3>

              <p className="mt-1 text-gray-500">
                Trusted real estate services across Rwanda
              </p>
            </div>

            <div className="flex flex-col gap-4 text-[15px] leading-[1.9] text-gray-500">
              <p className="m-0">
                Karisimbi Real Estate is a professional real estate company
                specialized in helping clients buy, sell, and invest in
                properties across Rwanda.
              </p>

              <p className="m-0">
                We focus on providing trusted services in land sales, house
                sales, property marketing, and real estate consultancy while
                ensuring transparency and customer satisfaction.
              </p>

              <p className="m-0">
                Our goal is to connect clients with quality properties at
                affordable prices while guiding them through every step of the
                transaction process securely and professionally.
              </p>
            </div>
          </div>

          {/* Right: image + floating card */}
          <div className="relative">
            <div className="overflow-hidden rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.1)]">
              <Image
                src="https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?w=900&q=80"
                alt="Karisimbi Real Estate"
                width={900}
                height={520}
                className="h-120 w-full object-cover"
              />
            </div>

            {/* Floating accent card */}
            <div
              className="absolute -bottom-6 -left-6 rounded-2xl bg-primary px-7 py-5
                         shadow-[0_20px_50px_rgba(122,34,64,0.35)]"
            >
              <p className="font-heading m-0 text-[40px] font-bold leading-none text-white">
                100%
              </p>

              <p className="mt-1.5 text-[11px] uppercase tracking-widest text-white/70">
                Trusted Services
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}