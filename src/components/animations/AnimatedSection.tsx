"use client";

import { motion } from "framer-motion";

export function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
