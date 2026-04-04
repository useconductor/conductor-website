"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface HyperTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function HyperText({
  text,
  className = "",
  duration = 800,
  delay = 0,
  as: Component = "span",
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = () => {
    setIsAnimating(true);
    setDisplayText("");

    const iterations = Math.ceil(duration / 50);
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      const progress = iteration / iterations;
      let result = "";

      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
          continue;
        }
        if (progress * text.length > i) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);
      iteration++;

      if (iteration > iterations) {
        clearInterval(intervalRef.current!);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, 50);
  };

  useEffect(() => {
    const timeout = setTimeout(scramble, delay);
    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, duration, delay]);

  return <Component className={className}>{displayText}</Component>;
}
