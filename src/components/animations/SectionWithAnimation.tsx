"use client";

import { AnimatedSection } from "./AnimatedSection";

export function SectionWithAnimation({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <AnimatedSection className={className}>{children}</AnimatedSection>;
}
