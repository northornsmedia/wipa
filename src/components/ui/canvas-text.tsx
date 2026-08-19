'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CanvasTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  className?: string;
  backgroundClassName?: string;
  colors?: string[];
  darkColors?: string[];
  lightColors?: string[];
  animationDuration?: number;
  lineWidth?: number;
  lineGap?: number;
  curveIntensity?: number;
  overlay?: boolean;
}

const DEFAULT_LIGHT_COLORS = [
  "#2563eb", // blue-600
  "#0284c7", // sky-600
  "#0891b2", // cyan-600
  "#4f46e5", // indigo-600
  "#7c3aed", // violet-600
  "#0d9488", // teal-600
  "#2563eb",
  "#0369a1"
];

const DEFAULT_DARK_COLORS = [
  "#38bdf8", // sky-400
  "#0ea5e9", // sky-500
  "#60a5fa", // blue-400
  "#818cf8", // indigo-400
  "#a78bfa", // violet-400
  "#38bdf8",
  "#06b6d4", // cyan-500
  "#22d3ee"  // cyan-400
];

export function CanvasText({
  text,
  className = "",
  backgroundClassName = "bg-white dark:bg-neutral-950",
  colors,
  darkColors,
  lightColors,
  animationDuration = 5,
  lineWidth = 1.5,
  lineGap = 10,
  curveIntensity = 60,
  overlay = false,
  ...props
}: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resolve CSS variables if passed in colors array
  const resolveColor = (color: string, element: HTMLElement | null) => {
    if (color.startsWith("var(") && element) {
      const varName = color.slice(4, -1).trim();
      const resolved = getComputedStyle(element).getPropertyValue(varName).trim();
      return resolved || color;
    }
    return color;
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 1),
          height: Math.max(rect.height, 1)
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [text, className]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!canvas || !container || !textEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = performance.now();

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

    const render = (currentTime: number) => {
      const rect = textEl.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      const elapsed = (currentTime - startTime) / 1000;
      const progress = (elapsed % (animationDuration || 5)) / (animationDuration || 5);
      const phase = progress * Math.PI * 2;

      ctx.clearRect(0, 0, width, height);

      const computedStyle = window.getComputedStyle(textEl);
      const fontSize = computedStyle.fontSize;
      const fontFamily = computedStyle.fontFamily;
      const fontWeight = computedStyle.fontWeight;
      const fontStyle = computedStyle.fontStyle;

      // Determine active color set based on current light/dark theme
      const isDark = Boolean(
        container.closest('.dark') ||
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark')
      );

      const activePalette =
        (isDark ? darkColors : lightColors) ||
        colors ||
        (isDark ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS);

      // 1. Draw waving bezier curve lines across the canvas
      ctx.save();

      const numLines = Math.max(Math.floor(height / (lineGap || 10)), 5);
      const effectiveIntensity = Math.min(curveIntensity || 60, Math.max(height * 0.7, 15), Math.max(width * 0.25, 20));

      for (let i = 0; i <= numLines + 4; i++) {
        const color = resolveColor(activePalette[i % activePalette.length], container);
        const baseY = (i - 2) * (lineGap || 10);
        const waveOffset = (i * 0.4) + phase;

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth || 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();

        const cp1x = width * 0.25;
        const cp1y = baseY + Math.sin(waveOffset) * effectiveIntensity;
        const cp2x = width * 0.75;
        const cp2y = baseY + Math.cos(waveOffset + Math.PI / 2) * effectiveIntensity;
        const endX = width;
        const endY = baseY + Math.sin(waveOffset + Math.PI) * (effectiveIntensity * 0.5);

        ctx.moveTo(0, baseY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
      }

      // 2. Clip the canvas to the exact text characters using destination-in compositing
      ctx.globalCompositeOperation = 'destination-in';
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, colors, darkColors, lightColors, animationDuration, lineWidth, lineGap, curveIntensity, className]);

  return (
    <span
      ref={containerRef}
      className={cn(
        "relative inline-block align-baseline overflow-visible select-none",
        overlay ? "absolute inset-0 z-10" : "",
        className
      )}
      {...props}
    >
      {/* Hidden text measuring node to preserve exact layout typography */}
      <span
        ref={textRef}
        aria-hidden="true"
        className={cn(
          "invisible pointer-events-none select-none whitespace-pre",
          className
        )}
      >
        {text}
      </span>

      {/* Animated Canvas with colorful curved lines clipped into the text letters */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          width: dimensions.width ? `${dimensions.width}px` : "100%",
          height: dimensions.height ? `${dimensions.height}px` : "100%"
        }}
      />
      
      {/* Screen reader text */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
