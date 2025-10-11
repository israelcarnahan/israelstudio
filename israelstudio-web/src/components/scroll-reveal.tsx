"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollReveal({ children, delay = 0, y = 28, scale = 0.98 }:{
  children: React.ReactNode; delay?: number; y?: number; scale?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (reduce || !mounted) return <>{children}</>;
  
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
