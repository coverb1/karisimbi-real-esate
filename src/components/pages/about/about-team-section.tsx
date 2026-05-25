import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import { Button } from "../../ui/button";

const team = [
  {
    name: "Diane Uwera",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1763479169474-728a7de108c3?w=600",
    bio: "15+ years in real estate development across East Africa.",
  },
  {
    name: "Patrick Mugabo",
    role: "Head of Sales",
    image: "https://images.unsplash.com/photo-1770199105692-9e52ff137cad?w=600",
    bio: "Expert in luxury property markets and client relations.",
  },
  {
    name: "Grace Mutesi",
    role: "Legal Advisor",
    image: "https://images.unsplash.com/photo-1770199105714-a5a349546346?w=600",
    bio: "Specialist in property law and full legal compliance.",
  },
];

export function AboutTeam() {
  return (
    <section className="py-20 px-8 lg:px-12">
      <div className="mx-auto max-w-300">
        <div className="mb-8">
            <h3 className="font-heading  font-black uppercase tracking-wide text-primary">
             The Team
            </h3>
            <p className="mt-1 text-gray-500">Meet Our Team</p>
          </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {team.map(({ name, role, image, bio }, i) => (
            <div key={name} className="group flex flex-col">
              {/* Photo */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ aspectRatio: "3/3" }}
              >
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />

                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />

                {/* Social icons — appear on hover */}
                <div
                  className="absolute right-4 top-4 flex flex-col gap-2
                                opacity-0 translate-y-2 transition-all duration-300
                                group-hover:opacity-100 group-hover:translate-y-0"
                >
                  <Button
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md
                                     border border-white/25 text-white hover:bg-white hover:text-primary transition-colors duration-200"
                  >
                    <Linkedin size={14} strokeWidth={2} />
                  </Button>
                  <Button
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md
                                     border border-white/25 text-white hover:bg-white hover:text-primary transition-colors duration-200"
                  >
                    <Mail size={14} strokeWidth={2} />
                  </Button>
                </div>

                {/* Index number */}
                <div className="absolute left-5 top-5">
                  <span className="font-heading text-[11px] font-bold text-white/30">
                    0{i + 1}
                  </span>
                </div>
              </div>

              {/* Text below */}
              <div className="mt-5 flex items-start justify-between">
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 leading-tight">
                    {name}
                  </h4>
                  <p className="mt-1 text-base font-medium uppercase tracking-[0.12em] text-primary">
                    {role}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 max-w-64">
                    {bio}
                  </p>
                </div>
              </div>

              {/* Bottom accent line that grows on hover */}
              <div className="mt-5 h-px w-full bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
