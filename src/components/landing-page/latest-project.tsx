"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "../animations/AnimatedSection";

const projects = [
  {
    id: 1,
    title: "The Sanctuary",
    location: "Kiyovu",
    year: "2024",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900",
  },
  {
    id: 2,
    title: "The Cascade Retreat",
    location: "Bumbogo",
    year: "2024",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",
  },
  {
    id: 3,
    title: "Panorama Residences",
    location: "Nyanza Hill",
    year: "2025",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900",
  },
];

export function LatestProjects() {
  return (
    <section className="bg-[#f7f7f8] py-16 px-8 lg:px-12">
      <AnimatedSection className="mx-auto max-w-300">
        {/* ── HEADER ── */}
        <div className="mb-10 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="mb-8">
            <h4 className="font-heading  font-black uppercase tracking-wide text-primary">
              Our Projects
            </h4>
            <p className="mt-1 text-gray-500">Our Latest Projects</p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 self-start lg:self-end
                       text-[13px] font-semibold text-primary no-underline
                       border-b border-primary/40 pb-0.5
                       transition-all duration-200 hover:border-primary whitespace-nowrap"
          >
            See All Projects <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── PROJECT CARDS ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group relative overflow-hidden rounded-2xl no-underline
                         h-75 lg:h-85
                         transition-all duration-300 hover:-translate-y-1
                         hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            >
              {/* Image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="m-0 mb-1.5 text-[5px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {project.location} · {project.year}
                </p>
                <h4 className="m-0 font-heading text-[20px] font-bold text-white leading-tight">
                  {project.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
