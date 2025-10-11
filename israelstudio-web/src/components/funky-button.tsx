"use client";
import { motion, useReducedMotion } from "framer-motion";

export function FunkyButton({ children, className = "", ...props }: any) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileHover={reduce ? undefined : { scale: 1.04, rotate: -0.6 }}
      whileTap={{ scale: 0.98 }}
      className={`btn btn-primary ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

