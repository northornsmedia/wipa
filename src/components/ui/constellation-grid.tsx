'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  label: string;
  pulse: number;
}

interface ConstellationGridProps {
  className?: string;
  decorative?: boolean;
  fill?: boolean;
  isDark?: boolean;
  showIntro?: boolean;
  transparent?: boolean;
}

export default function ConstellationGrid({
  className = '',
  decorative = false,
  fill = false,
  isDark,
  showIntro = true,
  transparent = false,
}: ConstellationGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prefersDark, setPrefersDark] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncPreference = (event?: MediaQueryListEvent) => {
      setPrefersDark(event?.matches ?? mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);
    return () => mediaQuery.removeEventListener('change', syncPreference);
  }, []);

  const isDarkMode = isDark ?? prefersDark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: transparent });
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      radius: 220,
    };

    const initNodes = () => {
      nodes = [];
      const spacing = 55;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
          const x = i * spacing;
          const y = j * spacing;
          nodes.push({
            x,
            y,
            vx: 0,
            vy: 0,
            baseX: x,
            baseY: y,
            radius: Math.random() * 1.2 + 1.2,
            label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.prevX = -1000;
      mouse.prevY = -1000;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      mouse.vx = (mouse.x - mouse.prevX) / (dt * 1000 || 1);
      mouse.vy = (mouse.y - mouse.prevY) / (dt * 1000 || 1);
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      const bgColor = isDarkMode ? '#030407' : '#f8fafc';
      const nodeColor = isDarkMode ? '255, 255, 255' : '15, 23, 42';
      const accentColor = isDarkMode ? '217, 70, 239' : '147, 51, 234';

      if (transparent) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
      }

      const springStrength = 18;
      const damping = 0.82;

      for (const node of nodes) {
        node.pulse += dt * 3;

        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && distance > 0) {
          const power = 1 - distance / mouse.radius;
          const force = power * (1500 + speed * 150);
          const angle = Math.atan2(dy, dx);

          node.vx -= Math.cos(angle) * force * dt;
          node.vy -= Math.sin(angle) * force * dt;
        }

        node.vx += (node.baseX - node.x) * springStrength * dt;
        node.vy += (node.baseY - node.y) * springStrength * dt;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx * dt * 60;
        node.y += node.vy * dt * 60;
      }

      const maxConnectionDistance = 75;
      const maxConnectionDistanceSquared = maxConnectionDistance ** 2;

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];

        for (let j = i + 1; j < nodes.length; j += 1) {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < maxConnectionDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            const alpha =
              (1 - distance / maxConnectionDistance) *
              (isDarkMode ? 0.18 : 0.08);

            ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNear = distance < mouse.radius;
        const baseAlpha = isNear ? 0.95 : 0.25 + Math.sin(node.pulse) * 0.1;

        ctx.fillStyle = isNear
          ? `rgba(${accentColor}, ${baseAlpha})`
          : `rgba(${nodeColor}, ${baseAlpha})`;

        const currentRadius = isNear
          ? node.radius * 2.2
          : node.radius + Math.sin(node.pulse) * 0.3;

        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fill();

        if (distance < 90) {
          const pulseRing = ((node.pulse * 20) % 30) + 4;
          const ringAlpha = (1 - pulseRing / 34) * 0.4;

          ctx.strokeStyle = `rgba(${accentColor}, ${ringAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRing, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
          ctx.fillStyle = `rgba(${accentColor}, 0.85)`;
          ctx.fillText(node.label, node.x + 10, node.y - 10);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDarkMode, transparent]);

  return (
    <div
      aria-hidden={decorative || undefined}
      className={`${fill ? 'absolute inset-0 h-full' : 'relative h-screen'} w-full overflow-hidden select-none ${
        transparent ? 'bg-transparent' : 'bg-slate-50 dark:bg-slate-950'
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full cursor-crosshair"
      />

      {showIntro && (
        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white mix-blend-difference">
          <h2 className="font-mono text-6xl font-black leading-none tracking-tighter uppercase md:text-9xl">
            Constellation
          </h2>
          <p className="mt-4 max-w-lg font-mono text-xs opacity-70 md:text-sm">
            High-velocity dynamic mesh. Sweep your cursor quickly across the grid
            to unleash kinetic shockwaves.
          </p>
        </div>
      )}
    </div>
  );
}
