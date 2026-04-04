"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";

interface MagneticDockProps {
  children: ReactNode;
  className?: string;
  magnification?: number;
  baseItemSize?: number;
}

interface DockItemProps {
  children: ReactNode;
  className?: string;
}

function DockItem({ children, className }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 56, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn("flex items-center justify-center", className)}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {children}
    </motion.div>
  );
}

export function MagneticDock({ children, className = "" }: MagneticDockProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-end gap-1 px-3 py-2",
        "rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { DockItem };
