import Image from "next/image";
import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface PageHeroProps {
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: BreadcrumbItem[];
  descriptionClassName?: string;
}

export function PageHero({
  imageSrc,
  imageAlt,
  imagePosition = "center 50%",
  eyebrow,
  title,
  description,
  breadcrumb,
  descriptionClassName = "text-white/55",
}: PageHeroProps) {
  return (
    <section className="relative h-[52vh] min-h-90 max-h-120 overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        style={{ objectPosition: imagePosition }}
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-linear-to-t from-primary/20 to-transparent" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 pb-10 lg:px-14 lg:pb-12">
        <div className="mx-auto w-full max-w-300">
          {breadcrumb && (
            <div className="mb-4 flex items-center gap-2">
              {breadcrumb.map((item, index) => (
                <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                  {index > 0 && <span className="text-white/25 text-[11px]">›</span>}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-[11px] uppercase tracking-[0.14em] text-white/45 no-underline hover:text-white/70 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/80">
                      {item.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">
              {eyebrow}
            </p>
          </div>

          <h1 className="font-heading text-[clamp(36px,5.5vw,72px)] font-bold leading-[0.95] tracking-[-0.02em] text-white">
            {title}
          </h1>

          <p className={`mt-4 max-w-110 text-[13.5px] leading-relaxed ${descriptionClassName}`}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
