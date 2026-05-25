"use client";

import { AnimatedSection } from "./AnimatedSection";

export function SectionWithAnimation({
  children,
  className,
  animation,
  delay,
  duration,
}: {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale-up";
  delay?: number;
  duration?: number;
}) {
  return (
    <AnimatedSection
      className={className}
      animation={animation}
      delay={delay}
      duration={duration}
    >
      {children}
    </AnimatedSection>
  );
}
