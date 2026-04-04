"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollVelocityProps {
  text: string;
  className?: string;
  velocity?: number;
}

export function ScrollVelocity({
  text,
  className = "",
  velocity = 2,
}: ScrollVelocityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, velocity * 100]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden py-8", className)}>
      <motion.div style={{ x }} className="whitespace-nowrap">
        <span className="text-6xl font-mono font-bold tracking-tighter text-[#222]">
          {text}
        </span>
        <span className="text-6xl font-mono font-bold tracking-tighter text-[#222] ml-8">
          {text}
        </span>
        <span className="text-6xl font-mono font-bold tracking-tighter text-[#222] ml-8">
          {text}
        </span>
      </motion.div>
    </div>
  );
}
