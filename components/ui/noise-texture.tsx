"use client";

import { cn } from "@/lib/utils";

interface NoiseTextureProps {
  className?: string;
  opacity?: number;
  fade?: number;
}

export function NoiseTexture({
  className = "",
  opacity = 0.03,
  fade = 1000,
}: NoiseTextureProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      style={{ opacity }}
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}
