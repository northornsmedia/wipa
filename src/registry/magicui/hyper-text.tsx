'use client';

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HyperTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
  animateOnHover?: boolean;
  characterSet?: string[] | readonly string[];
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("")
);

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  ...props
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState<string[]>(() => children.split(""));
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0;
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setIsAnimating(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsAnimating(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, startOnView]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      const maxIterations = children.length;
      interval = setInterval(() => {
        if (iterationCount.current < maxIterations) {
          setDisplayText((currentText) =>
            currentText.map((letter, i) => {
              if (letter === " ") return " ";
              if (i <= iterationCount.current) {
                return children[i];
              }
              return characterSet[
                Math.floor(Math.random() * characterSet.length)
              ];
            })
          );
          iterationCount.current += 0.2;
        } else {
          setIsAnimating(false);
          setDisplayText(children.split(""));
          clearInterval(interval);
        }
      }, duration / (children.length * 5));
    }

    return () => clearInterval(interval);
  }, [children, duration, isAnimating, characterSet]);

  return (
    <div
      ref={elementRef}
      className={cn("overflow-hidden py-2 font-bold select-none", className)}
      onMouseEnter={handleAnimationTrigger}
      {...props}
    >
      <AnimatePresence mode="wait">
        {displayText.map((letter, i) => (
          <motion.span
            key={i}
            className={cn("inline-block font-mono", letter === " " ? "w-2 sm:w-3" : "")}
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
