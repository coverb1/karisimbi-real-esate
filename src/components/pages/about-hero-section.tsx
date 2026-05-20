import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative h-[52vh] min-h-90 max-h-120 overflow-hidden">
      {/* Background image */}
      <Image
        src="/who-we-are.jpeg"
        alt="Karisimbi Real Estate"
        fill
        priority
        className="object-cover object-[center_60%]"
      />

      {/* Gradient — same layered approach as landing */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-linear-to-t from-primary/20 to-transparent" />

      {/* Content — bottom left, same as landing */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 pb-10 lg:px-14 lg:pb-12">
        <div className="mx-auto w-full max-w-300">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.22em] text-white/80">
              About Us
            </p>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-[clamp(36px,5.5vw,72px)] font-bold leading-[0.95] tracking-[-0.02em] text-white">
            WHO WE ARE
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-95 text-[13.5px] leading-relaxed text-white/80">
            Rwanda's premier property partner — helping families and investors
            find spaces they truly love since 2010.
          </p>
        </div>
      </div>
    </section>
  );
}
