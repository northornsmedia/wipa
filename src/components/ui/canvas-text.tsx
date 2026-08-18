'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CanvasTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  className?: string;
  backgroundClassName?: string;
  colors?: string[];
  lineGap?: number;
  animationDuration?: number;
}

export function CanvasText({
  text,
  className,
  backgroundClassName = 'bg-blue-600 dark:bg-blue-700',
  colors = [
    "rgba(0, 153, 255, 1)",
    "rgba(0, 153, 255, 0.9)",
    "rgba(0, 153, 255, 0.8)",
    "rgba(0, 153, 255, 0.7)",
    "rgba(0, 153, 255, 0.6)",
    "rgba(0, 153, 255, 0.5)",
    "rgba(0, 153, 255, 0.4)",
    "rgba(0, 153, 255, 0.3)",
    "rgba(0, 153, 255, 0.2)",
    "rgba(0, 153, 255, 0.1)",
  ],
  lineGap = 4,
  animationDuration = 20,
  ...props
}: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.03 * (20 / (animationDuration || 20));
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const waveCount = colors.length || 10;

      for (let i = 0; i < waveCount; i++) {
        const color = colors[i % colors.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        const offset = (i * Math.PI) / waveCount;
        const amplitude = Math.min(height * 0.35, 16);
        const frequency = 0.04;

        for (let x = 0; x <= width; x += 2) {
          const y =
            height / 2 +
            Math.sin(x * frequency + time + offset) *
              amplitude *
              Math.sin((x / width) * Math.PI);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, lineGap, animationDuration]);

  return (
    <span
      ref={containerRef}
      className={cn(
        'relative inline-flex items-center justify-center px-3 py-1 rounded-xl overflow-hidden font-extrabold text-white align-baseline shadow-sm',
        backgroundClassName,
        className
      )}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85 mix-blend-screen"
      />
      <span className="relative z-10">{text}</span>
    </span>
  );
}
