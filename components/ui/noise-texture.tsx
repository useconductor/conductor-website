"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface NoiseTextureProps {
  className?: string;
  opacity?: number;
}

export function NoiseTexture({ className, opacity = 0.03 }: NoiseTextureProps) {
  const id = useId();

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ opacity }}
    >
      <svg className="w-full h-full">
        <filter id={`noise-${id}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noise-${id})`} />
      </svg>
    </div>
  );
}
