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
  animationType?: 'aurora' | 'lines' | 'particles';
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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  color: string;
}

export function CanvasText({
  text,
  className = "",
  backgroundClassName = "bg-white dark:bg-neutral-950",
  colors,
  darkColors,
  lightColors,
  animationDuration = 4,
  lineWidth = 1.5,
  lineGap = 8,
  curveIntensity = 30,
  overlay = false,
  animationType = 'aurora',
  ...props
}: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    // Initialize particles once for aurora/particle animation
    const initParticles = (width: number, height: number, palette: string[]) => {
      const count = 35;
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.3 - Math.random() * 0.6,
          radius: 1 + Math.random() * 2.5,
          alpha: 0.2 + Math.random() * 0.8,
          pulseSpeed: 0.02 + Math.random() * 0.04,
          color: palette[i % palette.length]
        });
      }
      particlesRef.current = particles;
    };

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
        initParticles(width, height, DEFAULT_DARK_COLORS);
      }

      const elapsed = (currentTime - startTime) / 1000;
      const progress = (elapsed % animationDuration) / animationDuration;
      const phase = progress * Math.PI * 2;

      ctx.clearRect(0, 0, width, height);

      const computedStyle = window.getComputedStyle(textEl);
      const fontSize = computedStyle.fontSize;
      const fontFamily = computedStyle.fontFamily;
      const fontWeight = computedStyle.fontWeight;
      const fontStyle = computedStyle.fontStyle;

      const isDark = Boolean(
        container.closest('.dark') ||
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark')
      );

      const activePalette =
        (isDark ? darkColors : lightColors) ||
        colors ||
        (isDark ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS);

      ctx.save();

      if (animationType === 'aurora') {
        // --- 1. DYNAMIC LIQUID GRADIENT WAVE ---
        const gradX1 = width * 0.5 + Math.sin(phase) * (width * 0.4);
        const gradY1 = height * 0.5 + Math.cos(phase * 0.8) * (height * 0.5);
        const gradX2 = width * 0.5 - Math.sin(phase * 1.2) * (width * 0.4);
        const gradY2 = height * 0.5 - Math.cos(phase) * (height * 0.5);

        const gradient = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
        activePalette.forEach((col, idx) => {
          const stop = (idx / (activePalette.length - 1) + progress) % 1;
          gradient.addColorStop(stop, resolveColor(col, container));
        });

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // --- 2. FLOATING PARTICLE SPARKLES ---
        if (particlesRef.current.length === 0) {
          initParticles(width, height, activePalette);
        }

        particlesRef.current.forEach((p) => {
          p.x += p.vx + Math.sin(elapsed * 2 + p.y * 0.05) * 0.3;
          p.y += p.vy;
          p.alpha += Math.sin(elapsed * p.pulseSpeed * 10) * 0.03;

          // Wrap boundaries
          if (p.y < 0) p.y = height + 5;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = resolveColor(p.color, container);
          ctx.globalAlpha = Math.max(0.2, Math.min(1, p.alpha));
          ctx.shadowColor = resolveColor(p.color, container);
          ctx.shadowBlur = 8;
          ctx.fill();
        });

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // --- 3. HIGH-GLOSS LIGHT SHIMMER SWEEP ---
        const sweepPos = ((elapsed * 0.6) % 2) * (width * 1.8) - width * 0.4;
        const sweepGrad = ctx.createLinearGradient(
          sweepPos,
          0,
          sweepPos + width * 0.3,
          height
        );
        sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
        sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, 0, width, height);

      } else {
        // --- WAVING LINES ANIMATION ---
        const numLines = Math.max(Math.floor(height / (lineGap || 8)), 5);
        const effectiveIntensity = Math.min(curveIntensity || 30, Math.max(height * 0.7, 15));

        for (let i = 0; i <= numLines + 4; i++) {
          const color = resolveColor(activePalette[i % activePalette.length], container);
          const baseY = (i - 2) * (lineGap || 8);
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
      }

      // --- CLIP CANVAS TO EXACT TEXT CHARACTERS ---
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
  }, [text, colors, darkColors, lightColors, animationDuration, lineWidth, lineGap, curveIntensity, className, animationType]);

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

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_2px_12px_rgba(56,189,248,0.3)]"
        style={{
          width: dimensions.width ? `${dimensions.width}px` : "100%",
          height: dimensions.height ? `${dimensions.height}px` : "100%"
        }}
      />
      
      <span className="sr-only">{text}</span>
    </span>
  );
}

